import { Request } from 'express';
import { RequestFileParser } from '../../libraries/FileParser';
import { getRimsColumns } from '../config/rims.config';

export default class RimsFileParser extends RequestFileParser {
  constructor(request: Request) {
    super(
      request,
      'rims',
      getRimsColumns()
    );
  }

  async parse() {
    return await this.parseRequestFile();
  }
}
