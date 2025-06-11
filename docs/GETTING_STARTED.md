# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18 or later
- pnpm 8 or later
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/agent-ui.git
   cd agent-ui
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Copy the example environment file and update the values:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`

## First Steps

1. Open your browser and navigate to `http://localhost:3000`
2. Start interacting with the chat interface
3. Explore the different features and settings

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Check TypeScript types
