import { body, param, query } from 'express-validator';
import { PROJECT_STATUSES } from '../utils/formatters.js';

const isValidDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const createProjectValidation = [
  body('projectName')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 200 })
    .withMessage('Project name must not exceed 200 characters'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(PROJECT_STATUSES)
    .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),
  body('startDate')
    .optional({ values: 'falsy' })
    .custom(isValidDate)
    .withMessage('Invalid start date'),
  body('endDate')
    .optional({ values: 'falsy' })
    .custom(isValidDate)
    .withMessage('Invalid end date'),
];

export const updateProjectValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid project ID'),
  body('projectName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Project name must not exceed 200 characters'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(PROJECT_STATUSES)
    .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),
  body('startDate')
    .optional({ values: 'falsy' })
    .custom(isValidDate)
    .withMessage('Invalid start date'),
  body('endDate')
    .optional({ values: 'falsy' })
    .custom(isValidDate)
    .withMessage('Invalid end date'),
];

export const projectIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid project ID'),
];

export const projectQueryValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  query('status')
    .optional()
    .isIn(PROJECT_STATUSES)
    .withMessage(`Status must be one of: ${PROJECT_STATUSES.join(', ')}`),
];
