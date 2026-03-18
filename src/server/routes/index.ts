import { Router } from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);

export default apiRouter;