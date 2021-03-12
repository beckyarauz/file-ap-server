import { GenericObject } from './Global.types';

export interface ColumnsConfig extends FileColumns {
  schemaConfig?: any;
  parsingConfig?: any;
  validatorConfig?: any;
}

export interface RowData { [key: string]: boolean | number | string; }

export interface BooleanConfig {
  true: string;
  false: string;
}

export interface FileColumns {
  name: string;
  pattern: RegExp;
  size: number;
  order: number;
  type: string;
  config?: BooleanConfig;
}

export interface Index {
  index: GenericObject;
  options?: GenericObject;
}

export interface Indexes {
  [schemaName: string]: Index[];
}
