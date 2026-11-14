const path = require('path');
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  dataFile: path.resolve(
    __dirname,
    '..',
    'data',
    process.env.DATA_FILE_NAME || 'students.json'
  ),
  seedFile: path.resolve(__dirname, '..', 'data', 'seed_students.json'),
};
