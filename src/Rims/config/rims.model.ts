import mongoose, { Schema } from 'mongoose';
import { GenericObject, ReferenceId } from '../../libraries/Global.types';
import { generateIndexes, schemaGenerator, schemaObjectBuilder } from '../../libraries/Utilities';

export interface IRim extends GenericObject {
}

export interface IRimModel extends IRim, Document {
  code: string;
  schema_version: string;
  versions?: ReferenceId[];
}

export interface IRimPolicy extends IRim {
  identifier: string | mongoose.Types.ObjectId;
}

export interface IRimPolicyModel extends IRimModel, IRimPolicy {
}

let rimSchemaObject: GenericObject;
let RimSchema: Schema;
let RimPolicySchema: Schema;
let RimModel: mongoose.Model<any>;
let RimPolicyModel: mongoose.Model<any>;

export const init = (config?: any) => {
  delete mongoose.connection.models.RimPolicy;
  delete mongoose.connection.models.Rim;
  rimSchemaObject = schemaObjectBuilder(config.fileColumns);
  RimSchema = schemaGenerator(
    rimSchemaObject,
    config.schema_version,
    true,
    {
      versions: {
        type: [mongoose.Types.ObjectId],
        ref: 'RimPolicy',
        default: []
      }
    });
  RimPolicySchema = schemaGenerator(
    rimSchemaObject,
    config.schema_version,
    false,
    {
      identifier: {
        type: mongoose.Types.ObjectId
      }
    });
  generateIndexes(RimSchema, [
    {
      index: { code: 1 },
      options: { unique: true }
    }
  ]);
  generateIndexes(RimPolicySchema, [
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
  ]);
  RimPolicyModel = mongoose.model<any>('RimPolicy', RimPolicySchema);
  RimModel = mongoose.model<any>('Rim', RimSchema);
};

export {
  RimSchema,
  RimPolicySchema,
  RimModel,
  RimPolicyModel
};

