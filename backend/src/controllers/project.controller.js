import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import * as projectService from '../services/project.service.js';

export const getProjects = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  const projects = await projectService.getProjects(req.user.id, {
    search,
    status,
  });
  sendSuccess(res, { projects }, 'Projects retrieved successfully');
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(
    req.user.id,
    parseInt(req.params.id, 10)
  );
  sendSuccess(res, { project }, 'Project retrieved successfully');
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.user.id, req.body);
  sendSuccess(res, { project }, 'Project created successfully', 201);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(
    req.user.id,
    parseInt(req.params.id, 10),
    req.body
  );
  sendSuccess(res, { project }, 'Project updated successfully');
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(
    req.user.id,
    parseInt(req.params.id, 10)
  );
  sendSuccess(res, null, 'Project deleted successfully');
});
