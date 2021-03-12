import mongoose from 'mongoose';
import { logger } from './logger';

const mongoUri = process.env.MONGO_URI;

const createDB = () => {
  console.log('MONGOURI', mongoUri);
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on('error', (error) => {
    console.log(error.message);
    logger.error('database-connection-error', error);
  });

  mongoose.connection.on('connected', () => {
    logger.info('database-connected', 'Database connection established');
  });
};

export default createDB;

