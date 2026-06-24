import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  taskQueryValidation,
} from '../validations/task.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  taskQueryValidation,
  validate,
  taskController.getTasks
);

router.get(
  '/:id',
  taskIdValidation,
  validate,
  taskController.getTaskById
);

router.post(
  '/',
  createTaskValidation,
  validate,
  taskController.createTask
);

router.put(
  '/:id',
  updateTaskValidation,
  validate,
  taskController.updateTask
);

router.patch(
  '/:id/complete',
  taskIdValidation,
  validate,
  taskController.markTaskCompleted
);

router.delete(
  '/:id',
  taskIdValidation,
  validate,
  taskController.deleteTask
);

export default router;
