import express from 'express';
import { suggestDescription } from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';
import { sensitiveLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { aiSuggestSchema } from '../validations/schemas.js';

const router = express.Router();

router.post('/suggest', sensitiveLimiter, protect, validate(aiSuggestSchema), suggestDescription);

export default router;
