import _ from 'lodash';
import { LeanDocument } from 'mongoose';
import { logger } from '../config/logger';
import { RowData } from '../libraries/Global.interfaces';
import { ReferenceId } from '../libraries/Global.types';
import { ObjectMapper } from '../libraries/ObjectMapper';
import { toCamel } from '../libraries/Utilities';
import { getRimsColumns, getRimsVersion, nonRemovableFields, nonUpdatableFields } from './config/rims.config';
import { IRim, IRimModel, IRimPolicyModel, RimModel } from './config/rims.model';
import { generateMapper } from './Mapper/rims.mapper';
import { RimsDAL } from './rims.DAL';

export class RimsHelper {
  rawDocuments: RowData[];
  private documents: IRim[];
  private mapper: ObjectMapper = generateMapper();
  private rimsDAL: RimsDAL;

  constructor(documents: RowData[]) {
    this.rawDocuments = documents;
    this.documents = this.formatRows();
    this.rimsDAL = new RimsDAL();
  }

  static getProperties = () => {
    return getRimsColumns().map(col => toCamel(col.name));
  }

  getUpdatableRimProperties = () => {
    const props = RimsHelper.getProperties();

    return props.filter(prop => !nonUpdatableFields.includes(prop));
  }

  hasCurrentVersion = (doc: IRimModel | LeanDocument<IRimModel>): boolean => {
    return doc.schema_version === getRimsVersion();
  }

  formatRows = (): IRim[] => {
    return this.rawDocuments.map((el: RowData) => this.mapper.process(el) as unknown as IRim);
  }

  getObjectWithUpdatableFields = (doc: IRimModel) => {
    const document = _.pick(doc, ...RimsHelper.getProperties());
    delete document.code;
    return document;
  }

  storePolicyVersion = async (doc: IRimModel): Promise<IRimPolicyModel> => {
    const identifier: string = doc._id.toString();
    const schema_version: string = doc.schema_version;
    const code: string = doc.code;
    const fields = Object.keys(doc).filter(key => !['_id', '__v', 'versions'].includes(key));
    const docObject = _.pick(doc, ...fields);
    const policyObject = _.assign(
      docObject,
      {
        code,
        identifier,
        schema_version
      }
    ) as IRimPolicyModel;
    return await this.rimsDAL.saveRimPolicy(policyObject);
  }

  getNonRemovableFields = () => {
    return nonRemovableFields;
  }

  buildVersionsList = (docVersions: ReferenceId[], oldVersionId: string): ReferenceId[] => {
    const versions = new Set();
    if (Array.isArray(docVersions) && docVersions.length) {
      docVersions.forEach((item: ReferenceId) => versions.add(item));
    }
    versions.add(oldVersionId);

    return Array.from(versions) as ReferenceId[];
  }

  updateDocumentAsCurrentVersion = async (doc: IRimModel, oldVersionId: ReferenceId) => {
    const newDoc = this.documents.find(newDoc => newDoc.code === doc.code);
    const originalDoc: IRimModel = _.assign({}, doc);

    // build document with original properties and replace with new ones
    const updateDoc: IRimModel = _.pick(_.assign(originalDoc, newDoc), ...RimsHelper.getProperties()) as IRimModel;

    // add reference to policies
    updateDoc.versions = this.buildVersionsList(doc.versions, oldVersionId);

    // update to current version
    updateDoc.schema_version = getRimsVersion();

    // handle non overwritable fields
    updateDoc.code = doc.code;

    return await RimModel.replaceOne({ code: doc.code }, updateDoc);
  }

  updateDocumentData = async (doc: { code: string; id: ReferenceId; }) => {
    const newDoc = this.documents.find(newDoc => newDoc.code === doc.code);
    const updateDoc = _.pick(newDoc, ...this.getUpdatableRimProperties()); // avoid "updating" code and schema_version field

    return await this.rimsDAL.updateOneById(
      doc.id,
      {
        $set: {
          ...updateDoc
        }
      });
  }

  handleDocumentUpdate = async (dbDoc: IRimModel) => {
    try {
      if (!this.hasCurrentVersion(dbDoc)) {
        const oldVersion = await this.storePolicyVersion(dbDoc);
        // update to new version
        return await this.updateDocumentAsCurrentVersion(dbDoc, oldVersion._id.toString());
      }
      return await this.updateDocumentData({ code: dbDoc.code, id: dbDoc._id });
    } catch (e) {
      console.error(e);
      logger.error('rims-update-document-error', e);
    }
  }

  handleInsertionAndUpdate = async (): Promise<any[]> => {
    try {
      const codesArray = this.documents.map(doc => doc.code);
      const successDocs: any[] = [];
      for (const code of codesArray) {
        const dbDoc = (await this.rimsDAL.findOne({ code }).lean().exec()) as IRimModel;
        if (dbDoc) {
          const updatedDoc = await this.handleDocumentUpdate(dbDoc);
          successDocs.push(updatedDoc);
        } else {
          try {
            const doc = this.documents.find(doc => doc.code === code) as IRimModel;
            const savedDoc = await this.rimsDAL.saveRim(doc);
            successDocs.push(savedDoc);
          } catch (e) {
            logger.error('rims-save-rim-error', e);
          }
        }
      }
      return successDocs;
    } catch (e) {
      console.error(e);
      logger.error('rims-insert-and-update-error', e);
    }
  }
}

