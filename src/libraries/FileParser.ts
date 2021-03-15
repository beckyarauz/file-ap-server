import { Request } from 'express';
import * as formidable from 'formidable';
import fs from 'fs';
import logger from '../config/logger';
import { FileColumns, RowData } from './Global.interfaces';

export class RequestFileParser {
  private form: formidable.IncomingForm;
  private request: Request;
  private dataArray: string[];
  private rows: RowData[] = [];

  type: string;
  columns: FileColumns[];

  constructor(
    request: Request,
    type: string,
    columns: FileColumns[],
  ) {
    this.request = request;
    this.type = type;
    this.columns = columns;
    this.form = new formidable.IncomingForm();
  }

  static parseStringToObjects = (dataArray: string[], columns: FileColumns[]) => {
    const rows = [];
    for (const element of dataArray) {
      let count = 1;
      let start = 0;
      const row: { [key: string]: any } = {};

      while (count <= columns.length) {
        const col = columns.find((coli) => coli.order === count);
        const end = (start + col.size);
        row[col.name] = element.substring(start, end).trim();

        start += col.size;
        count++;
      }

      rows.push(row);
    }

    return rows;
  }

  static parseRequestFileToArray = (request: Request, form: formidable.IncomingForm): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      form.parse(request, (err, fields, files: formidable.Files) => {
        if (!Array.isArray(files.file)) {
          fs.readFile(files.file.path, 'utf8', (error, data: string) => {
            if (error) {
              reject(error.message);
            }
            const result: string[] = data.split(/\r?\n/);
            resolve(result);
          });
        } else {
          reject('Invalid Format');
        }
      });
    });
  }

  parseRequestFile = async (): Promise<RowData[]> => {
    try {
      this.dataArray = await RequestFileParser.parseRequestFileToArray(this.request, this.form) as unknown as string[];
      logger.info('file-upload-handler-count', `File lines size: ${this.dataArray.length}`);
      this.rows = RequestFileParser.parseStringToObjects(this.dataArray, this.columns);
      return this.rows;
    } catch (e) {
      logger.error('file-parser-error', e);
      throw e;
    }
  }
}
