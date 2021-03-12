import Joi from 'joi';
import { RowData } from './Global.interfaces';

export interface ValidatorResult {
  error?: any;
  value: {
    [key: string]: any
  };
}

export interface Validator {
  validate: (data: RowData) => ValidatorResult;
}

export interface JoiValidator extends Validator, Joi.ObjectSchema {
  validate: (data: RowData) => ValidatorResult;
}

interface ColumnsData {
  name: string;
  pattern: RegExp;
}

export const generateJoiValidatorSchema = (columns: ColumnsData[]): JoiValidator => {
  const keys: { [key: string]: any } = {};
  for (const element of columns) {
    keys[element.name] = Joi.string().regex(element.pattern);
  }

  return Joi.object().keys(keys);
};
