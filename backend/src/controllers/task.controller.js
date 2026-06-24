import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import * as taskService from '../services/task.service.js';

export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, projectId } = req.query;
  const tasks = await taskService.getTasks(req.user.id, {
    search,
    status,
    priority,
    projectId,
  });
  sendSuccess(res, { tasks }, 'Tasks retrieved successfully');
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(
    req.user.id,
    parseInt(req.params.id, 10)
  );
  sendSuccess(res, { task }, 'Task retrieved successfully');
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.body);
  sendSuccess(res, { task }, 'Task created successfully', 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(
    req.user.id,
    parseInt(req.params.id, 10),
    req.body
  );
  sendSuccess(res, { task }, 'Task updated successfully');
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user.id, parseInt(req.params.id, 10));
  sendSuccess(res, null, 'Task deleted successfully');
});

export const markTaskCompleted = asyncHandler(async (req, res) => {
  const task = await taskService.markTaskCompleted(
    req.user.id,
    parseInt(req.params.id, 10)
  );
  sendSuccess(res, { task }, 'Task marked as completed');
});
