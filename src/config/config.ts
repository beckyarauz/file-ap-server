import * as prodConfigFile from '../../prod.config.json';
import * as testConfigFile from '../../test.config.json';

const dotenv = require('dotenv');
const res = dotenv.config();
class Config {
  private static instance: any;
  private config: any;
  private constructor(file: any) {
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
    if (!this.instance) {
      switch (process.env.NODE_ENV) {
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
