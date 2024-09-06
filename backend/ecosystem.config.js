module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/app.js',
    },
  ],

  deploy: {
    production: {
      user: 'ilko199126',
      host: '89.169.175.49',
      ref: 'origin/main',
      repo: 'git@github.com:gogy5/kupipodariday-backend.git',
      path: '/home/ilko199126/kupipodariday-backend',
      'pre-deploy-local':
        'scp ./t2.txt ilko199126@89.169.175.49:/home/ilko199126/kupipodariday-backend/source',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
// 192.168.0.12
// 89.169.175.49
