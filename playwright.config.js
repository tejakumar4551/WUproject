// playwright.config.js
const { defineConfig } = require('@playwright/test');

// Load env file based on ENV variable (default: dev)
const env = process.env.ENV || 'dev';
require('dotenv').config({ path: `./test-data/environments/.env.${env}` });

module.exports = defineConfig({
  testDir:       './tests',
  timeout:       30_000,
  retries:       process.env.CI ? 2 : 1,
  workers:       process.env.CI ? 4 : 2,
  fullyParallel: true,
  forbidOnly:    !!process.env.CI,

  globalSetup:    './src/utils/globalSetup.js',
  globalTeardown: './src/utils/globalTeardown.js',

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    },
    ignoreHTTPSErrors: true,
    trace:             'on-first-retry',
  },

  projects: [
    {
      name:    'smoke',
      testDir: './tests/smoke',
    },
    {
      name:    'regression',
      testDir: './tests/regression',
    },
    {
      name:    'integration',
      testDir: './tests/integration',
      timeout: 60_000,
    },
  ],
});
