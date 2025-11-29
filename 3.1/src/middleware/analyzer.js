/**
 * JSON Analyzer - Deep structure analysis of any JSON
 * Detects workflow patterns, builds AST, identifies flow types
 */

export class JSONAnalyzer {
    constructor() {
        this.patterns = {
            triggers: ['trigger', 'when', 'if', 'on', 'event', 'condition', 'start'],
            actions: ['action', 'actions', 'steps', 'tasks', 'operations', 'do', 'then', 'execute'],
            conditionals: ['if', 'then', 'else', 'switch', 'case'],
            loops: ['forEach', 'for', 'while', 'map', 'loop', 'iterate'],
            parallel: ['parallel', 'concurrent', 'all', 'race']
        };
    }

    /**
     * Main analysis entry point
     */
    analyze(json) {
        const ast = this.buildAST(json);
        const patterns = this.detectPatterns(json);
        const complexity = this.calculateComplexity(ast);
        const flowType = this.determineFlowType(patterns);

        return {
            ast,
            patterns,
            complexity,
            flowType,
            metadata: {
                nodeCount: this.countNodes(ast),
                maxDepth: this.getMaxDepth(ast),
                hasCycles: this.detectCycles(patterns)
            }
        };
    }

    /**
     * Build Abstract Syntax Tree from JSON
     */
    buildAST(node, parent = null, key = 'root', depth = 0) {
        const astNode = {
            id: this.generateId(),
            key,
            type: this.getNodeType(node),
            value: node,
            parent,
            depth,
            children: []
        };

        if (typeof node === 'object' && node !== null) {
            if (Array.isArray(node)) {
                node.forEach((item, index) => {
                    const child = this.buildAST(item, astNode, `[${index}]`, depth + 1);
                    astNode.children.push(child);
                });
            } else {
                Object.entries(node).forEach(([k, v]) => {
                    const child = this.buildAST(v, astNode, k, depth + 1);
                    astNode.children.push(child);
                });
            }
        }

        return astNode;
    }

    /**
     * Detect workflow patterns in JSON
     */
    detectPatterns(json, path = []) {
        const detected = {
            triggers: [],
            actions: [],
            conditionals: [],
            loops: [],
            parallel: [],
            sequences: []
        };

        const traverse = (obj, currentPath) => {
            if (!obj || typeof obj !== 'object') return;

            if (Array.isArray(obj)) {
                // Detect sequences
                if (obj.length > 1 && this.isActionSequence(obj)) {
                    detected.sequences.push({
                        path: currentPath,
                        items: obj,
                        length: obj.length
                    });
                }

                obj.forEach((item, idx) => {
                    traverse(item, [...currentPath, idx]);
                });
            } else {
                Object.entries(obj).forEach(([key, value]) => {
                    const newPath = [...currentPath, key];

                    // Check for triggers
                    if (this.patterns.triggers.includes(key.toLowerCase())) {
                        detected.triggers.push({
                            path: newPath,
                            key,
                            value,
                            type: this.inferTriggerType(value)
                        });
                    }

                    // Check for actions
                    if (this.patterns.actions.includes(key.toLowerCase())) {
                        detected.actions.push({
                            path: newPath,
                            key,
                            value,
                            isArray: Array.isArray(value),
                            count: Array.isArray(value) ? value.length : 1
                        });
                    }

                    // Check for conditionals
                    if (this.patterns.conditionals.includes(key.toLowerCase())) {
                        detected.conditionals.push({
                            path: newPath,
                            key,
                            value,
                            branches: this.extractBranches(obj)
                        });
                    }

                    // Check for loops
                    if (this.patterns.loops.includes(key.toLowerCase())) {
                        detected.loops.push({
                            path: newPath,
                            key,
                            value,
                            iterationType: key
                        });
                    }

                    // Check for parallel
                    if (this.patterns.parallel.includes(key.toLowerCase())) {
                        detected.parallel.push({
                            path: newPath,
                            key,
                            value,
                            taskCount: Array.isArray(value) ? value.length : 0
                        });
                    }

                    traverse(value, newPath);
                });
            }
        };

        traverse(json, path);
        return detected;
    }

    /**
     * Calculate workflow complexity
     */
    calculateComplexity(ast) {
        const metrics = {
            totalNodes: 0,
            maxDepth: 0,
            branchingFactor: 0,
            cyclomaticComplexity: 1 // Start at 1
        };

        const traverse = (node) => {
            metrics.totalNodes++;
            metrics.maxDepth = Math.max(metrics.maxDepth, node.depth);

            if (node.children.length > 0) {
                metrics.branchingFactor = Math.max(metrics.branchingFactor, node.children.length);
                node.children.forEach(traverse);
            }
        };

        traverse(ast);

        // Simple complexity score
        return {
            ...metrics,
            score: Math.min(10, Math.ceil(
                (metrics.totalNodes * 0.1) +
                (metrics.maxDepth * 0.5) +
                (metrics.branchingFactor * 0.3)
            ))
        };
    }

    /**
     * Determine overall flow type
     */
    determineFlowType(patterns) {
        if (patterns.loops.length > 0) return 'iterative';
        if (patterns.conditionals.length > 0) return 'conditional';
        if (patterns.parallel.length > 0) return 'parallel';
        if (patterns.sequences.length > 0) return 'sequential';
        return 'simple';
    }

    // Helper methods
    getNodeType(value) {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object') return 'object';
        return typeof value;
    }

    generateId() {
        return `ast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    countNodes(ast) {
        let count = 1;
        ast.children.forEach(child => {
            count += this.countNodes(child);
        });
        return count;
    }

    getMaxDepth(ast) {
        if (ast.children.length === 0) return ast.depth;
        return Math.max(...ast.children.map(child => this.getMaxDepth(child)));
    }

    detectCycles(patterns) {
        return patterns.loops.length > 0;
    }

    isActionSequence(arr) {
        return arr.every(item =>
            typeof item === 'string' ||
            (typeof item === 'object' && (item.action || item.step || item.task))
        );
    }

    inferTriggerType(value) {
        if (typeof value === 'string') return 'event';
        if (typeof value === 'object' && value !== null) {
            const keys = Object.keys(value);
            if (keys.some(k => ['>', '<', '>=', '<=', '==', '!='].some(op => value[k]?.includes?.(op)))) {
                return 'condition';
            }
            return 'complex';
        }
        return 'simple';
    }

    extractBranches(obj) {
        const branches = [];
        if (obj.then) branches.push({ type: 'then', value: obj.then });
        if (obj.else) branches.push({ type: 'else', value: obj.else });
        if (obj.case) branches.push({ type: 'case', value: obj.case });
        return branches;
    }
}
