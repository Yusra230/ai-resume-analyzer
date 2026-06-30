// server.js
const dotenv = require('dotenv');
dotenv.config(); 

const app = require('./src/app');
const { PORT } = require('./src/config/constants');

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown (production safety)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});