// tests/regression/posts.regression.test.js
// Regression tests = full CRUD coverage + edge cases.
// Run after smoke passes.

const { test }             = require('../../src/utils/fixtures');
const { parseJson }        = require('../../src/helpers/RequestHelper');
const { PostSchema, PostListSchema } = require('../../src/schemas/PostSchema');
const DataFactory          = require('../../src/helpers/DataFactory');

test.describe('Posts API - Regression', () => {

  // ── GET /posts ────────────────────────────────────────────────
  test('should return list of posts', async ({ apiClient, assert }) => {
    const response = await apiClient.get('/posts');
    const body     = await parseJson(response);

    assert
      .statusOk(response)
      .contentTypeJson(response)
      .arrayNotEmpty(body);

    assert.matchesSchema(body, PostListSchema);
  });

  // ── GET /posts with query params ──────────────────────────────
  test('should filter posts by userId', async ({ apiClient, assert }) => {
    // params object gets converted to ?userId=1 automatically
    const response = await apiClient.get('/posts', {
      params: { userId: 1 },
    });
    const body = await parseJson(response);

    assert.statusOk(response).arrayNotEmpty(body);

    // every post in results must belong to userId 1
    // map + filter are HOFs — using them to validate the array
    const allBelongToUser = body.every(post => post.userId === 1);
    assert.bodyEquals({ result: allBelongToUser }, 'result', true);
  });

  // ── GET /posts/:id ────────────────────────────────────────────
  test('should return a single post', async ({ apiClient, assert }) => {
    const response = await apiClient.get('/posts/1');
    const body     = await parseJson(response);

    assert
      .statusOk(response)
      .bodyEquals(body, 'id', 1)
      .bodyEquals(body, 'userId', 1);

    assert.matchesSchema(body, PostSchema);
  });

  // ── POST /posts ───────────────────────────────────────────────
  test('should create a new post', async ({ apiClient, assert }) => {
    // DataFactory generates random but realistic data
    const payload  = DataFactory.post({ userId: 1 });
    const response = await apiClient.post('/posts', { data: payload });
    const body     = await parseJson(response);

    assert
      .statusCreated(response)
      .bodyHasKey(body, 'id')
      .bodyEquals(body, 'title', payload.title)
      .bodyEquals(body, 'userId', payload.userId);
  });

  // ── PUT /posts/:id ────────────────────────────────────────────
  test('should fully update a post', async ({ apiClient, assert }) => {
    const payload  = DataFactory.post({ userId: 1 });
    const response = await apiClient.put('/posts/1', { data: payload });
    const body     = await parseJson(response);

    assert
      .statusOk(response)
      .bodyEquals(body, 'id', 1)
      .bodyEquals(body, 'title', payload.title);
  });

  // ── PATCH /posts/:id ──────────────────────────────────────────
  test('should partially update a post title', async ({ apiClient, assert }) => {
    const patch    = { title: 'Updated: ' + DataFactory.randomUuid() };
    const response = await apiClient.patch('/posts/1', { data: patch });
    const body     = await parseJson(response);

    assert
      .statusOk(response)
      .bodyEquals(body, 'title', patch.title);
  });

  // ── DELETE /posts/:id ─────────────────────────────────────────
  test('should delete a post', async ({ apiClient, assert }) => {
    const response = await apiClient.delete('/posts/1');
    assert.statusOk(response);
  });

  // ── Negative: GET non-existent post ──────────────────────────
  test('should return 404 for non-existent post', async ({ apiClient, assert }) => {
    const response = await apiClient.get('/posts/99999');
    assert.statusNotFound(response);
  });

});
