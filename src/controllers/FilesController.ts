import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { logger } from '../config/logger';
import APIError from '../libraries/APIError';
import RimsController from '../Rims/rims.controller';
import TimeSnapsController from '../Timesnaps/timesnaps.controller';

export default class FilesController {
  static async handleFileUpload(req: Request, res: Response, next: NextFunction) {
    const { fileType } = req.params;
    logger.info('file-upload-handler-start', `File upload started`);
    switch (fileType) {
      case 'rims':
        await RimsController.handleFileUpload(req);
        break;
      case 'timesnaps':
        await TimeSnapsController.handleFileUpload(req);
        break;
      default:
        logger.error('file-upload-error', `File type not supported: Type: ${fileType}`);
        throw new APIError('File type not supported', httpStatus.BAD_REQUEST);
        break;
    }
    logger.info('file-upload-handler-end', `File upload ended`);
  }
}
