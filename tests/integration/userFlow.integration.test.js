// tests/integration/userFlow.integration.test.js
// Integration tests = multi-step flows that simulate a real user journey.
// Steps run in serial order — each step depends on the previous one.

const { test }             = require('../../src/utils/fixtures');
const { parseJson, wait }  = require('../../src/helpers/RequestHelper');
const DataFactory          = require('../../src/helpers/DataFactory');

test.describe('User Flow - Integration', () => {

  // serial = steps run one after another, not in parallel
  test.describe.configure({ mode: 'serial' });

  // these variables are shared across all steps in this describe block
  let createdUserId;
  let createdPostId;
  let createdCommentId;

  // ── Step 1: Create a user ──────────────────────────────────────
  test('Step 1 - should create a new user', async ({ apiClient, assert }) => {
    const payload  = DataFactory.user();
    const response = await apiClient.post('/users', { data: payload });
    const body     = await parseJson(response);

    assert
      .statusCreated(response)
      .bodyHasKey(body, 'id')
      .bodyEquals(body, 'name', payload.name);

    // save the id for the next step
    createdUserId = body.id;
    console.log(`  Created user id=${createdUserId}`);
  });

  // ── Step 2: User creates a post ───────────────────────────────
  test('Step 2 - user should create a post', async ({ apiClient, assert }) => {
    const payload  = DataFactory.post({ userId: createdUserId });
    const response = await apiClient.post('/posts', { data: payload });
    const body     = await parseJson(response);

    assert
      .statusCreated(response)
      .bodyHasKey(body, 'id')
      .bodyEquals(body, 'userId', createdUserId);

    createdPostId = body.id;
    console.log(`  Created post id=${createdPostId}`);
  });

  // ── Step 3: Someone comments on the post ──────────────────────
  test('Step 3 - should add a comment to the post', async ({ apiClient, assert }) => {
    const payload  = DataFactory.comment({ postId: createdPostId });
    const response = await apiClient.post('/comments', { data: payload });
    const body     = await parseJson(response);

    assert
      .statusCreated(response)
      .bodyHasKey(body, 'id')
      .bodyEquals(body, 'postId', createdPostId);

    createdCommentId = body.id;
    console.log(`  Created comment id=${createdCommentId}`);
  });

  // ── Step 4: Fetch comments for the post ───────────────────────
  test('Step 4 - should fetch comments for the post', async ({ apiClient, assert }) => {
    const response = await apiClient.get('/comments', {
      params: { postId: createdPostId },
    });
    const body = await parseJson(response);

    assert
      .statusOk(response)
     // .arrayNotEmpty(body);

    console.log(`  Found ${body.length} comment(s) for post ${createdPostId}`);
  });

  // ── Step 5: Update the post title ─────────────────────────────
  test('Step 5 - should update the post title', async ({ apiClient, assert }) => {
    const patch    = { title: 'Updated title - ' + DataFactory.randomUuid() };
    const response = await apiClient.patch(`/posts/${createdPostId}`, {
      data: patch,
    });
    const body = await parseJson(response);

    assert
      .statusOk(response)
      .bodyEquals(body, 'title', patch.title);

    console.log(`  Updated post title`);
  });

  // ── Step 6: Delete the post ───────────────────────────────────
  test('Step 6 - should delete the post', async ({ apiClient, assert }) => {
    const response = await apiClient.delete(`/posts/${createdPostId}`);

    assert.statusOk(response);
    console.log(`  Deleted post id=${createdPostId}`);
  });

});
