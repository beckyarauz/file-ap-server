import mongoose, { Schema, Document } from 'mongoose';
import { GenericObject, ReferenceId } from '../../libraries/Global.types';
import { generateIndexes, schemaGenerator, schemaObjectBuilder } from '../../libraries/Utilities';
import { columns, indexes, version } from './rims.config';

export interface IRim {
  code: string;
  width: number;
  height: string;
  diameter: number;
  material: string;
  onePiece: boolean;
}

export interface IRimModel extends Document, IRim {
  schema_version: string;
  versions?: ReferenceId[];
}

export interface IRimPolicy extends IRim {
  identifier: string | mongoose.Types.ObjectId;
}

export interface IRimPolicyModel extends IRimModel, IRimPolicy {
}

const rimSchemaObject: GenericObject = schemaObjectBuilder(columns);

export const RimSchema: Schema = schemaGenerator(
  rimSchemaObject,
  version,
  {
    versions: {
      type: [mongoose.Types.ObjectId],
      ref: 'RimPolicy',
      default: []
    }
  });

// TODO: define Policy class
export const RimPolicySchema: Schema = schemaGenerator(
  rimSchemaObject,
  version,
  {
    identifier: {
      type: mongoose.Types.ObjectId
    }
  });

generateIndexes(RimSchema, indexes.rim);
generateIndexes(RimPolicySchema, indexes.rim_policy);

export const RimModel = mongoose.model<IRimModel>('Rim', RimSchema);
export const RimPolicyModel = mongoose.model<IRimPolicyModel>('RimPolicy', RimPolicySchema);

