# Setup Front End
pnpm install
npm run build

if pm2 describe agent-ui &> /dev/null; then
    echo "Stopping existing frontend PM2 process..."
    pm2 delete agent-ui
fi

# Start the application with PM2
echo "Starting frontend application..."
pm2 start pnpm --name "agent-ui" -- start -H 0.0.0.0

# Save PM2 process list and set up startup
echo "Setting up PM2 startup..."
pm2 save
pm2 startup | tail -n 1 | bash

# Verify the service is running
echo "Frontend deployment completed. Current PM2 processes:"
pm2 list

# Setup Backend
