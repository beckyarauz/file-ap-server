import express, { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import RimsController from './rims.controller';

const rimsRoutes = express.Router();

rimsRoutes.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('file-upload-handler-start', `File upload started. TimeStamp: ${Date.now()}`);
    const result = await RimsController.handleFileUpload(req);
    // TODO; enhance logger to accept custom fields
    logger.info('file-upload-handler-end', `File upload ended. TimeStamp: ${Date.now()}. Result: ${JSON.stringify(result)}`);
    res.json({
      message: 'success',
      result
    });
  } catch (e) {
    logger.error('post-rims-api-file-upload', e);
    next(e);
  }
});

export default rimsRoutes;
