# Development Guide

## Prerequisites

- Node.js 18+
- pnpm 8+
- Git

## Getting Started

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/agent-ui.git
   cd agent-ui
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── app/           # Next.js app directory
├── lib/           # Utility functions and configurations
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

## Code Style

- Use TypeScript for type safety
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with React Hooks
- Prefer Tailwind CSS for styling

## Git Workflow

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push your changes and create a pull request

## Testing

Run the test suite:

```bash
pnpm test
```

## Linting

Check for code style issues:

```bash
pnpm lint
```

## Type Checking

Verify TypeScript types:

```bash
pnpm type-check
```
