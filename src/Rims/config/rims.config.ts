import { ColumnsConfig, Indexes } from '../../libraries/Global.interfaces';
import { init as modelInit } from './rims.model';

export default class RimsConfig {
  private nonUpdatableFields: string[];
  private nonRemovableFields: string[];
  private version: string;
  private columns: ColumnsConfig[];
  private indexes: Indexes;
  private configuration: any;
  static instance: any;

  private constructor(config: any) {
    this.configuration = Object.freeze(config);
    this.version = config.schema_version;
    this.nonUpdatableFields = config.nonUpdatableFields;
    this.nonRemovableFields = config.nonRemovableFields;
    this.columns = config.fileColumns;
    this.indexes = config.indexes;
  }

  static init(mainConfigFile?: any): void {
    this.instance = new this(mainConfigFile);
    modelInit(RimsConfig.getInstance().getRimsConfig());
  }

  static getInstance(): RimsConfig {
    if (!this.instance) {
      throw new Error('Instance has not been initialized');
    }
    return this.instance;
  }

  getRimsConfig = (): any => {
    return this.configuration;
  }
  getRimsColumns = (): ColumnsConfig[] => {
    return this.columns;
  }
  getRimsIndexes = (): Indexes => {
    return this.indexes;
  }
  getRimsVersion = (): string => {
    return this.version;
  }
  getnonRemovableFields = (): string[] => {
    return this.nonRemovableFields;
  }
  getnonUpdatableFields = (): string[] => {
    return this.nonUpdatableFields;
  }
}

// let configuration: any;
// let nonUpdatableFields: string[];
// let nonRemovableFields: string[];
// let version: string;
// let columns: ColumnsConfig[];
// let indexes: Indexes;
// let getRimsConfig: () => any;
// let getRimsColumns: () => ColumnsConfig[];
// let getRimsIndexes: () => Indexes;
// let getRimsVersion: () => string;
// let getnonRemovableFields: () => string[];
// let getnonUpdatableFields: () => string[];

// export const init = (config: any) => {
//   configuration = config;
//   version = config.schema_version;
//   nonUpdatableFields = config.nonUpdatableFields;
//   nonRemovableFields = config.nonRemovableFields;
//   columns = config.fileColumns;
//   indexes = config.indexes;
//   getRimsConfig = () => {
//     return configuration;
//   };
//   getRimsColumns = () => {
//     return columns;
//   };
//   getRimsIndexes = () => {
//     return indexes;
//   };
//   getRimsVersion = () => {
//     return version;
//   };
//   getnonRemovableFields = () => {
//     return nonRemovableFields;
//   };
//   getnonUpdatableFields = () => {
//     return nonUpdatableFields;
//   };

//   modelInit(config);
// };

// export {
//   configuration,
//   nonRemovableFields,
//   nonUpdatableFields,
//   version,
//   columns,
//   indexes,
//   getRimsConfig,
//   getRimsColumns,
//   getRimsIndexes,
//   getRimsVersion,
//   getnonRemovableFields,
//   getnonUpdatableFields
// };
