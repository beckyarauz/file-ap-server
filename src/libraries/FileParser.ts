import { Request } from 'express';
import * as formidable from 'formidable';
import fs from 'fs';
import { logger } from '../config/logger';
import {  FileColumns, RowData } from './Global.interfaces';

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

  parseStringToObjects = () => {
    for (const element of this.dataArray) {
      let count = 1;
      let start = 0;
      const row: { [key: string]: any } = {};

      while (count <= this.columns.length) {
        const col = this.columns.find(coli => coli.order === count);
        const end = (start + col.size);
        row[col.name] = element.substring(start, end).trim();

        start += col.size;
        count++;
      }

      this.rows.push(row);
    }
  }

  parseRequestFileToArray = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      this.form.parse(this.request, (err, fields, files: formidable.Files) => {
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
      this.dataArray = await this.parseRequestFileToArray() as unknown as string[];
      logger.info('file-upload-handler', `File upload started. Lines Amount: ${this.dataArray.length}`);
      this.parseStringToObjects();
      return this.rows;
    } catch (e) {
      throw e;
    }
  }
}
