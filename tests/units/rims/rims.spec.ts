import chai, { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import 'mocha';
import Config from '../../../src/config/config';
import { toCamel } from '../../../src/libraries/Utilities';
import RimsConfig from '../../../src/Rims/config/rims.config';
import { RimsHelper } from '../../../src/Rims/rims.Helper';
import { RimsDocumentsValidator } from '../../../src/Rims/Validator/rims.Validator';
import docs from '../../data/v1/rims.rawDocuments.all.v1';
import invalidDocs from '../../data/v1/rims.rawObject.invalid.v1';
import validDocs from '../../data/v1/rims.rawObject.valid.v1';

chai.use(chaiExclude);
chai.use(deepEqualInAnyOrder);

const initialize = async (version?: string) => {
  try {
    Config.init(version);
  } catch (e) {
    console.error(e);
  }
};

initialize();

describe('[RIMS]', async () => {
  let helper: RimsHelper;
  let rimsConfig: RimsConfig;
  const brokenDocsArray = [
    { code: '1', randomField: 'whatever', anotherRandom: 'blah' }
  ];
  const invalidDocsAllowedAmmount = Math.round((validDocs.length + invalidDocs.length) * RimsConfig.getInstance().getTolerance() / 100);

  before(() => {
    rimsConfig = RimsConfig.getInstance();
    const testDocs = docs.concat(brokenDocsArray);
    helper = new RimsHelper(testDocs);
  });

  it('RimsValidator - should throw error when invalid documents surpass tolerance', async () => {
    const invalidCopy = [...invalidDocs];
    invalidCopy.length = invalidDocsAllowedAmmount + 1;
    const validator = new RimsDocumentsValidator(validDocs.concat(invalidCopy));
    expect(validator.validate).to.throw('Document is invalid');
  });

  it('RimsValidator - should NOT throw error when documents do not surpass tolerance', async () => {
    const validator = new RimsDocumentsValidator(validDocs);
    expect(validator.validate).to.not.throw();
  });

  it('RimsValidator - should return array with valid documents', async () => {
    const documentMix = [].concat(validDocs, invalidDocs[0]);
    const validator = new RimsDocumentsValidator(documentMix);
    expect(validator.validate()).to.deep.equalInAnyOrder(validDocs);
  });

  it('RimsHelper - should map objects to db ready schema format', async () => {
    const mappedObjects = helper.formatRows();
    expect(mappedObjects).to.deep.equalInAnyOrder([
      {
        code: '0',
        width: 9,
        height: 'J',
        diameter: 0,
        onePiece: false,
        material: 'L'
      },
      {
        code: '1',
        diameter: 0,
        height: null,
        material: null,
        onePiece: false,
        width: 0,
      },
      {
        code: '00002',
        width: 6,
        height: 'J',
        diameter: 15,
        onePiece: false,
        material: 'S'
      },
      {
        code: '00003',
        width: 6.5,
        height: 'J',
        diameter: 0,
        onePiece: false,
        material: 'S'
      },
      {
        code: '00004',
        width: 7,
        height: 'J',
        diameter: 15,
        onePiece: false,
        material: 'S'
      },
      {
        code: '00005',
        width: 7,
        height: 'J',
        diameter: 15,
        onePiece: false,
        material: 'L'
      },
      {
        code: '00006',
        width: 8,
        height: 'J',
        diameter: 17,
        onePiece: false,
        material: 'L'
      },
      {
        code: '00009',
        width: 4.5,
        height: 'J',
        diameter: 13,
        onePiece: false,
        material: ''
      },
      {
        code: '00010',
        width: 5,
        height: 'J',
        diameter: 13,
        onePiece: false,
        material: 'S'
      }]);
  });

  it('RimsHelper - should get rims document properties', async () => {
    const helper = new RimsHelper(docs);
    const properties = rimsConfig.getRimsColumns().map(col => toCamel(col.name));
    expect(properties).to.deep.equalInAnyOrder(['code', 'width', 'height', 'diameter', 'onePiece', 'material']);
  });

  it('RimsHelper - should get updatableRimProperties', async () => {
    const helper = new RimsHelper(docs);
    const properties = rimsConfig.getRimsColumns().map(col => toCamel(col.name));
    expect(properties).to.deep.equalInAnyOrder(['code', 'width', 'height', 'diameter', 'onePiece', 'material']);
  });

  after(async () => {
  });
});
