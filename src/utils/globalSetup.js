// src/utils/globalSetup.js
const fs     = require('fs');
const path   = require('path');
const logger = require('./Logger');

async function globalSetup() {
  console.log('\n--- Global Setup ---');

  // create reports and logs folders
  const dirs = [
    path.resolve('./reports'),
    path.resolve('./reports/logs'),
    path.resolve('./reports/html'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  logger.info('Global setup started', {
    env:     process.env.ENV || 'dev',
    baseUrl: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
  });

  // API health check
  const baseUrl = process.env.BASE_URL || 'https://jsonplaceholder.typicode.com';
  try {
    const response = await fetch(`${baseUrl}/posts/1`);
    if (response.ok) {
      logger.info('API health check passed', { baseUrl, status: response.status });
      console.log(`API health check passed (${baseUrl})`);
    } else {
      logger.warn('API health check returned unexpected status', {
        baseUrl,
        status: response.status,
      });
      console.warn(`API health check returned ${response.status}`);
    }
  } catch (err) {
    logger.error('API health check failed', { error: err.message });
    console.error(`API health check failed: ${err.message}`);
  }

  logger.info('Global setup complete');
  console.log('--- Setup complete ---\n');
}

module.exports = globalSetup;
