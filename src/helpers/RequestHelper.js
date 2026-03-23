// src/helpers/RequestHelper.js

const logger = require('../utils/Logger');

// ── timed() ───────────────────────────────────────────────────────
// HOF: wraps any async function and measures its duration
async function timed(fn) {
  const start  = Date.now();
  const result = await fn();
  const ms     = Date.now() - start;
  logger.debug(`timed() completed`, { durationMs: ms });
  return [result, ms];
}

// ── withRetry() ───────────────────────────────────────────────────
// HOF: retries any async function up to retries times
async function withRetry(fn, retries = 3, delayMs = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // log every failed attempt as a warning
      logger.warn(`withRetry() attempt ${attempt}/${retries} failed`, {
        error: err.message,
      });

      if (attempt < retries) {
        const waitMs = delayMs * attempt;
        logger.info(`withRetry() waiting ${waitMs}ms before attempt ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
      }
    }
  }

  // all attempts failed — log as error then throw
  logger.error(`withRetry() all ${retries} attempts failed`, {
    error: lastError.message,
  });
  throw lastError;
}

// ── parseJson() ───────────────────────────────────────────────────
// Safely reads JSON from a Playwright response
async function parseJson(response) {
  try {
    const text = await response.text();
    if (!text || text.trim() === '') {
      logger.debug('parseJson() received empty body — returning null');
      return null;
    }
    return JSON.parse(text);
  } catch (err) {
    logger.error('parseJson() failed to parse response body', {
      error: err.message,
    });
    return null;
  }
}

// ── wait() ────────────────────────────────────────────────────────
function wait(ms) {
  logger.debug(`wait() pausing for ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { timed, withRetry, parseJson, wait };
