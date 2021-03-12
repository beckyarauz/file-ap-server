import mongoose from 'mongoose';
import { environment_variables } from './config';
import { logger } from './logger';

const mongoUri = environment_variables.mongo_uri;

mongoose.connection.on('error', (error) => {
  console.log(error.message);
  logger.error('database-connection-error', error);
});

mongoose.connection.on('connected', () => {
  logger.info('database-connected', 'Database connection established');
});

const createDB = (env?: string) => {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  return mongoose;
};

export default createDB;

