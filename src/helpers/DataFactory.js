// src/helpers/DataFactory.js
const { faker } = require('@faker-js/faker');

// DataFactory generates randomised test payloads.
// Using random data prevents test collisions when running in parallel
// and avoids hardcoded values that can go stale.

const DataFactory = {
  // ── User payload ─────────────────────────────────────────────────
  // overrides = any field you want to fix to a known value
  // e.g. DataFactory.user({ email: 'fixed@test.com' })
  user(overrides = {}) {
    return {
      name:     faker.person.fullName(),
      email:    faker.internet.email().toLowerCase(),
      username: faker.internet.userName(),
      phone:    faker.phone.number(),
      website:  faker.internet.url(),
      ...overrides,   // spread overrides last so they win
    };
  },

  // ── Post payload ─────────────────────────────────────────────────
  post(overrides = {}) {
    return {
      title:  faker.lorem.sentence(),
      body:   faker.lorem.paragraphs(1),
      userId: faker.number.int({ min: 1, max: 10 }),
      ...overrides,
    };
  },

  // ── Comment payload ──────────────────────────────────────────────
  comment(overrides = {}) {
    return {
      postId: faker.number.int({ min: 1, max: 100 }),
      name:   faker.person.fullName(),
      email:  faker.internet.email().toLowerCase(),
      body:   faker.lorem.paragraph(),
      ...overrides,
    };
  },

  // ── Helpers ──────────────────────────────────────────────────────
  randomInt: (min = 1, max = 100) => faker.number.int({ min, max }),
  randomUuid: ()                  => faker.string.uuid(),
  randomEmail: ()                 => faker.internet.email().toLowerCase(),

  // Create multiple items using a factory method
  // e.g. DataFactory.many('post', 5) → array of 5 post payloads
  many(type, count = 3, overrides = {}) {
    return Array.from(
      { length: count },
      () => this[type](overrides)
    );
  },
};

module.exports = DataFactory;
