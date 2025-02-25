module.exports = {
  apps: [{
    name: 'react-app',
    script: 'bun',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }]
}; 