// src/utils/Logger.js
// Winston logger — writes to files ONLY
// Console stays clean — CustomReporter handles terminal output
//
// Two log files written automatically:
//   reports/logs/combined.log  — every level: INFO, WARN, ERROR, DEBUG
//   reports/logs/error.log     — only ERROR level
//
// Log levels used across framework:
//   logger.info()  — every request sent, every response received
//   logger.warn()  — retries, health check warnings, unexpected status
//   logger.error() — failed requests, schema errors, setup failures
//   logger.debug() — detailed data — request body, response headers
//
// To enable console logging temporarily for debugging:
//   LOG_CONSOLE=true npx playwright test

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs   = require('fs');

// ensure log directory exists before winston tries to write
const LOG_DIR = path.resolve('./reports/logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ── file format — plain text, no colour codes ─────────────────────
// Timestamp comes first on every line
// Format: 2024-03-18 10:30:01.142  [INFO   ]  message  | key=value
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    // filter internal winston keys
    const keys = Object.keys(meta).filter(k => k !== 'splat');

    // format meta as key=value pairs
    const metaStr = keys.length
      ? '  |  ' + keys
          .map(k => `${k}=${JSON.stringify(meta[k])}`)
          .join('  |  ')
      : '';

    return `${timestamp}  [${level.toUpperCase().padEnd(7)}]  ${message}${metaStr}`;
  })
);

// ── ANSI colour codes for optional console output ─────────────────
const C = {
  reset:    '\x1b[0m',
  bold:     '\x1b[1m',
  grey:     '\x1b[90m',
  white:    '\x1b[97m',
  green:    '\x1b[92m',
  yellow:   '\x1b[93m',
  red:      '\x1b[91m',
  blue:     '\x1b[94m',
  magenta:  '\x1b[95m',
  bgBlue:   '\x1b[44m',
  bgYellow: '\x1b[43m',
  bgRed:    '\x1b[41m',
  bgMag:    '\x1b[45m',
};

const LEVEL_BADGE = {
  info:    `${C.bgBlue}${C.white}  INFO  ${C.reset}`,
  warn:    `${C.bgYellow}\x1b[30m  WARN  ${C.reset}`,
  error:   `${C.bgRed}${C.white}  ERROR ${C.reset}`,
  debug:   `${C.bgMag}${C.white}  DEBUG ${C.reset}`,
};

const MSG_COLOUR = {
  info:  C.white,
  warn:  C.yellow,
  error: C.red,
  debug: C.magenta,
};

const consoleFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const ts    = `${C.grey}${C.bold}${timestamp}${C.reset}`;
    const badge = LEVEL_BADGE[level] || `[${level.toUpperCase()}]`;
    const msg   = `${MSG_COLOUR[level] || ''}${message}${C.reset}`;

    const keys = Object.keys(meta).filter(k => k !== 'splat');
    const metaStr = keys.length
      ? '  ' + keys
          .map(k => `${C.blue}${k}${C.reset}=${C.yellow}${JSON.stringify(meta[k])}${C.reset}`)
          .join('  ')
      : '';

    return `${ts}  ${badge}  ${msg}${metaStr}`;
  })
);

// ── create logger — file transports only by default ───────────────
const logger = createLogger({
  level:        process.env.LOG_LEVEL || 'info',
  exitOnError:  false,
  transports: [
    // ERROR level only → error.log
    new transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level:    'error',
      format:   fileFormat,
    }),
    // ALL levels → combined.log
    new transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      format:   fileFormat,
    }),
  ],
});

// add console transport only when LOG_CONSOLE=true
// useful for debugging without changing any code
if (process.env.LOG_CONSOLE === 'true') {
  logger.add(new transports.Console({ format: consoleFormat }));
}

module.exports = logger;
