const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log('\n================================================================');
  console.log('   STUDENT MANAGEMENT SYSTEM - RESTful API & SWAGGER SERVER     ');
  console.log('================================================================');
  console.log(`🚀 Server running on:       http://localhost:${config.port}`);
  console.log(`📖 Interactive Swagger UI:  http://localhost:${config.port}/api-docs`);
  console.log(`💻 Student Dashboard UI:   http://localhost:${config.port}`);
  console.log(`🩺 Health Diagnostics:     http://localhost:${config.port}/api/v1/health`);
  console.log(`📊 Academic Analytics:     http://localhost:${config.port}/api/v1/students/stats`);
  console.log(`📁 Data Store:             ${config.dataFile}`);
  console.log('================================================================\n');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully...');
  server.close(() => {
    console.log('HTTP server closed successfully.');
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server gracefully...');
  server.close(() => {
    console.log('HTTP server closed successfully. Goodbye!');
    process.exit(0);
  });
});
