import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

/**
 * POST /api/auth/register
 * body: { email, password, name? }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', login);

export default router;
