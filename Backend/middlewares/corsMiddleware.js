// middlewares/corsMiddleware.js
const cors = require('cors');

const corsMiddleware = cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

module.exports = corsMiddleware;
