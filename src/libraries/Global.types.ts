import { ObjectId } from 'mongoose';

export type ReferenceId = string & ObjectId;

export type GenericObject = object & { [key: string]: any };
