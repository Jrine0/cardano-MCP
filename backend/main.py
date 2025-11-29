import os
import json
import asyncio
import time
import socketio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from dotenv import load_dotenv
import httpx
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load environment variables
load_dotenv()

# Validate required environment variables
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY environment variable is required. Please set it in backend/.env file.")

OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "x-ai/grok-2-1212")
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

print(f"🤖 Using AI Model: {OPENROUTER_MODEL}")
print(f"🔑 API Keys loaded: OpenRouter={'✓' if OPENROUTER_API_KEY else '✗'}, Perplexity={'✓' if PERPLEXITY_API_KEY else '✗'}, Google={'✓' if GOOGLE_API_KEY else '✗'}")

# Initialize OpenRouter Client (compatible with OpenAI SDK)
client = AsyncOpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

# Initialize FastAPI
app = FastAPI()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Enable CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting info endpoint
@app.get("/")
@limiter.limit("100/minute")
async def root(request: Request):
    return {
        "status": "ok",
        "message": "agent8 Backend API",
        "ai_model": OPENROUTER_MODEL,
        "apis_configured": {
            "openrouter": bool(OPENROUTER_API_KEY),
            "perplexity": bool(PERPLEXITY_API_KEY),
            "google": bool(GOOGLE_API_KEY)
        }
    }

# Initialize Socket.IO
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, app)

# --- Tools ---

async def search_web(query: str) -> str:
    """Searches the web using Perplexity API (or mock if not available)."""
    print(f"Searching web for: {query}")
    if not PERPLEXITY_API_KEY:
        return "Mock search result: Minswap is the leading DEX on Cardano with low fees. NMKR is great for NFTs."
    
    url = "https://api.perplexity.ai/chat/completions"
    payload = {
        "model": "llama-3.1-sonar-small-128k-online",
        "messages": [
            {"role": "system", "content": "Be precise and concise."},
            {"role": "user", "content": query}
        ]
    }
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as http_client:
        try:
            response = await http_client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content']
        except Exception as e:
            print(f"Perplexity API Error: {e}")
            return "Error searching web. Using fallback knowledge."

async def create_cardano_node(node_type: str, config: dict, position: dict = None) -> dict:
    """Creates a Cardano workflow node."""
    node_id = f"node-{os.urandom(4).hex()}"
    
    # If position not provided, AI should calculate it
    # For now, use a simple default that won't stack nodes
    if not position:
        position = {"x": 250, "y": 100}
    
    node = {
        "id": node_id,
        "type": node_type,
        "position": position,
        "data": config
    }
    print(f"Created node: {node}")
    await sio.emit('node_created', {'node': node})
    return node

async def create_edge(source: str, target: str) -> dict:
    """Creates a connection between two nodes."""
    edge_id = f"edge-{source}-{target}"
    edge = {
        "id": edge_id,
        "source": source,
        "target": target
    }
    print(f"Created edge: {edge}")
    await sio.emit('edge_created', {'edge': edge})
    return edge

# --- AI Agent ---

SYSTEM_PROMPT = """
You are a Cardano workflow builder AI.
When a user describes a task, you should:
1. Search the web for the latest Cardano tools and best practices if needed.
2. Generate workflow nodes sequentially to accomplish the task.
3. Connect the nodes with edges.

Available Node Types:
- wallet: Connect Cardano wallet
- dex: Swap tokens on DEX (requires 'dex' and 'pair' in config)
- nft: Mint NFT via NMKR (requires 'collection' in config)
- staking: Delegate to stake pool (requires 'pool' in config)
- email: Send email notification (requires 'recipient' in config)

IMPORTANT: When creating nodes, calculate proper positions:
- Set x=250 (center) for all nodes
- Set y position incrementing by 180 for each node (first at 100, second at 280, third at 460, etc.)
- Example: First node position: {"x": 250, "y": 100}
- Example: Second node position: {"x": 250, "y": 280}

You must use the provided tools to create nodes and edges.
Emit nodes one by one with proper spacing.
"""

async def register_agent(agent_name: str, strategy: str) -> dict:
    """Registers an AI agent on the Masumi network (mock)."""
    print(f"Registering agent: {agent_name} with strategy: {strategy}")
    # Mock Masumi registration
    nft_id = f"asset1{os.urandom(8).hex()}"
    registry_id = f"reg_{os.urandom(4).hex()}"
    
    await sio.emit('log', {
        'id': os.urandom(4).hex(),
        'timestamp': int(time.time() * 1000),
        'level': 'info',
        'message': f"Registered agent '{agent_name}' on Masumi. NFT: {nft_id}"
    })
    
    return {"nft_id": nft_id, "registry_id": registry_id, "status": "registered"}

async def open_hydra_head(agent_id: str) -> dict:
    """Opens a Hydra Head for high-frequency trading (mock)."""
    print(f"Opening Hydra Head for agent: {agent_id}")
    head_id = f"head_{os.urandom(4).hex()}"
    
    await sio.emit('log', {
        'id': os.urandom(4).hex(),
        'timestamp': int(time.time() * 1000),
        'level': 'info',
        'message': f"Hydra Head {head_id} opened. TPS capacity: 1000."
    })
    
    return {"head_id": head_id, "status": "open"}

async def execute_hydra_trade(head_id: str, trade_details: dict) -> dict:
    """Executes a trade within a Hydra Head (mock)."""
    print(f"Executing trade in head {head_id}: {trade_details}")
    tx_id = f"tx_{os.urandom(8).hex()}"
    
    await sio.emit('log', {
        'id': os.urandom(4).hex(),
        'timestamp': int(time.time() * 1000),
        'level': 'success',
        'message': f"Executed trade in Hydra Head. Latency: 45ms."
    })
    
    return {"tx_id": tx_id, "status": "confirmed"}

async def close_hydra_head(head_id: str) -> dict:
    """Closes a Hydra Head and settles to L1 (mock)."""
    print(f"Closing Hydra Head: {head_id}")
    settlement_tx = f"tx_{os.urandom(8).hex()}"
    
    await sio.emit('log', {
        'id': os.urandom(4).hex(),
        'timestamp': int(time.time() * 1000),
        'level': 'info',
        'message': f"Hydra Head closed. Final settlement tx: {settlement_tx}"
    })
    
    return {"settlement_tx": settlement_tx, "status": "closed"}

async def execute_backpack_trade(side: str, symbol: str, quantity: str) -> dict:
    """Executes a trade on Backpack Exchange (mock)."""
    print(f"Executing Backpack trade: {side} {quantity} {symbol}")
    order_id = f"ord_{os.urandom(6).hex()}"
    
    await sio.emit('log', {
        'id': os.urandom(4).hex(),
        'timestamp': int(time.time() * 1000),
        'level': 'success',
        'message': f"Backpack Exchange: {side.upper()} {quantity} {symbol} filled. Order ID: {order_id}"
    })
    
    return {"order_id": order_id, "status": "filled", "price": "0.45"}

tools = [
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "Search the web for information about Cardano, tokens, or DeFi protocols.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_cardano_node",
            "description": "Create a node in the workflow diagram.",
            "parameters": {
                "type": "object",
                "properties": {
                    "node_type": {
                        "type": "string", 
                        "enum": ["wallet", "dex", "nft", "staking", "email"],
                        "description": "The type of node to create"
                    },
                    "config": {
                        "type": "object",
                        "description": "Configuration for the node (e.g., {'dex': 'minswap', 'pair': 'ADA/DJED'})"
                    },
                    "position": {
                        "type": "object",
                        "properties": {"x": {"type": "number"}, "y": {"type": "number"}},
                        "description": "Optional position"
                    }
                },
                "required": ["node_type", "config"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_edge",
            "description": "Connect two nodes in the workflow.",
            "parameters": {
                "type": "object",
                "properties": {
                    "source": {"type": "string", "description": "ID of the source node"},
                    "target": {"type": "string", "description": "ID of the target node"}
                },
                "required": ["source", "target"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "register_agent",
            "description": "Register an AI agent on the Masumi network.",
            "parameters": {
                "type": "object",
                "properties": {
                    "agent_name": {"type": "string", "description": "Name of the agent"},
                    "strategy": {"type": "string", "description": "Trading strategy description"}
                },
                "required": ["agent_name", "strategy"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "open_hydra_head",
            "description": "Open a Hydra Head for high-frequency trading.",
            "parameters": {
                "type": "object",
                "properties": {
                    "agent_id": {"type": "string", "description": "ID of the agent opening the head"}
                },
                "required": ["agent_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "execute_hydra_trade",
            "description": "Execute a trade within an open Hydra Head.",
            "parameters": {
                "type": "object",
                "properties": {
                    "head_id": {"type": "string", "description": "ID of the Hydra Head"},
                    "trade_details": {"type": "object", "description": "Details of the trade (asset, amount, price)"}
                },
                "required": ["head_id", "trade_details"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "close_hydra_head",
            "description": "Close a Hydra Head and settle to L1.",
            "parameters": {
                "type": "object",
                "properties": {
                    "head_id": {"type": "string", "description": "ID of the Hydra Head to close"}
                },
                "required": ["head_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "execute_backpack_trade",
            "description": "Execute a trade on Backpack Exchange.",
            "parameters": {
                "type": "object",
                "properties": {
                    "side": {"type": "string", "enum": ["buy", "sell"], "description": "Buy or sell"},
                    "symbol": {"type": "string", "description": "Trading pair (e.g., 'ADA_USDC')"},
                    "quantity": {"type": "string", "description": "Amount to trade"}
                },
                "required": ["side", "symbol", "quantity"]
            }
        }
    }
]

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def generate_workflow(sid, data):
    prompt = data.get('prompt')
    print(f"[{sid}] Received prompt: {prompt}")
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt}
    ]

    try:
        # Initial call to AI (using OpenRouter with Grok)
        response = await client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=messages,
            tools=tools,
            tool_choice="auto",
            extra_headers={
                "HTTP-Referer": "https://agent8.ai",
                "X-Title": "agent8 - Cardano AI Workflow Builder"
            }
        )
        
        message = response.choices[0].message
        messages.append(message)

        # Handle tool calls loop
        while message.tool_calls:
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                result = None
                if function_name == "search_web":
                    result = await search_web(**arguments)
                elif function_name == "create_cardano_node":
                    result = await create_cardano_node(**arguments)
                    result = json.dumps(result) 
                elif function_name == "create_edge":
                    result = await create_edge(**arguments)
                    result = json.dumps(result)
                elif function_name == "register_agent":
                    result = await register_agent(**arguments)
                    result = json.dumps(result)
                elif function_name == "open_hydra_head":
                    result = await open_hydra_head(**arguments)
                    result = json.dumps(result)
                elif function_name == "execute_hydra_trade":
                    result = await execute_hydra_trade(**arguments)
                    result = json.dumps(result)
                elif function_name == "close_hydra_head":
                    result = await close_hydra_head(**arguments)
                    result = json.dumps(result)
                elif function_name == "execute_backpack_trade":
                    result = await execute_backpack_trade(**arguments)
                    result = json.dumps(result)

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result)
                })

            # Get next response from AI (using OpenRouter with Grok)
            response = await client.chat.completions.create(
                model=OPENROUTER_MODEL,
                messages=messages,
                tools=tools,
                tool_choice="auto",
                extra_headers={
                    "HTTP-Referer": "https://agent8.ai",
                    "X-Title": "agent8 - Cardano AI Workflow Builder"
                }
            )
            message = response.choices[0].message
            messages.append(message)

        await sio.emit('workflow_complete', {'status': 'done'})
        print("Workflow generation complete")

    except Exception as e:
        print(f"Error generating workflow: {e}")
        await sio.emit('error', {'message': str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)
