import { ObjectMapper } from '../../libraries/ObjectMapper';
import { booleanTransformer, stringToNumber, toCamel } from '../../libraries/Utilities';
import { getRimsColumns } from '../config/rims.config';

const rimsBooleanTransformer = (value: string, oldObject: any, newObject: any, name: string) => {
  const settings = getRimsColumns().find(col => col.name === name);
  const config = settings ? settings.parsingConfig : null;
  return booleanTransformer(value, config);
};

export const generateMapper = () => {
  const obj: any = {};
  for (const col of getRimsColumns()) {
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
