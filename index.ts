import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import httpStatus from 'http-status';
import APIError from './src/libraries/APIError';
import { logger } from './src/config/logger';
import appRouter from './src/api/routes';
import createDB from './src/config/database';
import config from './src/config/config';

console.log('MY CONF', config);

process.on('unhandledRejection', (exception: Error) => {
  logger.error('unhandled-promise-rejection', exception);
});

dotenv.config();

createDB();

const app = express();

app.use(cors());

app.use('/api', appRouter);

app.use((err: Error | APIError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof APIError) {
    res
      .status(err.status)
      .send(err.message);
  } else {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send('Something went wrong');
  }
  logger.error('api-error', err);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new APIError('404 Not Found', httpStatus.NOT_FOUND);
  return next(err);
});

// start the Express server
app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.APP_HOST}${process.env.PORT}`);
});
