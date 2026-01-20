import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

router.use('/auth', authRoutes);

// add other versioned routes here, e.g. router.use('/users', usersRoutes)

export default router;
