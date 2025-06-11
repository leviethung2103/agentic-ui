# Configuration Reference

## Environment Variables

Create a `.env.local` file in the root directory to override the following environment variables:

### Required

- `NEXT_PUBLIC_API_URL`: The base URL for your API
- `NEXT_PUBLIC_AGENT_ID`: The ID of your Agno agent

### Optional

- `NEXT_PUBLIC_APP_NAME`: The name of your application (default: "Agent UI")
- `NEXT_PUBLIC_APP_DESCRIPTION`: A short description of your application
- `NEXT_PUBLIC_THEME_COLOR`: Primary color for the UI (default: "#0070f3")
- `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable analytics (default: "false")

## Feature Flags

You can enable/disable features using the following environment variables:

- `NEXT_PUBLIC_FEATURE_CHAT`: Enable chat functionality (default: "true")
- `NEXT_PUBLIC_FEATURE_TOOLS`: Enable tools support (default: "true")
- `NEXT_PUBLIC_FEATURE_REASONING`: Enable reasoning steps (default: "true")
- `NEXT_PUBLIC_FEATURE_REFERENCES`: Enable references support (default: "true")
