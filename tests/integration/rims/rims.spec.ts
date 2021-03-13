import chai, { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import 'mocha';
import mongoose from 'mongoose';
import Config, { environment_variables } from '../../../src/config/config';
import createDB from '../../../src/config/database';
import { RequestFileParser } from '../../../src/libraries/FileParser';
import { RowData } from '../../../src/libraries/Global.interfaces';
import { getRimsColumns } from '../../../src/Rims/config/rims.config';
import { RimModel, RimPolicyModel } from '../../../src/Rims/config/rims.model';
import { RimsDAL } from '../../../src/Rims/rims.DAL';
import { RimsHelper } from '../../../src/Rims/rims.Helper';
import { RimsDocumentsValidator } from '../../../src/Rims/Validator/rims.Validator';
import docs from '../../data/v1/rims.rawDocuments.all.v1';

chai.use(chaiExclude);
chai.use(deepEqualInAnyOrder);
environment_variables.tolerance = 20;

const initialize = async (version?: string) => {
  try {
    Config.init(version);
    createDB();
  } catch (e) {
    console.error(e);
  }
};

const clear = async (version?: string) => {
  await RimModel.deleteMany({});
  await RimPolicyModel.deleteMany({});
};

const reconnect = async (version?: string) => {
  return new Promise<void>((resolve, reject) => {
    mongoose.disconnect().then(() => {
      Config.init(version);
      createDB();
      resolve();
    }).catch((e) => {
      reject(e.message);
    });
  });
};

describe('[RIMS]', async () => {
  let helper: RimsHelper;
  const brokenDocsArray = [
        { code: '1', randomField: 'whatever', anotherRandom: 'blah' }
  ];

  before(() => {
    initialize();
    const testDocs = docs.concat(brokenDocsArray);
    helper = new RimsHelper(testDocs);
  });

  it('Saving Documents - should save documents', async () => {
    const test = ['00012 5.00Jx13S'];
    const rows = RequestFileParser.parseStringToObjects(test, getRimsColumns());
    const validator: RimsDocumentsValidator = new RimsDocumentsValidator(rows);
    const valids: RowData[] = validator.validate();
    const rimsHelper = new RimsHelper(valids);
    const result = await rimsHelper.handleInsertionAndUpdate();
    const rimDal = new RimsDAL();
    const docs = await rimDal.find({}).lean().exec();

    expect(docs.length).to.equal(1);
    expect(docs).excluding(['_id', '__v']).to.deep.equalInAnyOrder([{
      schema_version: 'test-1',
      code: '00012',
      width: '5',
      height: 'J',
      diameter: '13',
      onePiece: false,
      material: 'S',
      versions: [],
    }]);
  });

  it('Versions - should update document to current version and save policy', async () => {
    await reconnect('2');

    const test = ['00012 5.00Jx13Strue'];
    const rows = RequestFileParser.parseStringToObjects(test, getRimsColumns());
    const validator: RimsDocumentsValidator = new RimsDocumentsValidator(rows);
    const valids: RowData[] = validator.validate();
    const rimsHelper = new RimsHelper(valids);
    const result = await rimsHelper.handleInsertionAndUpdate();
    const rimDal = new RimsDAL();
    const docs = await rimDal.find({}).lean().exec();

    expect(docs.length).to.equal(1);
    const policy = await rimDal.findPolicy({ code: '00012', schema_version: 'test-1' }).lean().exec();

    expect(policy).excluding(['_id', '__v']).to.deep.equal(
      {
        schema_version: 'test-1',
        identifier: docs[0]._id,
        code: '00012',
        width: '5',
        height: 'J',
        diameter: '13',
        onePiece: false,
        material: 'S',
      }
        );
    expect(docs.length).to.equal(1);
    expect(docs).excluding(['_id', '__v']).to.deep.equalInAnyOrder([{
      schema_version: 'test-2',
      code: '00012',
      width: '5',
      height: 'J',
      diameter: '13',
      onePiece: false,
      material: 'S',
      randomField: true,
      versions: [policy._id],
    }]);
  });

  it('Versions - should remove unexistent fields in schema of rim document and save policy', async () => {
    await reconnect('3');

    const test = ['00012 5.00Jx13Strue'];
    const rows = RequestFileParser.parseStringToObjects(test, getRimsColumns());
    const validator: RimsDocumentsValidator = new RimsDocumentsValidator(rows);
    const valids: RowData[] = validator.validate();
    const rimsHelper = new RimsHelper(valids);
    const result = await rimsHelper.handleInsertionAndUpdate();
    const rimDal = new RimsDAL();
    const docs = await rimDal.find({}).lean().exec();

    expect(docs.length).to.equal(1);
    const policies = await rimDal.findPolicies({ code: '00012' }).lean().exec();

    expect(policies).excluding(['_id', '__v']).to.deep.equalInAnyOrder([
      {
        schema_version: 'test-1',
        identifier: docs[0]._id,
        code: '00012',
        width: '5',
        height: 'J',
        diameter: '13',
        onePiece: false,
        material: 'S',
      },
      {
        schema_version: 'test-2',
        identifier: docs[0]._id,
        code: '00012',
        width: '5',
        height: 'J',
        diameter: '13',
        onePiece: false,
        material: 'S',
        randomField: true,
      }
    ]);
    expect(docs.length).to.equal(1);
    expect(docs).excluding(['_id', '__v']).to.deep.equalInAnyOrder([{
      schema_version: 'test-3',
      code: '00012',
      width: '5',
      height: 'J',
      diameter: '13',
      onePiece: false,
      material: 'S',
      anotherField: true,
      versions: policies.map((policy: any) => policy._id),
    }]);
  });

  after(async () => {
    await clear();
    mongoose.disconnect();
  });
});
