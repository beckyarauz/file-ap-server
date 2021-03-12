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
  type?: string;
}

export const generateTypeJoiValidatorSchema = (columns: ColumnsData[]): JoiValidator => {
  const keys: { [key: string]: any } = {};
  for (const element of columns) {
    switch (element.type) {
      case 'string':
        keys[element.name] = Joi.string().regex(element.pattern);
        break;
      case 'number':
        keys[element.name] = Joi.number();
        break;
      case 'boolean':
        keys[element.name] = Joi.number();
        break;
      default:
        throw new Error(`Type not supported. Type: ${element.type}`);
        break;
    }
  }
  return Joi.object().keys(keys);
};

export const generateStringJoiValidatorSchema = (columns: ColumnsData[]): JoiValidator => {
  const keys: { [key: string]: any } = {};
  for (const element of columns) {
    keys[element.name] = Joi.string().regex(element.pattern);
  }

  return Joi.object().keys(keys);
};
