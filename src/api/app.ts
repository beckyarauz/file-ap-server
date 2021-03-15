import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import APIError from '../libraries/APIError';
import appRouter from './routes';

export const app = express();

export const createApi = () => {
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
};

export const getApp = () => {
  return app;
};

