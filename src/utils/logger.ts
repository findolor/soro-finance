import winston from 'winston';
import environment from '../config/environment';

const logger = winston.createLogger({
  level: environment.logLevel,
  format: winston.format.json(),
  defaultMeta: { service: 'soro-finance-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production, log to the console
if (environment.isDevelopment) {
  logger.add(new winston.transports.Console({
    format: winston.format.json()
  }));
}

export default logger; 