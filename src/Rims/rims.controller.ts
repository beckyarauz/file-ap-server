import { Request } from 'express';
import { logger } from '../config/logger';
import { RimsHelper } from './rims.Helper';

export default class RimsController {
  static async handleFileUpload(req: Request) {
    try {
      const rows = await RimsHelper.handleDocumentParseFromRequest(req);
      const validDocs = RimsHelper.validateDocuments(rows);
      await (new RimsHelper(validDocs)).handleInsertionAndUpdate();
      return;
    } catch (e) {
      logger.error('rims-handle-file-upload', e);
      throw e;
    }
  }
}
