import { body, param, query } from 'express-validator';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/formatters.js';

const isValidDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const createTaskValidation = [
  body('taskName')
    .trim()
    .notEmpty()
    .withMessage('Task name is required')
    .isLength({ max: 200 })
    .withMessage('Task name must not exceed 200 characters'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  body('dueDate')
    .optional({ values: 'falsy' })
    .custom(isValidDate)
    .withMessage('Invalid due date'),
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .isInt({ min: 1 })
    .withMessage('Invalid project ID'),
];

export const updateTaskValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid task ID'),
  body('taskName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task name cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Task name must not exceed 200 characters'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  body('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  body('dueDate')
    .optional({ values: 'falsy' })
    .custom(isValidDate)
    .withMessage('Invalid due date'),
  body('projectId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Invalid project ID'),
];

export const taskIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid task ID'),
];

export const taskQueryValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  query('status')
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  query('priority')
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  query('projectId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Invalid project ID'),
];
