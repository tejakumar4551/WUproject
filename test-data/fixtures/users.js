// test-data/fixtures/users.js
// Static, predictable payloads for tests that need known values.
// Use DataFactory for random data — use these when the exact value matters.

const validUser = {
  name:  'Jane Doe',
  email: 'jane.doe@example.com',
  username: 'janedoe',
  phone: '555-0199',
};

const userMissingEmail = {
  name:     'No Email',
  username: 'noemail',
};

const userInvalidEmail = {
  name:  'Bad Email',
  email: 'not-an-email',
};

module.exports = { validUser, userMissingEmail, userInvalidEmail };
