import { booleanTransformer } from '../libraries/Utilities';
import RimsConfig from '../Rims/config/rims.config';

const dotenv = require('dotenv');
const res = dotenv.config();

interface Environment {
  env: string;
  mongo_uri: string;
  silent_logger: boolean;
}

export const environment_variables: Environment = {
  env: process.env.NODE_ENV,
  silent_logger: booleanTransformer(process.env.LOGGER_SILENCE),
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
    for (const key of Object.keys(file)) {
      file[key].fileColumns = file[key].fileColumns.map((el: any) => {
        el.pattern = new RegExp(el.pattern);
        return el;
      });
    }
  }

  static init(version?: string): void {
    let path;
    if (version) {
      path = `./files/${environment_variables.env}.v${version}.config.json`;
    } else {
      path = `./files/${environment_variables.env}.config.json`;
    }

    const configFile = require(path);
    this.instance = new this(configFile);
    RimsConfig.init(Config.getInstance().getConfig().rims);
  }

  static getInstance(): Config {
    if (!this.instance) {
      this.init();
    }
    return this.instance;
  }

  getConfig = () => {
    return this.config;
  }
}

export default Config;
