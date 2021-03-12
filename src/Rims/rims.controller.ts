import { Request } from 'express';
import { logger } from '../config/logger';
import { RowData } from '../libraries/Global.interfaces';
import RimsFileParser from './Parser/rims.FileParser';
import { RimsHelper } from './rims.Helper';
import { RimsDocumentsValidator } from './Validator/rims.Validator';

export default class RimsController {
  static async handleFileUpload(req: Request) {
    try {
      const parser: RimsFileParser = new RimsFileParser(req);
      const rows: RowData[] = await parser.parse();
      const validator: RimsDocumentsValidator = new RimsDocumentsValidator(rows);
      const validDocs: RowData[] = validator.validate();
      await (new RimsHelper(validDocs)).handleInsertionAndUpdate();
      return;
    } catch (e) {
      logger.error('rims-handle-file-upload', e);
      throw e;
    }
  }
}
