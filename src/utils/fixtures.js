// src/utils/fixtures.js
const { test: base, expect } = require('@playwright/test');
const ApiClient       = require('../client/ApiClient');
const AssertionHelper = require('../helpers/AssertionHelper');
const EnvConfig       = require('../config/EnvConfig');

// Extend Playwright's base test with our own fixtures.
// Every test that imports from this file gets:
//   apiClient  — ready to use HTTP client
//   assert     — assertion helper with all our custom methods
//   env        — environment config (baseUrl, timeouts, etc.)
//
// Usage in tests:
//   const { test } = require('../../src/utils/fixtures');
//   test('my test', async ({ apiClient, assert, env }) => { ... })

const test = base.extend({

  // apiClient fixture — creates a new ApiClient for every test
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);   // hand it to the test
    // cleanup (if needed) goes after use()
  },

  // assert fixture — creates a new AssertionHelper for every test
  assert: async ({}, use) => {
    const helper = new AssertionHelper();
    await use(helper);
  },

  // env fixture — gives access to all environment config
  env: async ({}, use) => {
    await use(EnvConfig);
  },

});

module.exports = { test, expect };
