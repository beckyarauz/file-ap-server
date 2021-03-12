import Joi from 'joi';
import _ from 'lodash';
import { ColumnsConfig } from '../libraries/Global.interfaces';

export const columns: ColumnsConfig[] = [
  {
    name: 'id',
    pattern: /^[0-9]{5}$/,
    type: 'string',
    size: 5,
    order: 1,
  },
];

const generateSchema = () => {
  const keys: { [key: string]: any } = {};
  for (const element of columns) {
    keys[element.name] = Joi.string().regex(element.pattern);
  }

  return Joi.object().keys(keys);
};

export const schema = generateSchema();
