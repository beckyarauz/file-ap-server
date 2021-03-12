import chaiExclude from 'chai-exclude';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import Config, { environment_variables } from '../../src/config/config';
import createDB from '../../src/config/database';

export const init = (chaiLibrary: Chai.ChaiStatic) => {
  chaiLibrary.use(chaiExclude);
  chaiLibrary.use(deepEqualInAnyOrder);
  environment_variables.tolerance = 20;
  Config.init();
  createDB();
};
