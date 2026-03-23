# Playwright API Automation Framework

A clean, medium-level API automation framework built with Playwright and JavaScript.
Designed for a 5-year experience level — readable, maintainable, no unnecessary complexity.

---

## Project Structure

```
pw-api-framework/
│
├── src/
│   ├── client/
│   │   └── ApiClient.js          # Base HTTP client — GET, POST, PUT, PATCH, DELETE
│   │
│   ├── config/
│   │   └── EnvConfig.js          # All env values in one place — never use process.env in tests
│   │
│   ├── helpers/
│   │   ├── AssertionHelper.js    # Chainable assertions — statusOk, bodyHasKey, matchesSchema
│   │   ├── DataFactory.js        # Random test data — DataFactory.user(), DataFactory.post()
│   │   └── RequestHelper.js      # Utilities — timed(), withRetry(), parseJson(), wait()
│   │
│   ├── schemas/
│   │   ├── UserSchema.js         # JSON Schema for /users responses
│   │   └── PostSchema.js         # JSON Schema for /posts responses
│   │
│   └── utils/
│       ├── fixtures.js           # Extended test() with apiClient, assert, env pre-wired
│       ├── globalSetup.js        # Runs once before all tests — health check, create dirs
│       └── globalTeardown.js     # Runs once after all tests — print summary
│
├── tests/
│   ├── smoke/
│   │   └── users.smoke.test.js           # Critical path — GET users, 404
│   ├── regression/
│   │   ├── posts.regression.test.js      # Full CRUD — GET, POST, PUT, PATCH, DELETE
│   │   └── errorHandling.regression.test.js  # Negative tests — 404, bad input, headers
│   └── integration/
│       └── userFlow.integration.test.js  # 6-step flow — create user, post, comment, update, delete
│
├── test-data/
│   ├── fixtures/
│   │   └── users.js              # Static test payloads for predictable tests
│   └── environments/
│       ├── .env.dev              # Dev environment config
│       └── .env.staging          # Staging environment config
│
├── playwright.config.js
├── package.json
└── README.md
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Run smoke tests (fastest — use after every deploy)
npm run test:smoke

# Run regression tests (full CRUD coverage)
npm run test:regression

# Run integration tests (end-to-end flows)
npm run test:integration

# Run everything
npm test

# Run against staging
ENV=staging npm run test:regression

# Open HTML report
npm run report
```

---

## JavaScript Concepts Used

Every concept in this framework maps to something you have already learned:

| File | Concepts used |
|---|---|
| `ApiClient.js` | class, constructor, this, async/await, template literals, spread |
| `AssertionHelper.js` | class, this, method chaining (return this), require |
| `DataFactory.js` | object, spread for overrides, arrow functions, Array.from |
| `RequestHelper.js` | async/await, try/catch, HOFs (timed, withRetry), destructuring |
| `EnvConfig.js` | const, object, parseInt, logical OR fallbacks |
| `fixtures.js` | require, module.exports, async/await, destructuring |
| `*.test.js` | async/await, destructuring, const/let, template literals, HOFs |

---

## Environment Variables

All config lives in `test-data/environments/`. Never read `process.env` directly in tests.

| Variable | Description | Default |
|---|---|---|
| `BASE_URL` | API base URL | `https://jsonplaceholder.typicode.com` |
| `ENV` | Environment name | `dev` |
| `TIMEOUT` | Default timeout (ms) | `30000` |
| `RETRY_COUNT` | Retry attempts on failure | `2` |

---

## Adding a New Endpoint

1. Add schema → `src/schemas/MyResourceSchema.js`
2. Add test data → `test-data/fixtures/myResource.js`
3. Write test → `tests/regression/myResource.regression.test.js`

```js
// tests/regression/myResource.regression.test.js
const { test }      = require('../../src/utils/fixtures');
const { parseJson } = require('../../src/helpers/RequestHelper');
const { MySchema }  = require('../../src/schemas/MyResourceSchema');

test.describe('MyResource API', () => {

  test('should return resource list', async ({ apiClient, assert }) => {
    const response = await apiClient.get('/my-resource');
    const body     = await parseJson(response);

    assert.statusOk(response).arrayNotEmpty(body);
    assert.matchesSchema(body[0], MySchema);
  });

});
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| `@playwright/test` | Test runner + HTTP client |
| `ajv` + `ajv-formats` | JSON Schema validation |
| `@faker-js/faker` | Random test data generation |
| `dotenv` | Environment variable loading |
