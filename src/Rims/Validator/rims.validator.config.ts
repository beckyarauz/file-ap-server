import { generateStringJoiValidatorSchema, Validator } from '../../libraries/SchemaValidator';
import RimsConfig from '../config/rims.config';

export const getValidator = (): Validator => {
  const rims = RimsConfig.getInstance();
  return generateStringJoiValidatorSchema(rims.getRimsColumns());
};
