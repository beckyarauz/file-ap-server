import chai, { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import chaiHttp from 'chai-http';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import 'mocha';
import mongoose from 'mongoose';
import request from 'supertest';
import { app, createApi } from '../../../src/api/app';
import Config from '../../../src/config/config';
import createDB from '../../../src/config/database';
import RimsConfig from '../../../src/Rims/config/rims.config';
import { RimModel, RimPolicyModel } from '../../../src/Rims/config/rims.model';
import { RimsDAL } from '../../../src/Rims/rims.DAL';
import { RimsHelper } from '../../../src/Rims/rims.Helper';
import docs from '../../data/v1/rims.rawDocuments.all.v1';

chai.use(chaiExclude);
chai.use(deepEqualInAnyOrder);
chai.use(chaiHttp);

let helper: RimsHelper;
let rims: RimsConfig;

const initialize = async (version?: string) => {
  try {
    Config.init(version);
    rims = RimsConfig.getInstance();
    createDB();
    createApi();
  } catch (e) {
    console.error(e);
  }
};

const clear = async (_version?: string) => {
  await RimModel.deleteMany({});
  await RimPolicyModel.deleteMany({});
};

const reconnect = async (version?: string) => {
  return new Promise<void>((resolve, reject) => {
    mongoose.disconnect().then(() => {
      Config.init(version);
      rims = RimsConfig.getInstance();
      createDB();
      resolve();
    }).catch((e) => {
      reject(e.message);
    });
  });
};

describe('[RIMS]', async () => {
  const brokenDocsArray = [
    { code: '1', randomField: 'whatever', anotherRandom: 'blah' }
  ];

  before(async () => {
    initialize();
    await clear();
    const testDocs = docs.concat(brokenDocsArray);
    helper = new RimsHelper(testDocs);
  });

  it('Saving Documents - should save documents', async () => {
    const buffer = Buffer.from('00012 5.00Jx13S', 'utf8');
    await request(app)
      .post('/api/rims/upload')
      .attach('file', buffer, 'rims.txt')
      .expect(200, {
        message: 'success',
        result: {
          file_total: 1,
          invalid: 0,
          saved: 1,
          updated: 0,
          valid: 1,
        }
      });
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

    const buffer = Buffer.from('00012 5.00Jx13Strue', 'utf8');
    await request(app)
      .post('/api/rims/upload')
      .attach('file', buffer, 'rims.txt')
      .expect(200, {
        message: 'success',
        result: {
          file_total: 1,
          invalid: 0,
          saved: 0,
          updated: 1,
          valid: 1,
        }
      });
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

    const buffer = Buffer.from('00012 5.00Jx13Strue', 'utf8');
    await request(app)
      .post('/api/rims/upload')
      .attach('file', buffer, 'rims.txt')
      .expect(200, {
        message: 'success',
        result: {
          file_total: 1,
          invalid: 0,
          saved: 0,
          updated: 1,
          valid: 1,
        }
      });

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

  it('Should update document if update is from same version', async () => {
    const buffer = Buffer.from('00012 5.00Jx13Sfalse\n00013 5.00Jx13Sfalse\n00014 5.00Jx13Sfalse\n00015 5.00Jt13Sfalse', 'utf8');
    await request(app)
      .post('/api/rims/upload')
      .attach('file', buffer, 'rims.txt')
      .expect(200, {
        message: 'success',
        result: {
          file_total: 4,
          invalid: 1,
          saved: 2,
          updated: 1,
          valid: 3,
        }
      });

    const rimDal = new RimsDAL();
    const docs = await rimDal.find({}).lean().exec();

    expect(docs.length).to.equal(3);
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

    expect(docs).excluding(['_id', '__v']).to.deep.equalInAnyOrder([
      {
        schema_version: 'test-3',
        code: '00012',
        width: '5',
        height: 'J',
        diameter: '13',
        onePiece: false,
        material: 'S',
        anotherField: false,
        versions: policies.map((policy: any) => policy._id),
      },
      {
        anotherField: false,
        code: '00013',
        diameter: '13',
        height: 'J',
        material: 'S',
        onePiece: false,
        schema_version: 'test-3',
        versions: [],
        width: '5',
      },
      {
        anotherField: false,
        code: '00014',
        diameter: '13',
        height: 'J',
        material: 'S',
        onePiece: false,
        schema_version: 'test-3',
        versions: [],
        width: '5',
      }
    ]);
  });

  afterEach(() => {
  });

  after(async () => {
    await clear();
    mongoose.disconnect();
  });
});
