<div align="center">

# 🤖 agent8

### AI-Powered Cardano Workflow Automation

**Build blockchain workflows with natural language. Powered by AI.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)
[![Cardano](https://img.shields.io/badge/Cardano-Blockchain-blue)](https://cardano.org)
[![Python](https://img.shields.io/badge/Python-3.9+-green)](https://www.python.org/)

[Overview](#-overview) · [Getting Started](#-quick-start) · [Architecture](#-system-architecture) · [Documentation](#-documentation) · [Features](#-key-features)

</div>

---

## 🌟 Overview

**agent8** is an AI-powered workflow builder for the Cardano blockchain. Describe what you want to do in natural language, and watch as AI generates a complete, executable workflow with visual nodes and connections. Execute complex blockchain operations without writing code.

### Perfect For

- 💻 **Developers** - Build Cardano dApps with AI assistance
- 📈 **Traders** - Automate DeFi strategies (swaps, staking, delegation)
- 🎨 **NFT Creators** - Streamline NFT minting and collection management
- 🔬 **Researchers** - Experiment with blockchain interactions
- 🚀 **Everyone** - Explore Cardano without deep technical knowledge

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Workflow Generation** | Powered by Grok 2 (free via OpenRouter) |
| 🎨 **Visual Editor** | Drag-and-drop node-based workflow canvas |
| 💼 **Cardano Native** | Support for wallets, DEX, NFTs, staking, smart contracts |
| 🔄 **Real-time Updates** | See workflows build and execute live |
| 🌐 **Web Search** | AI searches for latest Cardano ecosystem info |
| 🎭 **Modern UI** | Lovable-inspired design with dark mode |
| 🔐 **Multi-Wallet Support** | Nami, Eternl, Lace, GeroWallet via Mesh SDK |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 19.2 + TypeScript + Tailwind CSS             │   │
│  │  • StartScreen (Chat Interface)                     │   │
│  │  • ChatPanel (Message History)                      │   │
│  │  • WorkflowPanel (Visual Node Editor)               │   │
│  │  • CustomNodes (Wallet, DEX, NFT, Staking, SC)      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│              ↓ Socket.IO Real-time Updates ↓                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FastAPI 0.115 + Socket.IO + Python 3.9+           │   │
│  │  • AI Agent (Grok 2 via OpenRouter)                 │   │
│  │  • Workflow Generation Engine                        │   │
│  │  • Node Creation & Management                        │   │
│  │  • Web Search Integration (Perplexity)              │   │
│  │  • Rate Limiting (SlowAPI)                           │   │
│  │  • CORS Configuration                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│         ↓ OpenRouter API ↓      ↓ Perplexity API ↓          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               BLOCKCHAIN INTEGRATION LAYER                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Mesh SDK + Wallet Integration                       │   │
│  │  • Wallet Connection (Nami, Eternl, Lace)          │   │
│  │  • Transaction Building                              │   │
│  │  • Smart Contract Interaction                        │   │
│  │  • NFT Minting (NMKR)                                │   │
│  │  • Staking Management                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│              ↓ Cardano Node ↓                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Input (Natural Language)
        ↓
AI Processing (Grok 2)
        ↓
Workflow Generation (Node + Edge Creation)
        ↓
Real-time WebSocket Updates
        ↓
Visual Rendering (React Flow)
        ↓
User Review & Modification
        ↓
Blockchain Execution (via Mesh SDK)
```

### Component Architecture

```
App.tsx
├── MeshProvider (Wallet Integration)
├── ReactFlowProvider (Visual Editor)
└── Layout
    ├── WalletConnect (Nami, Eternl, Lace)
    ├── StartScreen (Centered Chat Interface)
    ├── ChatPanel (Message History)
    ├── WorkflowPanel (React Flow Canvas)
    │   ├── WalletNode (Purple)
    │   ├── DEXNode (Blue)
    │   ├── NFTNode (Pink)
    │   ├── StakingNode (Orange)
    │   ├── SmartContractNode (Cyan)
    │   └── EmailNode (Green)
    ├── PreviewPanel (Workflow Preview)
    └── SettingsModal (API Configuration)
```

### Technology Stack

#### Frontend
| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React + TypeScript | 19.2 / 5.8 |
| **Build Tool** | Vite | 6.2 |
| **Styling** | Tailwind CSS | 3.4 |
| **State Management** | Zustand | 5.0 |
| **Visual Editor** | React Flow | 12.9 |
| **Animations** | Framer Motion | 11.0 |
| **Icons** | Lucide React | 0.460 |
| **Real-time** | Socket.IO Client | 4.8 |
| **Blockchain** | Mesh SDK | 1.9-beta |

#### Backend
| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | FastAPI | 0.115 |
| **Language** | Python | 3.9+ |
| **Real-time** | Socket.IO (async) | Latest |
| **AI Model** | Grok 2 (OpenRouter) | x-ai/grok-2-1212 |
| **Web Search** | Perplexity API | llama-3.1-sonar |
| **Rate Limiting** | SlowAPI | 0.1+ |
| **HTTP Client** | httpx | Latest |

#### Blockchain
| Component | Technology |
|-----------|-----------|
| **Blockchain** | Cardano |
| **Wallet Integration** | Mesh SDK |
| **Supported Wallets** | Nami, Eternl, Lace, GeroWallet |
| **DEX Support** | Minswap, SundaeSwap, Genius Yield, WingRiders |
| **NFT Minting** | NMKR |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ with npm
- **Python** 3.9+ with pip
- **5 minutes** of your time ⏱️

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Jrine0/cardano-MCP.git
cd cardano-MCP

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### Configuration

#### Frontend (`.env.local`)
```bash
VITE_BACKEND_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
VITE_ENABLE_DEBUG=true
```

#### Backend (`backend/.env`)
```bash
# Required
OPENROUTER_API_KEY=your-openrouter-key-here

# Optional
PERPLEXITY_API_KEY=your-perplexity-key-here
GOOGLE_API_KEY=your-google-key-here

# Configuration
OPENROUTER_MODEL=x-ai/grok-2-1212
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Running

```bash
# Terminal 1: Frontend (Vite dev server)
npm run dev
# → Open http://localhost:3000

# Terminal 2: Backend (FastAPI)
python backend/main.py
# → Backend running on http://localhost:8000
```

---

## 📖 Documentation

### API Reference

Detailed API documentation available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

**Key Endpoints:**
- `GET /` - Health check & API status
- `WS /socket.io` - WebSocket for real-time workflow generation

**Key Functions:**
- `generate_workflow(prompt)` - AI generates workflow from text
- `create_cardano_node(type, config)` - Creates workflow node
- `create_edge(source, target)` - Connects nodes
- `search_web(query)` - Web search for Cardano info

### Example Prompts

```
"Swap 100 ADA for DJED on Minswap, then stake the rewards"
"Mint an NFT collection called 'Cardano Legends' with 10 pieces"
"Delegate 1000 ADA to a stake pool with 4%+ APY"
"Buy NMKR tokens on SundaeSwap with 50 ADA"
"Connect my wallet and show my balance"
```

---

## 🛠️ Development

### Build for Production

```bash
npm run build
# Output: dist/
```

### Code Quality

```bash
npm run lint      # ESLint (TypeScript + React)
npm run format    # Prettier formatting
```

### Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
pytest
```

---

## 🔒 Security

### Important Notes

- ⚠️ **Never commit** `.env` or `.env.local` to git
- ⚠️ **API keys must be** in backend environment variables only
- ⚠️ **CORS is configured** for local development - update for production
- ⚠️ **Rate limiting** is enabled (100 req/min by default)

### Best Practices

1. Store all secrets in environment variables
2. Use HTTPS in production
3. Rotate API keys regularly
4. Implement proper authentication for production
5. Use environment-specific CORS configurations

---

## 🐛 Troubleshooting

### "Cannot find module" errors

```bash
npm install
```

### Backend won't start

```bash
# Ensure Python 3.9+ is installed
python --version

# Check API key
echo $OPENROUTER_API_KEY

# Upgrade dependencies
cd backend
pip install -r requirements.txt --upgrade
```

### Frontend can't connect to backend

- Backend running on port 8000? ✓
- Check CORS in `backend/main.py`
- Verify `VITE_SOCKET_URL` in `.env.local`
- Check browser console (F12) for errors

### Wallet connection issues

- Have Cardano wallet extension installed? ✓
- Try refreshing the page
- Check browser console for detailed errors
- Ensure wallet is on correct network (mainnet/testnet)

---

## 📊 Project Status

| Phase | Status | Completion |
|-------|--------|-----------|
| 🔒 Security & Configuration | ✅ Complete | 100% |
| 💻 Core Functionality | 🔄 In Progress | 50% |
| 🧪 Testing & Quality | ⏳ Planned | 0% |
| 🚀 Deployment Ready | ⏳ Planned | 0% |

**Current Version:** 0.1.0  
**Last Updated:** November 2025  
**License:** MIT

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript strict mode
- ESLint + Prettier formatting
- Meaningful variable names
- JSDoc comments for public functions

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **OpenRouter** - Free Grok 2 AI model access
- **Cardano Community** - Inspiration and support
- **Mesh SDK** - Cardano wallet integration
- **Lovable** - Design inspiration
- **FastAPI Team** - Excellent async Python framework

---

## 📞 Support & Contact

- 📚 [Documentation](API_DOCUMENTATION.md)
- 🐛 [Report Issues](https://github.com/Jrine0/cardano-MCP/issues)
- 💬 [Discussions](https://github.com/Jrine0/cardano-MCP/discussions)

---

<div align="center">

**Built with ❤️ for the Cardano ecosystem**

[⭐ Star on GitHub](https://github.com/Jrine0/cardano-MCP) · [🐦 Follow on Twitter](https://twitter.com/agent8_ai)

</div>
