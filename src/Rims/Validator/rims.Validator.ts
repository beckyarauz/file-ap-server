import { DocumentsValidator } from '../../libraries/DocumentsValidaror';
import { RowData } from '../../libraries/Global.interfaces';
import { Validator } from '../../libraries/SchemaValidator';
import { getValidator } from './rims.validator.config';

export class RimsDocumentsValidator extends DocumentsValidator<Validator> {
  constructor(documents: RowData[]) {
    super(
      documents,
      getValidator()
    );
  }

  validate = (): RowData[] => {
    return this.validateDocuments();
  }
}
