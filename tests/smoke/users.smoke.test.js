// tests/smoke/users.smoke.test.js
// Smoke tests = fast critical path checks run on every deploy.
// If these fail the API is broken — no point running anything else.

const { test }           = require('../../src/utils/fixtures');
const { timed, parseJson } = require('../../src/helpers/RequestHelper');
const { UserSchema, UserListSchema } = require('../../src/schemas/UserSchema');

test.describe('Users API - Smoke', () => {

  // ── GET /users ────────────────────────────────────────────────
  test('should return list of users', async ({ apiClient, assert, env }) => {
    // timed() is a HOF — it wraps our API call and measures duration
    const [response, duration] = await timed(
      () => apiClient.get('/users')
    );

    // parse the JSON body from the response
    const body = await parseJson(response);

    // chain assertions — reads like plain English
    assert
      .statusOk(response)
      .contentTypeJson(response)
      .arrayNotEmpty(body)
      .responseTime(duration, env.perfThresholds.normal);

    // validate every field in the response matches our schema
    assert.matchesSchema(body, UserListSchema);
  });

  // ── GET /users/:id ────────────────────────────────────────────
  test('should return a single user by id', async ({ apiClient, assert }) => {
    const response = await apiClient.get('/users/1');
    const body     = await parseJson(response);

    assert
      .statusOk(response)
      .contentTypeJson(response)
      .bodyHasKey(body, 'id')
      .bodyHasKey(body, 'name')
      .bodyHasKey(body, 'email')
      .bodyEquals(body, 'id', 1);

    assert.matchesSchema(body, UserSchema);
  });

  // ── GET /users/:id - not found ────────────────────────────────
  test('should return 404 for non-existent user', async ({ apiClient, assert }) => {
    const response = await apiClient.get('/users/99999');
    assert.statusNotFound(response);
  });

});
