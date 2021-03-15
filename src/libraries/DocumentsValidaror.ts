import httpStatus from 'http-status';
import { logger } from '../config/logger';
import APIError from './APIError';
import { RowData } from './Global.interfaces';
import { Validator, ValidatorResult } from './SchemaValidator';

export class DocumentsValidator<V extends Validator>{
  private documents: RowData[];
  private validator: V;
  private tolerance: number;
  private validLines: RowData[] = [];
  private invalidLines: RowData[] = [];

  constructor(documents: RowData[], validator: V, tolerance: number) {
    this.documents = documents;
    this.validator = validator;
    this.tolerance = tolerance;
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

  validateDocuments = (): any => {
    try {
      this.validateRows();
      return {
        valid: this.validLines,
        invalid: this.invalidLines
      };
    } catch (e) {
      throw (e);
      return;
    }
  }
}
