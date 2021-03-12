import { IRimModel, IRimPolicyModel, RimModel, RimPolicyModel } from './config/rims.model';

export class RimsDAL {
  constructor(
  ) {
  }

  saveRim = (doc: IRimModel) => {
    return new RimModel(doc).save();
  }

  saveRimPolicy = (doc: IRimPolicyModel) => {
    return new RimPolicyModel(doc).save();
  }

  findPolicies = (query: { [key: string]: any }) => {
    return RimPolicyModel.find(query);
  }

  findPolicy = (query: { [key: string]: any }) => {
    return RimPolicyModel.findOne(query);
  }

  find = (query: { [key: string]: any }) => {
    return RimModel.find(query);
  }

  findOne = (query: { [key: string]: any }) => {
    return RimModel.findOne(query);
  }

  count = (query: { [key: string]: any }) => {
    return RimModel.count(query);
  }

  updateOne = (query: { [key: string]: any }, update: { [key: string]: any }, options?: { [key: string]: any }) => {
    return RimModel.updateOne(query, update, options);
  }

  updateOneById = (id: string, update: { [key: string]: any }, options?: { [key: string]: any }) => {
    return RimModel.findByIdAndUpdate(id, update, options);
  }
}
