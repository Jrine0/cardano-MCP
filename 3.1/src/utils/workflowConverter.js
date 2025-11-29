// Intelligent JSON to Workflow Converter
// Analyzes any JSON structure and creates workflow visualization

export const convertGenericJsonToWorkflow = (json) => {
    // Check if already in workflow format
    if (json.triggers || json.actions) {
        return json; // Already a workflow
    }

    const triggers = [];
    const actions = [];
    const edges = [];
    let nodeId = 1;

    // Helper to create unique IDs
    const getId = (prefix = 'node') => `${prefix}-${nodeId++}`;

    // Detect root-level triggers
    const detectRootTrigger = (obj) => {
        const triggerKeywords = ['trigger', 'when', 'if', 'on', 'event', 'condition'];

        for (const key of triggerKeywords) {
            if (obj[key]) {
                const triggerData = obj[key];
                const triggerId = getId('trigger');

                // Create trigger based on data type
                if (typeof triggerData === 'object' && !Array.isArray(triggerData)) {
                    // Extract condition details from object
                    const entries = Object.entries(triggerData);
                    if (entries.length > 0) {
                        const [field, value] = entries[0];

                        // Parse operator from value if it's a string
                        let operator = '==';
                        let actualValue = value;

                        if (typeof value === 'string') {
                            // Handle operators in string like ">= 150"
                            const operatorMatch = value.trim().match(/^([><=!]+)\s*(.+)$/);
                            if (operatorMatch) {
                                operator = operatorMatch[1];
                                actualValue = operatorMatch[2].trim();

                                // Remove quotes if present
                                actualValue = actualValue.replace(/^["']|["']$/g, '');
                            }
                        }

                        triggers.push({
                            id: triggerId,
                            type: 'PriceTrigger',
                            asset: field.toUpperCase(),
                            operator: operator,
                            value: parseFloat(actualValue) || actualValue
                        });

                        return triggerId;
                    }
                } else if (typeof triggerData === 'string') {
                    triggers.push({
                        id: triggerId,
                        type: 'EventTrigger',
                        asset: triggerData,
                        operator: '',
                        value: ''
                    });

                    return triggerId;
                }
            }
        }

        return null;
    };

    // Detect actions from various patterns
    const detectActions = (obj) => {
        const actionIds = [];
        const actionKeywords = ['action', 'actions', 'steps', 'tasks', 'operations', 'do', 'then', 'execute'];

        for (const key of actionKeywords) {
            if (obj[key]) {
                const actionData = obj[key];

                if (Array.isArray(actionData)) {
                    // Array of actions
                    actionData.forEach((item, index) => {
                        const actionId = getId('action');

                        if (typeof item === 'string') {
                            // Simple string action
                            actions.push({
                                id: actionId,
                                type: guessActionType(item),
                                side: extractSide(item),
                                asset: extractAsset(item),
                                amount: 1,
                                leverage: extractLeverage(item)
                            });
                        } else if (typeof item === 'object') {
                            // Object action
                            const actionType = item.type || guessActionType(JSON.stringify(item));

                            actions.push({
                                id: actionId,
                                type: actionType,
                                ...extractActionDetails(item)
                            });
                        }

                        actionIds.push(actionId);
                    });
                } else if (typeof actionData === 'object') {
                    // Single action object
                    const actionId = getId('action');
                    actions.push({
                        id: actionId,
                        type: guessActionType(JSON.stringify(actionData)),
                        ...extractActionDetails(actionData)
                    });
                    actionIds.push(actionId);
                } else if (typeof actionData === 'string') {
                    // Single string action
                    const actionId = getId('action');
                    actions.push({
                        id: actionId,
                        type: 'GenericAction',
                        side: extractSide(actionData),
                        asset: extractAsset(actionData) || actionData
                    });
                    actionIds.push(actionId);
                }

                return actionIds;
            }
        }

        // Check top-level keys for action-like properties
        Object.keys(obj).forEach(key => {
            if (!actionKeywords.includes(key) && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                const actionId = getId('action');
                actions.push({
                    id: actionId,
                    type: 'GenericAction',
                    ...extractActionDetails({ name: key, ...obj[key] })
                });
                actionIds.push(actionId);
            }
        });

        return actionIds;
    };

    // Guess action type from content
    const guessActionType = (content) => {
        const lower = content.toLowerCase();

        if (lower.includes('trade') || lower.includes('buy') || lower.includes('sell') || lower.includes('long') || lower.includes('short')) {
            return 'TradeAction';
        }
        if (lower.includes('notify') || lower.includes('alert') || lower.includes('email') || lower.includes('message')) {
            return 'NotificationAction';
        }
        if (lower.includes('webhook') || lower.includes('api') || lower.includes('http')) {
            return 'WebhookAction';
        }

        return 'GenericAction';
    };

    // Extract trading side
    const extractSide = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes('long') || lower.includes('buy')) return 'long';
        if (lower.includes('short') || lower.includes('sell')) return 'short';
        return null;
    };

    // Extract asset name
    const extractAsset = (text) => {
        const assets = ['BTC', 'ETH', 'SOL', 'USDT', 'BNB', 'XRP', 'ADA'];
        const upper = text.toUpperCase();

        for (const asset of assets) {
            if (upper.includes(asset)) return asset;
        }

        return null;
    };

    // Extract leverage
    const extractLeverage = (text) => {
        const match = text.match(/(\d+)x/i);
        return match ? parseInt(match[1]) : null;
    };

    // Extract action details from object
    const extractActionDetails = (obj) => {
        const details = {};

        if (obj.side) details.side = obj.side;
        if (obj.asset) details.asset = obj.asset;
        if (obj.amount) details.amount = obj.amount;
        if (obj.leverage) details.leverage = obj.leverage;
        if (obj.channel) details.channel = obj.channel;
        if (obj.to) details.to = obj.to;
        if (obj.message) details.message = obj.message;
        if (obj.name) details.name = obj.name;
        if (obj.step) details.name = obj.step;

        return details;
    };

    // Main conversion logic
    const triggerId = detectRootTrigger(json);
    let actionIds = detectActions(json);

    // If no triggers/actions found, create from top-level structure
    if (triggers.length === 0 && actions.length === 0) {
        // Create a start trigger
        const startId = getId('trigger');
        triggers.push({
            id: startId,
            type: 'StartTrigger',
            asset: json.name || 'Workflow',
            operator: '',
            value: ''
        });

        // Create actions from top-level keys
        actionIds = [];
        Object.keys(json).forEach(key => {
            const value = json[key];
            const actionId = getId('action');

            if (typeof value === 'object' && !Array.isArray(value)) {
                actions.push({
                    id: actionId,
                    type: 'GenericAction',
                    name: key,
                    ...extractActionDetails(value)
                });
                actionIds.push(actionId);
            } else if (!['id', 'name'].includes(key)) {
                actions.push({
                    id: actionId,
                    type: 'DataAction',
                    name: key,
                    value: String(value)
                });
                actionIds.push(actionId);
            }
        });

        // Connect start to all actions
        actionIds.forEach((actionId, index) => {
            if (index === 0) {
                edges.push({ from: startId, to: actionId });
            } else {
                edges.push({ from: actionIds[index - 1], to: actionId });
            }
        });
    } else {
        // Ensure actionIds is an array
        if (!Array.isArray(actionIds)) {
            actionIds = [];
        }

        // Create edges: trigger -> actions in sequence
        if (triggerId && actionIds.length > 0) {
            edges.push({ from: triggerId, to: actionIds[0] });
        }

        // Chain actions together
        for (let i = 0; i < actionIds.length - 1; i++) {
            edges.push({ from: actionIds[i], to: actionIds[i + 1] });
        }
    }

    return {
        id: json.id || 'workflow-generated',
        name: json.name || 'Generated Workflow',
        triggers,
        actions,
        edges
    };
};
