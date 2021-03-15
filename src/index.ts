import { createApi } from './api/app';
import Config from './config/config';
import createDB from './config/database';
import configFile from './config/files/prod.config.json';
import logger from './config/logger';

process.on('unhandledRejection', (exception: Error) => {
  logger.error('unhandled-promise-rejection', exception);
});

// TODO: inject the config file into init
Config.init(configFile);

createDB();

createApi();
