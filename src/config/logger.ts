import _ from 'lodash';
import * as winston from 'winston';

interface LoggerDefaultFields {
  logLevel: string;
  logType: string;
  logMessage: string;
  application: string;
  timestamp: string;
  customFields?: {
    [key: string]: any
  };
}

class Logger {
  application: string;
  logLevel: string;
  logLevels: { [key: string]: number};
  logLevelCode: number;
  winstonLogger: winston.Logger;

  constructor() {
    this.application = 'document-app';
    this.logLevel = this.getLogLevel();
    this.logLevels = { error: 0, warning: 1, info: 2, debug: 3 };
    this.logLevelCode = this.logLevels[this.logLevel];

    const consoleTransport = new winston.transports.Console({
      level: this.logLevel,
      handleExceptions: true,
    });

    this.winstonLogger = winston.createLogger({
      levels: this.logLevels,
      transports: [consoleTransport]
    });
  }

  getLogLevel() {
    switch ((process.env.NODE_ENV || '').toLowerCase()) {
      case 'production':
        return 'info';
      case 'staging':
        return 'info';
      case 'test':
        return 'error';
      case 'development':
        return 'debug';
      default:
        return 'debug';
    }
  }

  isLogable(logLevelName: string | number) {
    return this.logLevels[logLevelName] <= this.logLevelCode;
  }

  writeLog(logLevel: string, logType: any, logMessage: string) {
    try {
      if (this.isLogable(logLevel)) {
        const defaultFields: LoggerDefaultFields = {
          logLevel,
          logType,
          logMessage,
          application: this.application,
          timestamp: new Date().toISOString(),
        };

        this.winstonLogger.log(logLevel, logMessage, defaultFields);
      }
    } catch ({ message, stack }) {
      process.stderr.write(JSON.stringify({
        logLevel: 'fatal',
        logType,
        logMessage,
        reservedFields: {
          exception: message,
          stackTrace: stack,
        },
      }) + '\n');
    }
  }

  debug(type: string, message: string) {
    this.writeLog('debug', type, message);
  }

  info(type: string, message: string) {
    this.writeLog('info', type, message);
  }

  warn(type: string, message: string) {
    this.writeLog('warning', type, message);
  }

  error(type: string, message: string | Error) {
    if (message instanceof Error) {
      const { message: msg } = message;
      this.writeLog('error', type, msg);
    } else {
      this.writeLog('error', type, message);
    }
  }
}

const logger = new Logger();

export {
    logger
};
