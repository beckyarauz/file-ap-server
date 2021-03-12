import { generateStringJoiValidatorSchema, Validator } from '../../libraries/SchemaValidator';
import { getRimsColumns } from '../config/rims.config';

export const getValidator = (): Validator => {
  return generateStringJoiValidatorSchema(getRimsColumns());
};
