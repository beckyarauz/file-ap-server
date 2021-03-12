import _ from 'lodash';
import { LeanDocument } from 'mongoose';
import { logger } from '../config/logger';
import { RowData } from '../libraries/Global.interfaces';
import { ReferenceId } from '../libraries/Global.types';
import { ObjectMapper } from '../libraries/ObjectMapper';
import { toCamel } from '../libraries/Utilities';
import { columns, nonRemovableFields, nonUpdatableFields, version } from './config/rims.config';
import { IRim, IRimModel, IRimPolicyModel, RimModel } from './config/rims.model';
import { mapper as rimsMapper } from './Mapper/rims.mapper';
import { RimsDAL } from './rims.DAL';

export class RimsHelper {
  private rawDocuments: RowData[];
  private documents: IRim[];
  private mapper: ObjectMapper = rimsMapper;
  private rimsDAL = new RimsDAL();

  constructor(documents: RowData[]) {
    this.rawDocuments = documents;
    this.documents = this.formatRows();
  }

  getProperties = () => {
    return columns.map(col => toCamel(col.name));
  }

  getUpdatableRimProperties = () => {
    const props = this.getProperties();

    return props.filter(prop => !nonUpdatableFields.includes(prop));
  }

  hasCurrentVersion = (doc: IRimModel | LeanDocument<IRimModel>): boolean => {
    return doc.schema_version === version;
  }

  formatRows = (): IRim[] => {
    return this.rawDocuments.map((el: RowData) => this.mapper.process(el) as unknown as IRim);
  }

  getObjectWithUpdatableFields = (doc: IRimModel) => {
    const document = _.pick(doc, ...this.getProperties());
    delete document.code;
    return document;
  }

  storePolicyVersion = async (doc: IRimModel): Promise<IRimPolicyModel> => {
    const identifier: string = doc._id.toString();
    const schema_version: string = doc.schema_version;
    const docObject = _.pick(doc, ...this.getProperties());

    // TOD: ensure indexes of identifier + schema_version are unique
    const policyObject = _.assign(
      {
        identifier,
        schema_version
      },
      docObject
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
    const updateDoc: IRimModel = _.pick(_.assign(originalDoc, newDoc), ...this.getProperties()) as IRimModel;

    // add reference to policies
    updateDoc.versions = this.buildVersionsList(doc.versions, oldVersionId);

    // update to current version
    updateDoc.schema_version = version;

    // handle non overwritable fields
    updateDoc.code = doc.code;

    await RimModel.replaceOne({ code: doc.code }, updateDoc);
  }

  updateDocumentData = async (doc: { code: string; id: ReferenceId; }) => {
    const newDoc = this.documents.find(newDoc => newDoc.code === doc.code);
    const updateDoc = _.pick(newDoc, ...this.getUpdatableRimProperties()); // avoid "updating" code and schema_version field

    await this.rimsDAL.updateOneById(
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
        await this.updateDocumentAsCurrentVersion(dbDoc, oldVersion._id.toString());
      } else {
        await this.updateDocumentData({ code: dbDoc.code, id: dbDoc._id });
      }
    } catch (e) {
      console.error(e);
      logger.error('rims-update-document-error', e);
    }
  }

  handleInsertionAndUpdate = async (): Promise<void> => {
    try {
      const codesArray = this.documents.map(doc => doc.code);
      for (const code of codesArray) {
        const dbDoc = (await this.rimsDAL.findOne({ code }).lean().exec()) as IRimModel;
        if (dbDoc) {
          await this.handleDocumentUpdate(dbDoc);
        } else {
          try {
            const doc = this.documents.find(doc => doc.code === code) as IRimModel;
            // doc.schema_version = version;
            await this.rimsDAL.saveRim(doc);
          } catch (e) {
            logger.error('rims-save-rim-error', e);
          }
        }
      }
      return;
    } catch (e) {
      console.error(e);
      logger.error('rims-insert-and-update-error', e);
    }
  }
}

