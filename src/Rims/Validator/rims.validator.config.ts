import { generateJoiValidatorSchema, Validator } from '../../libraries/SchemaValidator';
import { columns } from '../config/rims.config';

export const validator: Validator = generateJoiValidatorSchema(columns);
