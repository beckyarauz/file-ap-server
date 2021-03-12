import { generateStringJoiValidatorSchema, Validator } from '../../libraries/SchemaValidator';
import { columns } from '../config/rims.config';

export const validator: Validator = generateStringJoiValidatorSchema(columns);
