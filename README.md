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

## Monitoring

- [Phoenix Arize Projects Dashboard](https://app.phoenix.arize.com/projects) - Monitor and analyze your AI agent's performance, traces, and metrics in real-time.

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

## Deployment

### Prerequisites

- Node.js 18+ and npm/pnpm installed
- PM2 installed globally: `npm install -g pm2`
- A VPS with SSH access

### PM2 Configuration

The project includes an `ecosystem.config.js` file for PM2 process management with the following features:

- Automatic clustering (utilizes all CPU cores)
- Memory management (auto-restart at 1GB)
- Log rotation and management
- Production-ready settings

To start the application in production:

```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js --env production

# Save the PM2 process list
pm2 save

# Set up PM2 to start on system boot
pm2 startup
```

### GitHub Actions Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployments. To set it up:

1. Add these secrets to your GitHub repository (Settings > Secrets > Actions):

   - `VPS_HOST`: Your VPS IP or hostname
   - `VPS_USER`: SSH username
   - `VPS_SSH_KEY`: Private SSH key for authentication
   - `VPS_PATH`: Deployment directory on the VPS
   - `PM2_APP_NAME`: (Optional) Name for your PM2 process (defaults to 'nextjs-app')

2. Push to the `main` branch to trigger the deployment

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_AUTH0_DOMAIN=your_auth0_domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id
# Add other environment variables as needed
```

# Package the UI without node_modules, .next, .git, .vscode, .github, and backend folders

```bash
cd /Users/hunglv/Downloads/Projects/mcpservers
zip -r agent-ui-v0.zip agent-ui -x "*/node_modules/*" "*/.next/*" "*/.git/*" "*/.vscode/*" "*/.github/*" "*/backend/*"
```


The default admin account is:

- Email: admin@gmail.com
- Password: Admin@123
