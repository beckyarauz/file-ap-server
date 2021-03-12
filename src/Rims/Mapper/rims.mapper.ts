import { ObjectMapper } from '../../libraries/ObjectMapper';
import { booleanTransformer, stringToNumber, toCamel } from '../../libraries/Utilities';
import { columns as rimsColumns } from '../config/rims.config';

const rimsBooleanTransformer = (value: string, oldObject: any, newObject: any, name: string) => {
  const settings = rimsColumns.find(col => col.name === name);
  const config = settings ? settings.config : null;
  return booleanTransformer(value, config);
};

const generateMapper = () => {
  const obj: any = {};
  for (const col of rimsColumns) {
    const key = toCamel(col.name);
    switch (col.type) {
      case 'string':
        obj[col.name] = `${key}?`;
        break;
      case 'number':
        obj[col.name] = {
          key: `${key}`,
          transform: stringToNumber,
          default: 0,
        };
        break;
      case 'boolean':
        obj[col.name] = {
          key: `${key}`,
          transform: rimsBooleanTransformer,
        };
        break;
    }
  }

  return new ObjectMapper(obj);
};

export const mapper = generateMapper();
