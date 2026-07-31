import express from 'express';
import { addComment, createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { taskSchema, updateTaskSchema } from '../validations/schemas.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', validate(taskSchema), createTask);
router.post('/:id/comments', addComment);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
