// server.js
const dotenv = require('dotenv');
dotenv.config(); 

const app = require('./src/app');
const { PORT } = require('./src/config/constants');


// 🔥 ADD THIS TEST ROUTE DIRECTLY IN server.js
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is alive!' });
});

// 🔥 ADD A ROOT ROUTE
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

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