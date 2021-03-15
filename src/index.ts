// import cors from 'cors';
// import express, { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import appRouter from './api/routes';
// import APIError from './libraries/APIError';
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