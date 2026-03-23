// tests/regression/errorHandling.regression.test.js
// Negative tests — verify the API handles bad input correctly.

const { test }      = require('../../src/utils/fixtures');
const { parseJson } = require('../../src/helpers/RequestHelper');

test.describe('Error Handling - Regression', () => {

  // ── 404 scenarios ─────────────────────────────────────────────
  test.describe('404 Not Found', () => {

    test('should return 404 for unknown user', async ({ apiClient, assert }) => {
      const response = await apiClient.get('/users/99999');
      assert.statusNotFound(response);
    });

    test('should return 404 for unknown post', async ({ apiClient, assert }) => {
      const response = await apiClient.get('/posts/99999');
      assert.statusNotFound(response);
    });

  });

  // ── Header checks ──────────────────────────────────────────────
  test.describe('Response Headers', () => {

    test('should always return content-type header', async ({ apiClient, assert }) => {
      const response = await apiClient.get('/users/1');
      assert
        .statusOk(response)
        .headerExists(response, 'content-type');
    });

    test('should return json content-type for data endpoints', async ({ apiClient, assert }) => {
      const response = await apiClient.get('/posts/1');
      assert
        .statusOk(response)
        .contentTypeJson(response);
    });

  });

  // ── Empty / bad body ───────────────────────────────────────────
  test.describe('Bad Request Handling', () => {

    test('should handle empty POST body gracefully', async ({ apiClient, assert }) => {
      const response = await apiClient.post('/posts', { data: {} });
      // jsonplaceholder is lenient — real APIs would return 400/422
      assert.statusIn(response, [200, 201, 400, 422]);
    });

    test('should handle POST with wrong field types', async ({ apiClient, assert }) => {
      const payload  = { userId: 'not-a-number', title: 12345 };
      const response = await apiClient.post('/posts', { data: payload });
      assert.statusIn(response, [200, 201, 400, 422]);
    });

  });

});
