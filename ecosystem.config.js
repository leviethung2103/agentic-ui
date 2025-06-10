module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: './node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development'
      },
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      // Error log path
      error_file: 'logs/nextjs-error.log',
      out_file: 'logs/nextjs-out.log',
      // Control flow
      min_uptime: '60s',
      max_restarts: 10,
      restart_delay: 5000,
      // Watch & Reload (optional, disable in production)
      watch: false,
      ignore_watch: ['node_modules', '.next', 'public', '.git', '*.log'],
      // Advanced features
      listen_timeout: 8000,
      kill_timeout: 1600,
      // Source map support
      source_map_support: true
    }
  ]
}
