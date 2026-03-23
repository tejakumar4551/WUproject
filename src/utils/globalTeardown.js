// src/utils/globalTeardown.js
const fs     = require('fs');
const path   = require('path');
const logger = require('./Logger');

async function globalTeardown() {
  console.log('\n--- Global Teardown ---');

  const resultsFile = path.resolve('./reports/results.json');

  if (fs.existsSync(resultsFile)) {
    try {
      const raw     = fs.readFileSync(resultsFile, 'utf8');
      const results = JSON.parse(raw);
      const { passed = 0, failed = 0, skipped = 0 } = results.stats || {};
      const total = passed + failed + skipped;

      // log final summary
      logger.info('Test run complete', { total, passed, failed, skipped });

      if (failed > 0) {
        logger.warn(`${failed} test(s) failed`, { failed });
      }

      console.log(`Total   : ${total}`);
      console.log(`Passed  : ${passed}`);
      console.log(`Failed  : ${failed}`);
      console.log(`Skipped : ${skipped}`);

    } catch (err) {
      logger.error('Could not read results file', { error: err.message });
      console.log('Could not read results file');
    }
  }

  logger.info('Global teardown complete');
  console.log('--- Teardown complete ---\n');
}

module.exports = globalTeardown;
