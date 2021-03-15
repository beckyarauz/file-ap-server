import { createApi } from './api/app';
import Config from './config/config';
import createDB from './config/database';
import { logger } from './config/logger';


process.on('unhandledRejection', (exception: Error) => {
  logger.error('unhandled-promise-rejection', exception);
});

Config.init();

createDB();

createApi();
