const { AppError } = require('./errors');

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Handle syntax error from malformed JSON request bodies
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body';
  }

  // Log server errors
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      details,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    },
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
