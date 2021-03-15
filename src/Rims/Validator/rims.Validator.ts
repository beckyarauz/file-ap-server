import { DocumentsValidator } from '../../libraries/DocumentsValidaror';
import { RowData } from '../../libraries/Global.interfaces';
import { Validator } from '../../libraries/SchemaValidator';
import RimsConfig from '../config/rims.config';
import { getValidator } from './rims.validator.config';

export class RimsDocumentsValidator extends DocumentsValidator<Validator> {
  constructor(documents: RowData[]) {
    super(
      documents,
      getValidator(),
      RimsConfig.getInstance().getTolerance()
    );
  }

  validate = (): { valid: RowData[], invalid: RowData[] } => {
    return this.validateDocuments();
  }
}
