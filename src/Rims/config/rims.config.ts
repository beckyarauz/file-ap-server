import { ColumnsConfig, Indexes } from '../../libraries/Global.interfaces';
import { init as modelInit } from './rims.model';

export default class RimsConfig {
  private nonUpdatableFields: string[];
  private nonRemovableFields: string[];
  private version: string;
  private columns: ColumnsConfig[];
  private indexes: Indexes;
  private configuration: any;
  private tolerance: number;
  static instance: any;

  private constructor(config: any) {
    // TODO: validate CONFIG FILE SCHEMA
    this.configuration = Object.freeze(config);
    this.version = config.schema_version;
    this.nonUpdatableFields = config.nonUpdatableFields;
    this.nonRemovableFields = config.nonRemovableFields;
    this.columns = config.fileColumns;
    this.indexes = config.indexes;
    this.tolerance = config.tolerance;
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
  getTolerance = (): number => {
    return this.tolerance;
  }
}
