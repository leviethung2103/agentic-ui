# Agent UI

A modern chat interface for AI agents built with Next.js, Tailwind CSS, and TypeScript. This template provides a ready-to-use UI for interacting with Agno agents.

<img src="https://github.com/user-attachments/assets/7765fae5-a813-46cb-993b-904af9bc1672" alt="agent-ui" style="border-radius: 10px; width: 100%; max-width: 800px;" />

## Features

- 💬 **Modern Chat Interface**: Clean design with real-time streaming support
- 🧩 **Tool Calls Support**: Visualizes agent tool calls and their results
- 🧠 **Reasoning Steps**: Displays agent reasoning process (when available)
- 📚 **References Support**: Show sources used by the agent
- 🖼️ **Multi-modality Support**: Handles various content types including images, video, and audio
- 🎨 **Customizable UI**: Built with Tailwind CSS for easy styling
- 🧰 **Built with Modern Stack**: Next.js, TypeScript, shadcn/ui, Framer Motion, and more

## Monitoring Agents

### Phoenix

- [Phoenix Arize Projects Dashboard](https://app.phoenix.arize.com/projects) - Monitor and analyze your AI agent's performance, traces, and metrics in real-time.
- [Phoenix Authentication](https://arize.com/docs/phoenix/self-hosting/features/authentication) - Documentation for setting up and managing authentication in your self-hosted Phoenix instance.

**Default Login Credentials:**
- **Email:** admin@localhost
- **Password:** admin

Usually, new password Admin@123

## Monitoring Tools

This project includes essential monitoring and database tools to help you manage your services:

### Qdrant Vector Database

Qdrant is a vector similarity search engine and database used for storing and retrieving vector embeddings.

- **Dashboard URL**: `http://your-vps-ip:6333/dashboard`
- **REST API**: `http://your-vps-ip:6333`
- **gRPC API**: `your-vps-ip:6334`
- **Features**:
  - High-performance vector search
  - Real-time indexing
  - Rich filtering capabilities
  - Horizontal scaling
  - Persistent storage with snapshot support

To manage Qdrant:

```bash
# Navigate to qdrant directory
cd ~/qdrant

# Start/Stop Qdrant
docker-compose up -d
docker-compose down

# View logs
docker-compose logs -f
```

### Dozzle

Dozzle is a lightweight, real-time log viewer for Docker containers. It provides a web interface to monitor your container logs, including Qdrant.

- **Access URL**: `http://your-vps-ip:8080`
- **Features**:
  - Real-time log streaming
  - Search and filter logs
  - Color-coded logs for better readability
  - Support for multiple containers

### Uptime Kuma

Uptime Kuma is a self-hosted monitoring tool that helps you monitor the uptime of your services.

- **Access URL**: `http://your-vps-ip:3001`
- **Features**:
  - Monitor HTTP(s) services
  - Get notifications (Email, Telegram, Discord, etc.)
  - Beautiful status pages
  - Response time monitoring
  - Certificate expiration monitoring

## Getting Started

### Prerequisites

Before setting up Agent UI, you may want to have an Agno Playground running. If you haven't set up the Agno Playground yet, follow the [official guide](https://agno.link/agent-ui#connect-to-local-agents) to run the Playground locally.

### Installation

### Automatic Installation (Recommended)

```bash
npx create-agent-ui@latest
```

### Manual Installation

1. Clone the repository:

```bash
git clone https://github.com/agno-agi/agent-ui.git
cd agent-ui
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### Code Formatting

This project uses Prettier for code formatting. To ensure consistent code style:

```bash
# Install dependencies (if not already installed)
npm install

# Format all files
npx prettier --write .

# Check formatting without making changes
npx prettier --check .

# Format specific file types
npx prettier --write "**/*.{js,jsx,ts,tsx,css,scss,json,md}"
```

### Pre-commit Hook (Optional)

To automatically format code before each commit, install `lint-staged` and `husky`:

```bash
# Install dependencies
npm install --save-dev lint-staged husky

# Set up husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

Add this to your `package.json`:

```json
"lint-staged": {
  "**/*": "prettier --write --ignore-unknown"
}
```

This will automatically format all staged files before each commit.

### VS Code Integration

For automatic formatting in VS Code:

1. Install the Prettier extension
2. Add these settings to your VS Code `settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

## Connecting to an Agent Backend

By default Agent UI connects to `http://localhost:7777`. You can easily change this by hovering over the endpoint URL and clicking the edit option.

The default endpoint works with the standard Agno Playground setup described in the [official documentation](https://agno.link/agent-ui#connect-to-local-agents).

## Running Embedding Model

To run the Nomic embedding model continuously, use the following curl command:

```bash
curl http://localhost:11434/api/embeddings -d '{"model": "nomic-embed-text:latest", "keep_alive": -1}'
```

This will keep the model loaded in memory for faster subsequent requests. The `keep_alive: -1` parameter ensures the model stays loaded until explicitly unloaded or the service restarts.

## Troubleshooting

### Port Already in Use

If you encounter a port conflict when starting the backend, you can kill any process using port 7777 with:

```bash
lsof -ti:7777 | xargs kill -9 2>/dev/null || true
```

This command will silently kill any process running on port 7777, or do nothing if the port is free.

## Deployment

### Prerequisites

- Node.js 18+ and npm/pnpm installed
- PM2 installed globally: `npm install -g pm2`
- A VPS with SSH access

### GitHub Actions Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployments. To set it up:

1. Add these secrets to your GitHub repository (Settings > Secrets > Actions):

   - `VPS_HOST`: Your VPS IP or hostname
   - `VPS_USER`: SSH username
   - `VPS_SSH_KEY`: Private SSH key for authentication
   - `VPS_PATH`: Deployment directory on the VPS

2. Push to the `main` branch to trigger the deployment

### Environment Variables

Create a `.env.local` file in the root directory with any necessary environment variables for your application:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=http://localhost:7777
```

# Package the UI without node_modules, .next, .git, .vscode, and backend folders

```bash
cd /Users/hunglv/Downloads/Projects/mcpservers
zip -r agent-ui-v2.3.zip agent-ui -x "*/node_modules/*" "*/.next/*" "*/.git/*" "*/.vscode/*" "*/.github/*" "*/backend/*" "*/lightrag-server/*" "*/lightrag-mcp/*" "*/ollama/*" "*/qdrant/*" "*/dozzle/*" "*/uptime/*" "*/logs/*" "*/docs/*" "*/litellm/*"

zip -r agent-ui-v2.3.zip frontend -x "*/frontend/node_modules/*" "*/frontend/.next/*" 

zip -r agent-ui-v2.3.zip frontend -x "frontend/node_modules/*" "frontend/.next/*"


```


## LightRAG MCP Integration

Agent UI includes integration with LightRAG MCP for enhanced document retrieval and knowledge graph capabilities. The LightRAG MCP server provides a unified interface for interacting with LightRAG API through the MCP protocol.

### Setup

If you prefer to run locally without Docker:

```bash
# Create a virtual environment
conda create -n lightrag python=3.10
conda activate lightrag

# Install dependencies
pip install -r requirements.txt

# Install library
pip install -e .

# Copy .env.example
cp .env.example .env


# Run server
# uvicorn src.lightrag_mcp.main:app --host 0.0.0.0 --port 8000
python src/lightrag_mcp/main.py
```

For more detailed documentation, refer to the [LightRAG MCP README](./lightrag-mcp/README.md).
