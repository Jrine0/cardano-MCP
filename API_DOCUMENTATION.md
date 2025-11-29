# 🔌 API Documentation - agent8

## Overview

The agent8 backend uses **OpenRouter** to access various AI models, currently configured to use **Grok 2-1212** (free tier).

---

## 🌐 APIs Used

### 1. **OpenRouter (Primary AI)**
- **Provider:** OpenRouter.ai
- **Model:** `x-ai/grok-2-1212` (free)
- **Purpose:** Workflow generation with function calling
- **Endpoint:** `https://openrouter.ai/api/v1`
- **API Key:** Set in `backend/.env` as `OPENROUTER_API_KEY`

**Configuration:**
```python
client = AsyncOpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)
```

**Why Grok?**
- ✅ Free tier available
- ✅ Compatible with OpenAI SDK
- ✅ Good function calling support
- ✅ Fast response times

---

### 2. **Perplexity (Web Search)**
- **Provider:** Perplexity.ai
- **Model:** `llama-3.1-sonar-small-128k-online`
- **Purpose:** Real-time web search for latest Cardano info
- **Endpoint:** `https://api.perplexity.ai/chat/completions`
- **API Key:** Set in `backend/.env` as `PERPLEXITY_API_KEY`

**Usage:**
```python
async def search_web(query: str) -> str:
    # Returns latest information from the web
    pass
```

---

### 3. **Google API**
- **Provider:** Google Cloud
- **Purpose:** Future integrations (Maps, Calendar, etc.)
- **API Key:** Set in `backend/.env` as `GOOGLE_API_KEY`

**Status:** Configured but not yet integrated

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-your-key-here
OPENROUTER_MODEL=x-ai/grok-2-1212

# Perplexity Configuration
PERPLEXITY_API_KEY=pplx-your-key-here

# Google API
GOOGLE_API_KEY=your-google-key-here

# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Security
SECRET_KEY=your-secret-key-change-in-production
```

---

## 📡 Backend Endpoints

### `GET /`
**Health Check & Status**

Returns API configuration and status.

**Response:**
```json
{
  "status": "ok",
  "message": "agent8 Backend API",
  "ai_model": "x-ai/grok-2-1212",
  "apis_configured": {
    "openrouter": true,
    "perplexity": true,
    "google": true
  }
}
```

**Rate Limit:** 100 requests/minute

---

## 🔌 Socket.IO Events

### Client → Server

#### `generate_workflow`
**Generate AI workflow from prompt**

**Payload:**
```json
{
  "prompt": "Create a workflow to swap ADA for DJED and then stake"
}
```

**Response:** Multiple events emitted:
1. `node_created` - For each node created
2. `edge_created` - For each connection
3. `workflow_complete` - When done
4. `error` - If something fails

---

### Server → Client

#### `node_created`
**A new node has been created**

**Payload:**
```json
{
  "node": {
    "id": "node-abc123",
    "type": "wallet",
    "position": { "x": 250, "y": 100 },
    "data": {
      "label": "Connect Wallet",
      "status": "idle",
      "walletProvider": "nami"
    }
  }
}
```

#### `edge_created`
**A new connection has been created**

**Payload:**
```json
{
  "edge": {
    "id": "edge-abc-def",
    "source": "node-abc123",
    "target": "node-def456"
  }
}
```

#### `workflow_complete`
**Workflow generation complete**

**Payload:**
```json
{
  "status": "done"
}
```

#### `error`
**An error occurred**

**Payload:**
```json
{
  "message": "Error description here"
}
```

#### `log`
**System log message**

**Payload:**
```json
{
  "id": "log-abc123",
  "timestamp": 1234567890,
  "level": "info",
  "message": "Agent registered successfully"
}
```

---

## 🛠️ AI Function Tools

The AI can call these functions during workflow generation:

### 1. `search_web`
Search the web for Cardano information

**Parameters:**
- `query` (string): Search query

**Returns:** String with search results

---

### 2. `create_cardano_node`
Create a workflow node

**Parameters:**
- `node_type` (string): One of: `wallet`, `dex`, `nft`, `staking`, `email`
- `config` (object): Node configuration
- `position` (object, optional): `{x, y}` coordinates

**Returns:** Node object

**Example:**
```json
{
  "node_type": "dex",
  "config": {
    "dex": "minswap",
    "pair": "ADA/DJED"
  },
  "position": {
    "x": 250,
    "y": 280
  }
}
```

---

### 3. `create_edge`
Connect two nodes

**Parameters:**
- `source` (string): Source node ID
- `target` (string): Target node ID

**Returns:** Edge object

---

### 4. `register_agent`
Register AI agent on Masumi network (mock)

**Parameters:**
- `agent_name` (string): Name of the agent
- `strategy` (string): Trading strategy description

---

### 5. `open_hydra_head`
Open a Hydra Head for high-frequency trading (mock)

**Parameters:**
- `agent_id` (string): Agent ID

---

### 6. `execute_hydra_trade`
Execute trade in Hydra Head (mock)

**Parameters:**
- `head_id` (string): Hydra Head ID
- `trade_details` (object): Trade information

---

### 7. `close_hydra_head`
Close Hydra Head and settle to L1 (mock)

**Parameters:**
- `head_id` (string): Hydra Head ID

---

### 8. `execute_backpack_trade`
Execute trade on Backpack Exchange (mock)

**Parameters:**
- `side` (string): "buy" or "sell"
- `symbol` (string): Trading pair (e.g., "ADA_USDC")
- `quantity` (string): Amount to trade

---

## 🔄 Rate Limiting

**Implementation:** SlowAPI

**Limits:**
- Default: 100 requests/minute per IP
- Health endpoint: 100 requests/minute
- Socket.IO: Not rate limited (handled by connection limits)

**Configuration:**
```python
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

**Error Response (429):**
```json
{
  "error": "Rate limit exceeded"
}
```

---

## 🔒 Security

### CORS Configuration
Only allowed origins can access the API:

```python
allowed_origins = ["http://localhost:3000", "http://localhost:5173"]
```

**Production:** Update `ALLOWED_ORIGINS` in `.env`

### API Key Validation
Backend validates required keys on startup:

```python
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY is required")
```

### Rate Limiting
Prevents API abuse and reduces costs

---

## 📊 Monitoring

### Console Logs

**Startup:**
```
🤖 Using AI Model: x-ai/grok-2-1212
🔑 API Keys loaded: OpenRouter=✓, Perplexity=✓, Google=✓
```

**Socket Connection:**
```
Client connected: Xg4p2k8mN3j
[Xg4p2k8mN3j] Received prompt: swap ada for djed
```

**Node Creation:**
```
Created node: {'id': 'node-abc123', 'type': 'wallet', ...}
```

---

## 🧪 Testing

### Test Socket.IO Connection

```python
# backend/test_backend.py
python backend/test_backend.py
```

### Test Full Demo

```python
# backend/test_full_demo.py
python backend/test_full_demo.py
```

### Manual curl Test

```bash
curl http://localhost:8000/
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "agent8 Backend API",
  "ai_model": "x-ai/grok-2-1212",
  "apis_configured": {
    "openrouter": true,
    "perplexity": true,
    "google": true
  }
}
```

---

## 🚀 Deployment Notes

### Production Checklist

- [ ] Change `SECRET_KEY` to random secure value
- [ ] Update `ALLOWED_ORIGINS` to production domains
- [ ] Set `ENVIRONMENT=production`
- [ ] Consider increasing `RATE_LIMIT_PER_MINUTE` based on usage
- [ ] Enable HTTPS
- [ ] Add authentication layer
- [ ] Monitor API usage and costs
- [ ] Setup error tracking (Sentry, etc.)

### Environment Variables

**Required:**
- `OPENROUTER_API_KEY` - Must be set

**Optional:**
- `PERPLEXITY_API_KEY` - Falls back to mock data
- `GOOGLE_API_KEY` - Not yet used
- `OPENROUTER_MODEL` - Defaults to `x-ai/grok-2-1212`

---

## 💰 API Costs

### OpenRouter (Grok 2-1212)
- **Cost:** Free tier available
- **Limits:** Check OpenRouter dashboard
- **Fallback:** Can switch to other models by changing `OPENROUTER_MODEL`

### Alternative Models

Edit `backend/.env`:
```bash
# Free alternatives
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
OPENROUTER_MODEL=google/gemini-flash-1.5:free

# Paid alternatives
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_MODEL=openai/gpt-4-turbo
```

---

## 📚 Additional Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Perplexity API Docs](https://docs.perplexity.ai)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**Last Updated:** Session 3 - API Migration Complete  
**API Version:** 1.0  
**Backend Version:** 0.1.0
