import { Request } from 'express';
import logger from '../config/logger';
import { RimsHelper } from './rims.Helper';

export default class RimsController {
  static async handleFileUpload(req: Request) {
    try {
      const rows = await RimsHelper.handleDocumentParseFromRequest(req);
      const { valid, invalid } = RimsHelper.validateDocuments(rows);
      const { savedDocs, updatedDocs } = await (new RimsHelper(valid)).handleInsertionAndUpdate();
      return {
        valid: valid.length,
        invalid: invalid.length,
        file_total: rows.length,
        saved: savedDocs.length,
        updated: updatedDocs.length,
      };
    } catch (e) {
      logger.error('rims-handle-file-upload', e);
      throw e;
    }
  }
}
