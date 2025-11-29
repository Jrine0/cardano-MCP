# agent8

## AI-Powered Cardano Workflow Automation

This project provides an AI-powered platform for building and automating workflows on the Cardano blockchain using natural language descriptions.

## Features

-   **AI Workflow Generation**: Generates executable workflows from natural language prompts.
-   **Visual Editor**: A drag-and-drop interface for composing and editing workflows.
-   **Cardano Integration**: Supports direct interaction with Cardano wallets, decentralized exchanges (DEX), NFTs, and staking mechanisms.
-   **Real-time Updates**: Visualizes workflow construction and execution in real-time.
-   **Web Search Integration**: Incorporates web search capabilities for relevant Cardano information.
-   **Modern User Interface**: Features a dark mode and responsive design.

## Use Cases

-   **Developers**: For building and prototyping Cardano dApps.
-   **Traders**: For automating DeFi strategies on Cardano.
-   **NFT Creators**: For streamlining NFT minting and management.
-   **Researchers**: For experimenting with blockchain interactions and smart contracts.

## Workflow Demonstration

Workflows can be initiated by natural language commands, such as:

```bash
"Swap 100 ADA for DJED on Minswap, then stake the rewards"
"Mint an NFT collection and list it on marketplace"
"Delegate to a stake pool and notify me when complete"
```

## Operational Flow

1.  **Describe Goal**: User provides a natural language description of the desired workflow.
2.  **AI Generation**: The system generates a visual workflow based on the description.
3.  **Review and Edit**: Users can modify, connect, and customize workflow nodes.
4.  **Execution**: The workflow is executed on the Cardano blockchain.

```mermaid
graph LR
    A[Natural Language Input] --> B[AI Workflow Processing]
    B --> C[Visual Workflow Representation]
    C --> D[Cardano Blockchain Execution]
```

## Getting Started

### Prerequisites

-   **Node.js**: Version 18 or newer
-   **npm**: Included with Node.js
-   **Python**: Version 3.9 or newer
-   **pip**: Included with Python

### Installation and Execution

To set up and run the project:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && pip install -r requirements.txt && cd ..

# Run both components in separate terminals
npm run dev              # Terminal 1: Frontend accessible on http://localhost:3000
python backend/main.py   # Terminal 2: Backend accessible on http://localhost:8000
```

Access the application via `http://localhost:3000` in your web browser.

### API Key Configuration

For testing and local development, certain API keys are pre-configured. For production environments, update the relevant keys in `backend/.env`.

-   OpenRouter (Grok 2)
-   Perplexity (for Web search)

## Environment Variables

### Frontend (`.env.local`)

```bash
VITE_BACKEND_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
VITE_ENABLE_DEBUG=true
```

### Backend (`backend/.env`)

```bash
OPENAI_API_KEY=sk-your-key-here          # Required
PERPLEXITY_API_KEY=pplx-your-key-here    # Optional
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Development

### Production Build

```bash
npm run build
```

### Linting and Formatting

```bash
npm run lint      # Executes ESLint
npm run format    # Executes Prettier
```

### Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
pytest
```

## Technology Stack

### Frontend

-   **React**: Version 19.2
-   **TypeScript**: Version 5.8
-   **Vite**: Version 6
-   **TailwindCSS**: Version 3.4
-   **Zustand**
-   **ReactFlow**
-   **Framer Motion**
-   **Mesh SDK**

### Backend

-   **FastAPI**: Version 0.115
-   **Socket.IO**
-   **OpenRouter (Grok)**
-   **Perplexity**
-   **Python**: Version 3.9+

### Blockchain Integration

-   **Cardano**
-   **Mesh SDK**
-   **Multiple Wallet Support**

## Security Considerations

-   Sensitive information such as API keys should not be committed to version control systems (`.env` or `.env.local`).
-   API keys must be securely stored and managed, preferably within backend environment variables.
-   Cross-Origin Resource Sharing (CORS) configurations should be reviewed and updated for production deployments.
-   Rate limiting is recommended for production APIs to prevent abuse.

## Documentation

-   [Codebase Analysis](tmp_rovodev_CODEBASE_ANALYSIS.md)
-   [Implementation Plan](PLAN.md)
-   [API Reference](API_DOCUMENTATION.md)

## Contributing

Contributions to this project are welcome. Please refer to the contributing guidelines for submission procedures.

## License

This project is licensed under the MIT License.

## Troubleshooting

### "Cannot find module" errors

Execute `npm install` to resolve frontend dependency issues.

### Backend startup failures

-   Ensure Python 3.9+ is installed and configured.
-   Verify that `OPENAI_API_KEY` is correctly set in `backend/.env`.
-   Attempt to upgrade backend dependencies: `pip install -r requirements.txt --upgrade`.

### Frontend-Backend connection issues

-   Confirm the backend service is running on port 8000.
-   Check CORS settings within `backend/main.py`.
-   Validate `VITE_SOCKET_URL` in `.env.local`.

### Wallet connection problems

-   Ensure a compatible Cardano wallet browser extension is installed.
-   Inspect the browser's developer console for error messages.
-   Attempt refreshing the page.

## Support

For technical assistance or inquiries, please open an issue on the GitHub issue tracker.

**Status**: In Active Development
**Version**: 0.1.0