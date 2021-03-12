import { Request } from 'express';
import TimeSnapsFileParser from './timesnaps.FileParser';

export default class TimeSnapsController {
  static async handleFileUpload(req: Request) {
    const parser = new TimeSnapsFileParser(req);
    const rows = await parser.parse();
    return;
  }
}
