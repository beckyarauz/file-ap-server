import { ColumnsConfig, Indexes } from '../../libraries/Global.interfaces';

export const nonUpdatableFields = ['code'];
export const nonRemovableFields = ['_id','schema_version', '__v','versions', 'identifier', 'code'];

export const version = '1';

export const columns: ColumnsConfig[] = [
  {
    name: 'code',
    pattern: /^[0-9]{5}$/,
    type: 'string',
    size: 5,
    order: 1,
    schemaConfig: {
      field: "code",
      options: {
        required: true
      }
    }
  },
  {
    name: 'width',
    pattern: /^\d{1,2}.\d{2}$/,
    type: 'number',
    size: 5,
    order: 2,
    schemaConfig: {
      field: "width"
    }
  },
  {
    name: 'height',
    pattern: /^[A-Z]{1}$/,
    type: 'string',
    size: 1,
    order: 3,
    schemaConfig: {
      field: "height"
    }
  },
  {
    name: 'diameter',
    pattern: /^\d{2}$/,
    type: 'number',
    size: 2,
    order: 5,
    schemaConfig: {
      field: "diameter"
    }
  },
  {
    name: 'one_piece',
    pattern: /^[xX]{1}$/,
    type: 'boolean',
    parsingConfig: {
      true: 'X',
      false: 'x'
    },
    size: 1,
    order: 4,
    schemaConfig: {
      field: "isOnePiece"
    }
  },
  {
    name: 'material',
    pattern: /^[SL]{1}$/,
    type: 'string',
    size: 1,
    order: 6,
    schemaConfig: {
      field: "material"
    }
  },
];

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

