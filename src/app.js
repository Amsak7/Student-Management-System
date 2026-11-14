const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const studentRoutes = require('./routes/studentRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { setupSwagger } = require('./swagger/swaggerDoc');

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request logging (suppressed in test environment)
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Serve public static frontend dashboard
app.use(express.static(path.join(__dirname, 'public')));

// Mount Swagger interactive documentation
setupSwagger(app);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptimeSeconds: Number(process.uptime().toFixed(2)),
    nodeVersion: process.version,
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use(`${config.apiPrefix}/students`, studentRoutes);

// Fallback 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
