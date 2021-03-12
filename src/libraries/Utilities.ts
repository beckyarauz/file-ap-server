import { Schema } from 'mongoose';
import _ from 'lodash';
import { ColumnsConfig, Index } from './Global.interfaces';
import { GenericObject } from './Global.types';

export const stringToNumber = (value: string): number => {
  if (typeof value !== 'string' || !value.length) return 0;
  const parsed = parseFloat(value);

  return !isNaN(parsed) ? parsed : 0;
};

export const booleanTransformer = (value: string, config?: { false: string; true: string; }): boolean => {
  if (config) {
    return value === config.true;
  }
  return value === 'true';
};

export const toCamel = (s: string): string => {
  return s.replace(/([-_][a-z])/ig, (res) => {
    return res.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

export const schemaObjectBuilder = (columns: ColumnsConfig[]) => {
  const schemaObject: GenericObject = {};
  for (const col of columns) {
    const key = toCamel(col.name);
    switch (col.type) {
      case 'string':
        schemaObject[key] = {
          type: String
        };
        break;
      case 'number':
        schemaObject[key] = {
          type: String
        };
        break;
      case 'boolean':
        schemaObject[key] = {
          type: Boolean
        };
        break;
    }

    if (col.schemaConfig) {
      schemaObject[key] = {
        ...schemaObject[key],
        ...col.schemaConfig.options
      };
    }
  }

  return schemaObject;
};

export const schemaGenerator = (base: GenericObject, version: string, newProperties?: GenericObject): Schema => {
  const schema = new Schema(base);
  schema.add({
    schema_version: {
      type: String,
      default: version
    }
  });

  if (newProperties) {
    schema.add(newProperties);
  }

  return schema;
};

export const generateIndexes = (Schema: Schema, indexesList: Index[]) => {
  for (const indx of indexesList) {
    Schema.index(indx.index, indx.options);
  }
};
