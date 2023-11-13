module.exports = {
  apps: [
    {
      name: 'bitboard',
      script: 'app.js', // Replace with the path to your Node.js application's entry file
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: '',
        DB_HOST: '',
        DB_PORT: '',
        DB_USERNAME: '',
        DB_USERNAME_PASSWORD: '',
        DB_NAME: 'bitboard',
      },
    },
  ],
};