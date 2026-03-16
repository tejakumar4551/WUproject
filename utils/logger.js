
import winston from 'winston';

// destructure from winston
const { createLogger, format, transports } = winston;

export const logger = createLogger({

  level: 'info',

  format: format.combine(

    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),

    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level.toUpperCase()} : ${message}`;
    })

  ),

  transports: [

    new transports.File({
      filename: 'logs/api.log'
    })

  ]

});