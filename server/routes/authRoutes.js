import express from 'express';
import { forgotPassword, getMe, login, logout, refresh, register, resetPassword } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import { sensitiveLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validations/schemas.js';

const router = express.Router();

router.post('/register', sensitiveLimiter, validate(registerSchema), register);
router.post('/login', sensitiveLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
