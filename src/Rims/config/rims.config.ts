import { ColumnsConfig, Indexes } from '../../libraries/Global.interfaces';
import Config from '../../config/config';

const config = Config.getInstance().getConfig().rims;

export const nonUpdatableFields = config.nonUpdatableFields;
export const nonRemovableFields = config.nonRemovableFields;
export const version = config.schema_version;
export const columns: ColumnsConfig[] = config.fileColumns;
export const indexes: Indexes = {
  rim: [
    {
      index: { code: 1 },
      options: { unique: true }
    }
  ],
  rim_policy: [
    {
      index: { identifier: 1 },
    },
    {
      index: { code: 1 },
    },
    {
      index: { identifier: 1, code: 1, schema_version: 1 },
      options: { unique: true }
    },
  ],
};

