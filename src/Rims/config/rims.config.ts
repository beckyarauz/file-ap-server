import { ColumnsConfig, Indexes } from '../../libraries/Global.interfaces';
import { init as modelInit } from './rims.model';

let configuration: any;
let nonUpdatableFields: string[];
let nonRemovableFields: string[];
let version: string;
let columns: ColumnsConfig[];
let indexes: Indexes;
let getRimsConfig: () => any;
let getRimsColumns: () => ColumnsConfig[];
let getRimsIndexes: () => Indexes;
let getRimsVersion: () => string;
let getnonRemovableFields: () => string[];

export const init = (config: any) => {
  configuration = config;
  version = config.schema_version;
  nonUpdatableFields = config.nonUpdatableFields;
  nonRemovableFields = config.nonRemovableFields;
  columns = config.fileColumns;
  indexes = config.indexes;
  getRimsConfig = () => {
    return configuration;
  };
  getRimsColumns = () => {
    return columns;
  };
  getRimsIndexes = () => {
    return indexes;
  };
  getRimsVersion = () => {
    return version;
  };
  getnonRemovableFields = () => {
    return nonRemovableFields;
  };

  modelInit(config);
};

export {
  configuration,
  nonRemovableFields,
  nonUpdatableFields,
  version,
  columns,
  indexes,
  getRimsConfig,
  getRimsColumns,
  getRimsIndexes,
  getRimsVersion,
  getnonRemovableFields,
};
