import express from 'express';
import { createCheckoutSession } from '../controllers/stripeController.js';
import protect from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { paymentSchema } from '../validations/schemas.js';

const router = express.Router();

router.post('/create-checkout-session', protect, validate(paymentSchema), createCheckoutSession);

export default router;
