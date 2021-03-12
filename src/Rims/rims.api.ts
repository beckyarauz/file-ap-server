import express, { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import RimsController from './rims.controller';

const rimsRoutes = express.Router();

rimsRoutes.post('/upload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await RimsController.handleFileUpload(req);
    res.json({
      message: 'success'
    });
  } catch (e) {
    logger.error('post-rims-api-file-upload',e);
    next(e);
  }
});

export default rimsRoutes;
