import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createProjectValidation,
  updateProjectValidation,
  projectIdValidation,
  projectQueryValidation,
} from '../validations/project.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  projectQueryValidation,
  validate,
  projectController.getProjects
);

router.get(
  '/:id',
  projectIdValidation,
  validate,
  projectController.getProjectById
);

router.post(
  '/',
  createProjectValidation,
  validate,
  projectController.createProject
);

router.put(
  '/:id',
  updateProjectValidation,
  validate,
  projectController.updateProject
);

router.delete(
  '/:id',
  projectIdValidation,
  validate,
  projectController.deleteProject
);

export default router;
