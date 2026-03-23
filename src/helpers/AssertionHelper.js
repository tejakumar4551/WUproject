// src/helpers/AssertionHelper.js
const { expect } = require('@playwright/test');

// AssertionHelper wraps Playwright's expect() with
// domain-specific methods that read like plain English.
// Every method returns 'this' so you can chain calls together.
//
// Example:
//   assert.statusOk(res).bodyHasKey(body, 'id').contentTypeJson(res)

class AssertionHelper {
  // ── Status code assertions ──────────────────────────────────────

  status(response, expected) {
    expect(
      response.status(),
      `Expected status ${expected} but got ${response.status()}`
    ).toBe(expected);
    return this; // return this = enable chaining
  }

  statusOk(response)          { return this.status(response, 200); }
  statusCreated(response)     { return this.status(response, 201); }
  statusNoContent(response)   { return this.status(response, 204); }
  statusBadRequest(response)  { return this.status(response, 400); }
  statusUnauthorized(response){ return this.status(response, 401); }
  statusForbidden(response)   { return this.status(response, 403); }
  statusNotFound(response)    { return this.status(response, 404); }
  statusServerError(response) { return this.status(response, 500); }

  // status must be one of the provided codes
  statusIn(response, codes = []) {
    expect(
      codes,
      `Status ${response.status()} not in [${codes.join(', ')}]`
    ).toContain(response.status());
    return this;
  }

  // ── Header assertions ───────────────────────────────────────────

  headerExists(response, name) {
    expect(
      response.headers()[name.toLowerCase()],
      `Header '${name}' should exist`
    ).toBeDefined();
    return this;
  }

  contentTypeJson(response) {
    expect(
      response.headers()['content-type'],
      'Content-Type should be application/json'
    ).toContain('application/json');
    return this;
  }

  // ── Body assertions ─────────────────────────────────────────────

  bodyHasKey(body, key) {
    expect(
      body,
      `Response body should have key '${key}'`
    ).toHaveProperty(key);
    return this;
  }

  bodyEquals(body, key, expected) {
    expect(
      body[key],
      `body.${key} should equal ${JSON.stringify(expected)}`
    ).toEqual(expected);
    return this;
  }

  bodyNotNull(body, key) {
    expect(
      body[key],
      `body.${key} should not be null or undefined`
    ).not.toBeNull();
    return this;
  }

  // ── Array assertions ────────────────────────────────────────────

  isArray(body) {
    expect(Array.isArray(body), 'Response body should be an array').toBe(true);
    return this;
  }

  arrayNotEmpty(body) {
    this.isArray(body);
    expect(body.length, 'Array should not be empty').toBeGreaterThan(0);
    return this;
  }

  arrayLength(body, length) {
    this.isArray(body);
    expect(body.length, `Array length should be ${length}`).toBe(length);
    return this;
  }

  // ── Performance assertion ───────────────────────────────────────

  responseTime(durationMs, maxMs) {
    expect(
      durationMs,
      `Response took ${durationMs}ms — limit is ${maxMs}ms`
    ).toBeLessThanOrEqual(maxMs);
    return this;
  }

  // ── Schema assertion ────────────────────────────────────────────

  matchesSchema(body, schema) {
    // import AJV only when needed (lazy load)
    const Ajv        = require('ajv');
    const addFormats = require('ajv-formats');
    const ajv        = new Ajv({ allErrors: true });
    addFormats(ajv);

    const validate = ajv.compile(schema);
    const valid    = validate(body);

    expect(
      valid,
      `Schema validation failed:\n${JSON.stringify(validate.errors, null, 2)}`
    ).toBe(true);
    return this;
  }
}

module.exports = AssertionHelper;
