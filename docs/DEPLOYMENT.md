# Deployment Guide

## Prerequisites

- A server with Node.js 18+ installed
- PM2 for process management (recommended)
- Nginx or another reverse proxy (optional but recommended)
- Domain name with DNS configured (optional)

## Deployment Steps

### 1. Server Setup

1. **Connect to your server**

   ```bash
   ssh user@your-server-ip
   ```

2. **Install required dependencies**
   ```bash
   sudo apt update
   sudo apt install -y git nodejs npm
   sudo npm install -g pnpm pm2
   ```

### 2. Clone and Configure

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/agent-ui.git
   cd agent-ui
   ```

2. **Install dependencies**

   ```bash
   pnpm install --prod
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   nano .env  # Update with your configuration
   ```

### 3. Build the Application

```bash
pnpm build
```

### 4. Start with PM2

```bash
pm2 start pnpm --name "agent-ui" -- start
pm2 save
pm2 startup  # Follow the instructions to enable startup on boot
```

### 5. Configure Nginx (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## CI/CD with GitHub Actions

This project includes a GitHub Actions workflow for automated deployments. To set it up:

1. Add the following secrets to your GitHub repository:

   - `VPS_HOST`: Your server IP
   - `VPS_USER`: SSH username
   - `VPS_SSH_KEY`: Private SSH key for deployment
   - `VPS_PATH`: Deployment path on the server
   - `PM2_APP_NAME`: Name for PM2 process
   - `REPO_URL`: Git repository URL

2. Push to the `main` branch to trigger deployment.
