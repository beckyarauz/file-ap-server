import { RequestFileParser } from '../libraries/FileParser';
import { columns as timesnapsColumns } from './timesnaps.config';

import { Request } from 'express';

export default class TimeSnapsFileParser extends RequestFileParser {
  constructor(request: Request) {
    super(
      request,
      'timesnaps',
      timesnapsColumns,
    );
  }

  async parse() {
    return await this.parseRequestFile();
  }
}
