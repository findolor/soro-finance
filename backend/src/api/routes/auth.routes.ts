import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { type RequestHandler } from 'express';

const router = Router();

// Public routes
router.post('/login', login as RequestHandler);

// Protected routes
router.post('/logout', authenticateJWT as RequestHandler, logout as RequestHandler);

export default router; 