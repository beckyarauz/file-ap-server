import mongoose from 'mongoose';
import Config from './config';
import logger from './logger';

const mongoUri = Config.environment_variables.mongo_uri;

mongoose.connection.on('error', (error) => {
  logger.error('database-connection-error', error);
});

mongoose.connection.on('connected', () => {
  logger.info('database-connected', 'Database connection established');
});

const createDB = () => {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export default createDB;

