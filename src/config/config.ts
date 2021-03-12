import * as prodConfigFile from '../../prod.config.json';
import * as testConfigFile from '../../test.config.json';
import { booleanTransformer } from '../libraries/Utilities';

const dotenv = require('dotenv');
const res = dotenv.config();

interface Environment {
  env: string;
  mongo_uri: string;
  silent_logger: boolean;
  tolerance: number;
}

export const environment_variables: Environment = {
  env: process.env.NODE_ENV,
  silent_logger: booleanTransformer(process.env.LOGGER_SILENCE),
  tolerance: parseFloat(process.env.DOCUMENT_TOLERANCE),
  mongo_uri: process.env.NODE_ENV === 'prod' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL
};
class Config {
  private static instance: any;
  private config: any;
  private constructor(file: any) {
    // TODO: add config schema validation
    this.convertPatternsToRegex(file);
    this.config = file;
  }

  private convertPatternsToRegex(file: any) {
    for (const key of Object.keys(file.default)) {
      file.default[key].fileColumns = file.default[key].fileColumns.map((el: any) => {
        el.pattern = new RegExp(el.pattern);
        return el;
      });
    }
  }

  static init(): void {
    console.log('init', environment_variables.env);
    // const testing = require('../../prod.config.json');
    // console.log('TESTSS', testing);
    if (!this.instance) {
      switch (environment_variables.env) {
        case 'prod':
          this.instance = new this(prodConfigFile);
          break;
        case 'test':
          this.instance = new this(testConfigFile);
          break;
        default:
          this.instance = new this(testConfigFile);
          break;
      }
    }
  }

  static getInstance(): Config {
    if (!this.instance) {
      this.init();
    }
    return this.instance;
  }

  getConfig = () => {
    return this.config.default;
  }
}

export default Config;
