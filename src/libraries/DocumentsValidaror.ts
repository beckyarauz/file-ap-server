import httpStatus from 'http-status';
import { environment_variables } from '../config/config';
import { logger } from '../config/logger';
import APIError from './APIError';
import { RowData } from './Global.interfaces';
import { Validator, ValidatorResult } from './SchemaValidator';

export class DocumentsValidator<V extends Validator>{
  private documents: RowData[];
  private validator: V;
  private tolerance = environment_variables.tolerance;
  private validLines: RowData[] = [];
  private invalidLines: RowData[] = [];

  constructor(documents: RowData[], validator: V) {
    this.documents = documents;
    this.validator = validator;
  }

  private isWithinTolerance = (): void => {
    const size = this.documents.length;
    const invalidAmount = Math.round(size * this.tolerance / 100);
    const isDocumentInvalid = this.invalidLines.length > invalidAmount;

    if (isDocumentInvalid) {
      throw new APIError('Document is invalid', httpStatus.BAD_REQUEST);
    }
  }

  private validateRows = (): void => {
    try {
      for (const doc of this.documents) {
        const validation: ValidatorResult = this.validator.validate(doc);

        if (validation.error) {
          logger.warn('validate-row-invalid-line-warning', validation.error.message);
          this.invalidLines.push(doc);
          this.isWithinTolerance();
        } else {
          this.validLines.push(doc);
        }
      }
    } catch (e) {
      logger.error('validate-rows-error', e);
      throw e;
    }
  }

  validateDocuments = (): RowData[] => {
    try {
      this.validateRows();
      return this.validLines;
    } catch (e) {
      throw (e);
      return;
    }
  }
}
