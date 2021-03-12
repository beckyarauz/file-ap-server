import express from 'express';
import rimsRoutes from '../Rims/rims.api';

const appRouter = express.Router();

appRouter.use('/rims', rimsRoutes);
// appRouter.use('/timesnaps', timeSnapsRoutes);

export default appRouter;
