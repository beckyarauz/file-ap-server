import { RequestFileParser } from '../../libraries/FileParser';
import { columns as rimsColumns } from '../config/rims.config';

import { Request } from 'express';

export default class RimsFileParser extends RequestFileParser {
  constructor(request: Request) {
    super(
      request,
      'rims',
      rimsColumns
    );
  }

  async parse() {
    return await this.parseRequestFile();
  }
}
