/**
 * Workflow Transformer - Converts analyzed JSON to standardized workflow format
 * Maps AST nodes to workflow entities, generates IDs, extracts metadata
 */

export class WorkflowTransformer {
    constructor() {
        this.nodeCounter = 0;
        this.edgeCounter = 0;
    }

    /**
     * Main transformation entry point
     */
    transform(analysis) {
        this.reset();

        const nodes = this.buildNodes(analysis);
        const edges = this.buildEdges(analysis, nodes);
        const layout = this.determineLayoutConfig(analysis.flowType, analysis.complexity);

        return {
            id: this.generateWorkflowId(),
            name: this.extractWorkflowName(analysis.ast),
            nodes,
            edges,
            layout,
            metadata: {
                flowType: analysis.flowType,
                complexity: analysis.complexity,
                originalStructure: analysis.patterns
            }
        };
    }

    /**
     * Build workflow nodes from analysis
     */
    buildNodes(analysis) {
        const nodes = [];
        const { patterns, ast } = analysis;

        // Build triggers
        patterns.triggers.forEach(trigger => {
            nodes.push(this.createTriggerNode(trigger));
        });

        // Build actions
        patterns.actions.forEach(action => {
            if (action.isArray && Array.isArray(action.value)) {
                // Multiple actions from array
                action.value.forEach((item, index) => {
                    nodes.push(this.createActionNode(item, action, index));
                });
            } else {
                nodes.push(this.createActionNode(action.value, action));
            }
        });

        // Build conditionals (decision nodes)
        patterns.conditionals.forEach(conditional => {
            nodes.push(this.createDecisionNode(conditional));

            // Add branch nodes
            conditional.branches.forEach(branch => {
                nodes.push(this.createBranchNode(branch, conditional));
            });
        });

        // Build loops
        patterns.loops.forEach(loop => {
            nodes.push(this.createLoopNode(loop));
        });

        // Build parallel groups
        patterns.parallel.forEach(parallel => {
            const groupNode = this.createParallelGroupNode(parallel);
            nodes.push(groupNode);

            if (Array.isArray(parallel.value)) {
                parallel.value.forEach((task, index) => {
                    nodes.push(this.createParallelTaskNode(task, parallel, index));
                });
            }
        });

        // If no nodes were created from patterns, create from raw structure
        if (nodes.length === 0) {
            nodes.push(...this.createNodesFromRawStructure(ast));
        }

        return nodes;
    }

    /**
     * Build edges connecting nodes
     */
    buildEdges(analysis, nodes) {
        const edges = [];
        const { patterns } = analysis;

        // Connect triggers to first action
        if (patterns.triggers.length > 0 && nodes.length > 1) {
            const triggerNodes = nodes.filter(n => n.type === 'trigger');
            const actionNodes = nodes.filter(n => n.type === 'tradeAction' || n.type === 'notification' || n.type === 'action');

            if (triggerNodes.length > 0 && actionNodes.length > 0) {
                edges.push(this.createEdge(triggerNodes[0].id, actionNodes[0].id, 'trigger-to-action'));
            }
        }

        // Connect sequential actions
        const sequentialNodes = nodes.filter(n =>
            n.type === 'tradeAction' || n.type === 'notification' || n.type === 'action'
        );

        for (let i = 0; i < sequentialNodes.length - 1; i++) {
            edges.push(this.createEdge(
                sequentialNodes[i].id,
                sequentialNodes[i + 1].id,
                'sequential'
            ));
        }

        // Connect conditionals
        patterns.conditionals.forEach(conditional => {
            const decisionNode = nodes.find(n =>
                n.data.conditionalId === conditional.path.join('.')
            );

            if (decisionNode) {
                conditional.branches.forEach(branch => {
                    const branchNode = nodes.find(n =>
                        n.data.branchType === branch.type &&
                        n.data.parentConditional === conditional.path.join('.')
                    );

                    if (branchNode) {
                        edges.push(this.createEdge(
                            decisionNode.id,
                            branchNode.id,
                            branch.type,
                            true
                        ));
                    }
                });
            }
        });

        // Connect parallel tasks
        patterns.parallel.forEach(parallel => {
            const groupNode = nodes.find(n =>
                n.data.parallelId === parallel.path.join('.')
            );

            if (groupNode) {
                const taskNodes = nodes.filter(n =>
                    n.data.parentParallel === parallel.path.join('.')
                );

                taskNodes.forEach(taskNode => {
                    edges.push(this.createEdge(groupNode.id, taskNode.id, 'parallel-start'));
                });
            }
        });

        return edges;
    }

    /**
     * Node creation methods
     */
    createTriggerNode(trigger) {
        const nodeId = this.generateNodeId('trigger');

        // Parse trigger value
        let asset = '', operator = '', value = '';

        if (typeof trigger.value === 'object' && trigger.value !== null) {
            const entries = Object.entries(trigger.value);
            if (entries.length > 0) {
                const [field, val] = entries[0];
                asset = field.toUpperCase();

                if (typeof val === 'string') {
                    const match = val.trim().match(/^([><=!]+)\s*(.+)$/);
                    if (match) {
                        operator = match[1];
                        value = parseFloat(match[2]) || match[2];
                    } else {
                        value = val;
                    }
                } else {
                    value = val;
                }
            }
        }

        return {
            id: nodeId,
            type: 'trigger',
            data: {
                asset: asset || trigger.key,
                operator: operator || '==',
                value: value || trigger.value,
                type: trigger.type || 'PriceTrigger',
                originalPath: trigger.path
            }
        };
    }

    createActionNode(value, action, index = 0) {
        const nodeId = this.generateNodeId('action');

        let actionType = 'GenericAction';
        let data = {};

        if (typeof value === 'string') {
            // Parse string action
            actionType = this.guessActionType(value);
            data = this.extractActionData(value);
        } else if (typeof value === 'object' && value !== null) {
            actionType = value.type || this.guessActionType(JSON.stringify(value));
            data = { ...value };
        }

        // Map to React Flow node types
        let nodeType = 'action';
        if (actionType === 'TradeAction') nodeType = 'tradeAction';
        if (actionType === 'NotificationAction') nodeType = 'notification';

        return {
            id: nodeId,
            type: nodeType,
            data: {
                ...data,
                type: actionType,
                name: data.name || data.step || value,
                sequenceIndex: index
            }
        };
    }

    createDecisionNode(conditional) {
        const nodeId = this.generateNodeId('decision');

        return {
            id: nodeId,
            type: 'decision',
            data: {
                condition: conditional.key,
                value: conditional.value,
                branches: conditional.branches.map(b => b.type),
                conditionalId: conditional.path.join('.')
            }
        };
    }

    createBranchNode(branch, conditional) {
        const nodeId = this.generateNodeId('branch');

        return {
            id: nodeId,
            type: 'action',
            data: {
                name: `${branch.type} branch`,
                branchType: branch.type,
                parentConditional: conditional.path.join('.'),
                value: branch.value
            }
        };
    }

    createLoopNode(loop) {
        const nodeId = this.generateNodeId('loop');

        return {
            id: nodeId,
            type: 'loop',
            data: {
                iterationType: loop.iterationType,
                target: loop.value,
                loopId: loop.path.join('.')
            }
        };
    }

    createParallelGroupNode(parallel) {
        const nodeId = this.generateNodeId('parallel');

        return {
            id: nodeId,
            type: 'parallelGroup',
            data: {
                taskCount: parallel.taskCount,
                parallelId: parallel.path.join('.')
            }
        };
    }

    createParallelTaskNode(task, parallel, index) {
        const nodeId = this.generateNodeId('parallelTask');

        return {
            id: nodeId,
            type: 'action',
            data: {
                name: typeof task === 'string' ? task : task.task || task.name || `Task ${index + 1}`,
                parentParallel: parallel.path.join('.'),
                parallelIndex: index
            }
        };
    }

    createNodesFromRawStructure(ast) {
        const nodes = [];

        // Create a start node
        nodes.push({
            id: this.generateNodeId('start'),
            type: 'trigger',
            data: {
                asset: ast.value.name || 'Workflow',
                operator: '',
                value: '',
                type: 'StartTrigger'
            }
        });

        // Create nodes from top-level keys
        if (ast.children.length > 0) {
            ast.children.forEach((child, index) => {
                if (child.key !== 'id' && child.key !== 'name') {
                    nodes.push({
                        id: this.generateNodeId('data'),
                        type: 'action',
                        data: {
                            name: child.key,
                            value: typeof child.value === 'object' ? JSON.stringify(child.value) : child.value,
                            type: 'DataNode'
                        }
                    });
                }
            });
        }

        return nodes;
    }

    createEdge(source, target, type = 'default', animated = true) {
        return {
            id: this.generateEdgeId(),
            source,
            target,
            type: type === 'conditional' ? 'smoothstep' : 'default',
            animated,
            label: type !== 'default' && type !== 'sequential' ? type : undefined,
            style: { stroke: '#a855f7', strokeWidth: 2 }
        };
    }

    /**
     * Layout configuration based on workflow type
     */
    determineLayoutConfig(flowType, complexity) {
        const config = {
            algorithm: 'dagre',
            direction: 'TB', // Top to bottom
            spacing: {
                node: [150, 100], // [horizontal, vertical]
                rank: 150
            }
        };

        // Adjust based on flow type
        if (flowType === 'sequential') {
            config.direction = 'TB';
            config.spacing.rank = 120;
        } else if (flowType === 'parallel') {
            config.direction = 'LR';
            config.spacing.node = [200, 80];
        } else if (flowType === 'conditional') {
            config.spacing.node = [180, 120];
        }

        // Adjust based on complexity
        if (complexity.score > 7) {
            config.spacing.node = [200, 150];
            config.spacing.rank = 180;
        }

        return config;
    }

    /**
     * Helper methods
     */
    guessActionType(content) {
        const lower = content.toLowerCase();

        if (lower.includes('trade') || lower.includes('buy') || lower.includes('sell') ||
            lower.includes('long') || lower.includes('short')) {
            return 'TradeAction';
        }
        if (lower.includes('notify') || lower.includes('alert') || lower.includes('email') ||
            lower.includes('message') || lower.includes('send')) {
            return 'NotificationAction';
        }
        if (lower.includes('webhook') || lower.includes('api') || lower.includes('http')) {
            return 'WebhookAction';
        }

        return 'GenericAction';
    }

    extractActionData(text) {
        const data = {};

        // Extract side (long/short)
        const lower = text.toLowerCase();
        if (lower.includes('long') || lower.includes('buy')) data.side = 'long';
        if (lower.includes('short') || lower.includes('sell')) data.side = 'short';

        // Extract asset
        const assets = ['BTC', 'ETH', 'SOL', 'USDT', 'BNB', 'XRP', 'ADA'];
        assets.forEach(asset => {
            if (text.toUpperCase().includes(asset)) data.asset = asset;
        });

        // Extract leverage
        const leverageMatch = text.match(/(\d+)x/i);
        if (leverageMatch) data.leverage = parseInt(leverageMatch[1]);

        // Extract recipient for notifications
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) {
            data.to = emailMatch[0];
            data.channel = 'email';
        }

        return data;
    }

    generateNodeId(prefix) {
        return `${prefix}-${++this.nodeCounter}`;
    }

    generateEdgeId() {
        return `edge-${++this.edgeCounter}`;
    }

    generateWorkflowId() {
        return `workflow-${Date.now()}`;
    }

    extractWorkflowName(ast) {
        if (ast.value && ast.value.name) return ast.value.name;
        return 'Generated Workflow';
    }

    reset() {
        this.nodeCounter = 0;
        this.edgeCounter = 0;
    }
}
