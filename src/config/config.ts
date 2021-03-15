import { booleanTransformer } from '../libraries/Utilities';
import RimsConfig from '../Rims/config/rims.config';

const dotenv = require('dotenv');
const res = dotenv.config();

interface Environment {
  env: string;
  mongo_uri: string;
  silent_logger: boolean;
  log_all: boolean;
}

// export const environment_variables: Environment = {
//   env: process.env.NODE_ENV,
//   silent_logger: booleanTransformer(process.env.LOGGER_SILENCE),
//   mongo_uri: process.env.NODE_ENV === 'prod' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL,
//   log_all: booleanTransformer(process.env.LOG_ALL)
// };
class Config {
  private static instance: any;
  private config: any;
  static environment_variables: Environment = {
    env: process.env.NODE_ENV,
    silent_logger: booleanTransformer(process.env.LOGGER_SILENCE),
    mongo_uri: process.env.NODE_ENV === 'prod' ? process.env.MONGO_URI : process.env.MONGO_URI_LOCAL,
    log_all: booleanTransformer(process.env.LOG_ALL)
  };
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

  static init(configFile: any, version?: string): void {
    let file = configFile;
    if (version) {
      const path = `./files/${Config.environment_variables.env}.v${version}.config.json`;
      file = require(path);
    }
    this.instance = new this(file);
    RimsConfig.init(Config.getInstance().getConfig().rims);
  }

  static getInstance(): Config {
    if (!this.instance) {
      throw new Error('Config has not been initialized. Use Config.init first');
    }
    return this.instance;
  }

  getConfig = () => {
    return this.config;
  }
}

export default Config;
