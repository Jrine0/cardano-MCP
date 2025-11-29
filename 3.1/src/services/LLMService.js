/**
 * LLM Service - Handles API calls to various LLM providers
 * Supports: OpenAI, Google Gemini, Anthropic Claude
 */

const WORKFLOW_SYSTEM_PROMPT = `You are an expert workflow generation AI assistant. Your job is to convert natural language descriptions into structured workflow JSON that can be visualized as a flowchart.

OUTPUT REQUIREMENTS:
- Always return valid JSON only (no markdown, no explanations)
- Use the exact schema provided below
- Connect all nodes with edges
- Use appropriate node types

WORKFLOW JSON SCHEMA:
{
  "name": "Workflow Name",
  "description": "Brief description of what this workflow does",
  "triggers": [
    {
      "id": "trigger-1",
      "type": "PriceTrigger" | "EventTrigger" | "TimeTrigger" | "UserAction",
      "asset": "BTC" | "ETH" | "SOL" | etc,
      "operator": ">=" | "<=" | "==" | "!=",
      "value": number | string
    }
  ],
  "actions": [
    {
      "id": "action-1",
      "type": "TradeAction" | "NotificationAction" | "WebhookAction" | "SmartContract",
      "side": "long" | "short",
      "asset": "SOL" | "BTC" | "ETH",
      "amount": 10,
      "leverage": 5,
      "channel": "email" | "sms" | "webhook",
      "to": "recipient@example.com",
      "message": "notification message",
      "contract": "contract name",
      "blockchain": "Solana" | "Ethereum" | "Cardano"
    }
  ],
  "edges": [
    { "from": "trigger-1", "to": "action-1" }
  ]
}

NODE TYPES AVAILABLE:
- PriceTrigger: For price conditions (BTC >= $50k)
- EventTrigger: For blockchain events
- TimeTrigger: For scheduled tasks
- UserAction: For user-initiated actions
- TradeAction: For trading operations (buy/sell with leverage)
- NotificationAction: For alerts (email, SMS, webhook)
- WebhookAction: For API calls
- SmartContract: For blockchain contract interactions

RULES:
1. Every workflow MUST have at least one trigger
2. Every workflow MUST have at least one action
3. All nodes MUST be connected via edges
4. Use realistic values (e.g., prices in thousands for BTC)
5. For NFT workflows, use UserAction trigger and SmartContract actions
6. For trading bots, use PriceTrigger and TradeAction
7. For alerts, use PriceTrigger/TimeTrigger and NotificationAction

EXAMPLES:

Example 1 - Price Alert:
User: "Alert me when BTC hits $50k"
Response:
{
  "name": "BTC Price Alert",
  "description": "Send notification when Bitcoin reaches $50,000",
  "triggers": [
    { "id": "trigger-1", "type": "PriceTrigger", "asset": "BTC", "operator": ">=", "value": 50000 }
  ],
  "actions": [
    { "id": "action-1", "type": "NotificationAction", "channel": "email", "to": "user@example.com", "message": "BTC reached $50,000!" }
  ],
  "edges": [
    { "from": "trigger-1", "to": "action-1" }
  ]
}

Example 2 - Trading Bot:
User: "Buy 10 SOL with 5x leverage when price is above $150"
Response:
{
  "name": "SOL Auto-Buy Bot",
  "description": "Automatically buy SOL with leverage when price exceeds $150",
  "triggers": [
    { "id": "trigger-1", "type": "PriceTrigger", "asset": "SOL", "operator": ">=", "value": 150 }
  ],
  "actions": [
    { "id": "action-1", "type": "TradeAction", "side": "long", "asset": "SOL", "amount": 10, "leverage": 5 },
    { "id": "action-2", "type": "NotificationAction", "channel": "email", "to": "trader@example.com", "message": "Bought 10 SOL at $150 with 5x leverage" }
  ],
  "edges": [
    { "from": "trigger-1", "to": "action-1" },
    { "from": "action-1", "to": "action-2" }
  ]
}

Example 3 - NFT Minter:
User: "Make me an NFT minter on Solana"
Response:
{
  "name": "Solana NFT Minter",
  "description": "Mint NFTs on Solana blockchain using Metaplex",
  "triggers": [
    { "id": "trigger-1", "type": "UserAction", "asset": "NFT", "value": "initiate mint" }
  ],
  "actions": [
    { "id": "action-1", "type": "SmartContract", "contract": "Connect Wallet", "blockchain": "Solana" },
    { "id": "action-2", "type": "SmartContract", "contract": "Upload Metadata", "blockchain": "Solana" },
    { "id": "action-3", "type": "SmartContract", "contract": "Mint NFT (Metaplex)", "blockchain": "Solana" },
    { "id": "action-4", "type": "NotificationAction", "channel": "email", "to": "user@example.com", "message": "NFT minted successfully!" }
  ],
  "edges": [
    { "from": "trigger-1", "to": "action-1" },
    { "from": "action-1", "to": "action-2" },
    { "from": "action-2", "to": "action-3" },
    { "from": "action-3", "to": "action-4" }
  ]
}

Now generate a workflow for the user's request. Return ONLY the JSON, nothing else.`;

export class LLMService {
    constructor(provider = 'openai', apiKey = null) {
        this.provider = provider;
        this.apiKey = apiKey || this.getApiKeyFromEnv();
        this.systemPrompt = WORKFLOW_SYSTEM_PROMPT;
    }

    getApiKeyFromEnv() {
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            switch (this.provider) {
                case 'openai':
                    return import.meta.env.VITE_OPENAI_API_KEY;
                case 'gemini':
                    return import.meta.env.VITE_GEMINI_API_KEY;
                case 'claude':
                    return import.meta.env.VITE_ANTHROPIC_API_KEY;
                default:
                    return null;
            }
        }
        return null;
    }

    async generateWorkflow(userInput) {
        if (!this.apiKey) {
            throw new Error(`No API key configured for ${this.provider}. Please set VITE_${this.provider.toUpperCase()}_API_KEY in your .env file.`);
        }

        try {
            let response;

            switch (this.provider) {
                case 'openai':
                    response = await this.callOpenAI(userInput);
                    break;
                case 'gemini':
                    response = await this.callGemini(userInput);
                    break;
                case 'claude':
                    response = await this.callClaude(userInput);
                    break;
                default:
                    throw new Error(`Unsupported provider: ${this.provider}`);
            }

            // Parse the JSON response
            const workflow = this.parseWorkflowJSON(response);

            return {
                success: true,
                message: `I've created a workflow: **${workflow.name}**\n\n${workflow.description}`,
                workflow
            };
        } catch (error) {
            console.error('LLM Service Error:', error);
            return {
                success: false,
                message: `Error: ${error.message}`,
                workflow: null
            };
        }
    }

    async callOpenAI(userInput) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    { role: 'user', content: userInput }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'OpenAI API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callGemini(userInput) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${this.systemPrompt}\n\nUser Request: ${userInput}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API request failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async callClaude(userInput) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: `${this.systemPrompt}\n\nUser Request: ${userInput}`
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Claude API request failed');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    parseWorkflowJSON(text) {
        // Remove markdown code blocks if present
        let cleaned = text.trim();
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        // Parse JSON
        try {
            const workflow = JSON.parse(cleaned);

            // Validate required fields
            if (!workflow.triggers || !workflow.actions || !workflow.edges) {
                throw new Error('Invalid workflow structure: missing triggers, actions, or edges');
            }

            return workflow;
        } catch (error) {
            console.error('Failed to parse workflow JSON:', cleaned);
            throw new Error(`Failed to parse workflow: ${error.message}`);
        }
    }
}

export default LLMService;
