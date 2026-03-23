// src/config/EnvConfig.js

// All environment values live here.
// Tests import this — never use process.env directly in test files.

const EnvConfig = {
  // which environment is running
  env: process.env.ENV || 'dev',

  // base API URL
  baseUrl: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',

  // timeouts in milliseconds
  timeouts: {
    default:  parseInt(process.env.TIMEOUT || '30000'),
    slow:     parseInt(process.env.TIMEOUT_SLOW || '60000'),
  },

  // performance thresholds in milliseconds
  perfThresholds: {
    fast:   200,
    normal: 1000,
    slow:   3000,
  },

  // retry settings
  retries: {
    count: parseInt(process.env.RETRY_COUNT || '2'),
    delay: parseInt(process.env.RETRY_DELAY || '1000'),
  },
};

module.exports = EnvConfig;
