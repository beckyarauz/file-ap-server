import express, { Request, Response } from 'express';
import TimeSnapsController from './timesnaps.controller';

const rimsRoutes = express.Router();

rimsRoutes.post('/upload', async (req: Request, res: Response) => {
  await TimeSnapsController.handleFileUpload(req);
  res.json({
    message: 'success'
  });
});

export default rimsRoutes;
