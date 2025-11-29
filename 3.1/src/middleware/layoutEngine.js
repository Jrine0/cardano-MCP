/**
 * Layout Engine - Automatic node positioning using dagre algorithm
 * NO MORE HARDCODED POSITIONS!
 */

import dagre from 'dagre';

export class LayoutEngine {
    constructor(algorithm = 'dagre') {
        this.algorithm = algorithm;
        this.defaultNodeSize = { width: 250, height: 100 };
    }

    /**
     * Main layout entry point
     */
    layout(workflow) {
        if (this.algorithm === 'dagre') {
            return this.dagreLayout(workflow);
        }

        // Fallback to simple layout
        return this.simpleLayout(workflow);
    }

    /**
     * Dagre hierarchical layout algorithm
     */
    dagreLayout(workflow) {
        const g = new dagre.graphlib.Graph();

        // Configure graph
        g.setGraph({
            rankdir: workflow.layout.direction || 'TB', // TB, BT, LR, RL
            nodesep: workflow.layout.spacing?.node?.[0] || 150,
            ranksep: workflow.layout.spacing?.rank || 150,
            edgesep: 50,
            marginx: 50,
            marginy: 50
        });

        // Set default edge label
        g.setDefaultEdgeLabel(() => ({}));

        // Add nodes to graph with sizes
        workflow.nodes.forEach(node => {
            const size = this.getNodeSize(node);
            g.setNode(node.id, {
                width: size.width,
                height: size.height,
                node // Store original node data
            });
        });

        // Add edges to graph
        workflow.edges.forEach(edge => {
            g.setEdge(edge.source, edge.target, {
                weight: edge.type === 'conditional' ? 2 : 1
            });
        });

        // Run layout algorithm
        dagre.layout(g);

        // Extract positioned nodes
        const positionedNodes = workflow.nodes.map(node => {
            const dagreNode = g.node(node.id);

            return {
                ...node,
                position: {
                    x: dagreNode.x - dagreNode.width / 2,
                    y: dagreNode.y - dagreNode.height / 2
                },
                // Store computed dimensions
                width: dagreNode.width,
                height: dagreNode.height
            };
        });

        // Calculate edge paths (for curved edges)
        const positionedEdges = workflow.edges.map(edge => {
            const dagreEdge = g.edge(edge.source, edge.target);

            return {
                ...edge,
                // Add waypoints if dagre calculated them
                points: dagreEdge?.points || []
            };
        });

        return {
            nodes: positionedNodes,
            edges: positionedEdges,
            bounds: this.calculateBounds(positionedNodes)
        };
    }

    /**
     * Simple fallback layout for when dagre fails
     */
    simpleLayout(workflow) {
        const direction = workflow.layout.direction || 'TB';
        const isHorizontal = direction === 'LR' || direction === 'RL';

        const spacing = {
            x: workflow.layout.spacing?.node?.[0] || 200,
            y: workflow.layout.spacing?.node?.[1] || 150
        };

        let currentX = 100;
        let currentY = 100;
        let maxRowHeight = 0;
        let nodesInRow = 0;
        const maxNodesPerRow = 5;

        const positionedNodes = workflow.nodes.map((node, index) => {
            const size = this.getNodeSize(node);

            let x, y;

            if (isHorizontal) {
                // Horizontal layout
                x = currentX;
                y = currentY;
                currentX += size.width + spacing.x;

                if ((index + 1) % maxNodesPerRow === 0) {
                    currentX = 100;
                    currentY += maxRowHeight + spacing.y;
                    maxRowHeight = 0;
                }
                maxRowHeight = Math.max(maxRowHeight, size.height);
            } else {
                // Vertical layout
                x = currentX;
                y = currentY;
                currentY += size.height + spacing.y;

                if ((index + 1) % maxNodesPerRow === 0) {
                    currentY = 100;
                    currentX += spacing.x + 250;
                }
            }

            return {
                ...node,
                position: { x, y },
                width: size.width,
                height: size.height
            };
        });

        return {
            nodes: positionedNodes,
            edges: workflow.edges,
            bounds: this.calculateBounds(positionedNodes)
        };
    }

    /**
     * Get node size based on type and content
     */
    getNodeSize(node) {
        const baseSize = { ...this.defaultNodeSize };

        // Adjust size based on node type
        switch (node.type) {
            case 'trigger':
                baseSize.width = 220;
                baseSize.height = 100;
                break;

            case 'tradeAction':
                baseSize.width = 240;
                baseSize.height = 120;
                break;

            case 'notification':
                baseSize.width = 260;
                baseSize.height = 130;
                break;

            case 'decision':
                baseSize.width = 200;
                baseSize.height = 80;
                break;

            case 'loop':
                baseSize.width = 200;
                baseSize.height = 90;
                break;

            case 'parallelGroup':
                baseSize.width = 280;
                baseSize.height = 100;
                break;

            default:
                break;
        }

        // Adjust for content length
        if (node.data?.name) {
            const nameLength = node.data.name.length;
            if (nameLength > 30) {
                baseSize.width = Math.min(350, baseSize.width + (nameLength - 30) * 3);
            }
        }

        return baseSize;
    }

    /**
     * Calculate bounds of the layout
     */
    calculateBounds(nodes) {
        if (nodes.length === 0) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
        }

        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        nodes.forEach(node => {
            const nodeWidth = node.width || this.defaultNodeSize.width;
            const nodeHeight = node.height || this.defaultNodeSize.height;

            minX = Math.min(minX, node.position.x);
            minY = Math.min(minY, node.position.y);
            maxX = Math.max(maxX, node.position.x + nodeWidth);
            maxY = Math.max(maxY, node.position.y + nodeHeight);
        });

        return {
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    /**
     * Optimize layout for large graphs
     */
    optimizeForLargeGraphs(workflow) {
        const nodeCount = workflow.nodes.length;

        if (nodeCount > 50) {
            // Reduce spacing for large graphs
            workflow.layout.spacing = {
                node: [120, 80],
                rank: 100
            };
        }

        if (nodeCount > 100) {
            // Even tighter for very large graphs
            workflow.layout.spacing = {
                node: [100, 60],
                rank: 80
            };
        }

        return workflow;
    }
}
