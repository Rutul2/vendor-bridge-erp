import { successResponse } from '../../utils/response.js';
import { createNewUser, getUser, listUsers, removeUser, updateExistingUser } from './users.service.js';

export const listUsersHandler = async (req, res) => {
  const data = await listUsers(req.query);
  return successResponse(res, 'Users retrieved successfully', data);
};

export const getUserHandler = async (req, res) => {
  const data = await getUser(req.params.id);
  return successResponse(res, 'User retrieved successfully', data);
};

export const createUserHandler = async (req, res) => {
  const data = await createNewUser(req.body);
  return successResponse(res, 'User created successfully', data);
};

export const updateUserHandler = async (req, res) => {
  const data = await updateExistingUser(req.params.id, req.body);
  return successResponse(res, 'User updated successfully', data);
};

export const deleteUserHandler = async (req, res) => {
  await removeUser(req.params.id);
  return successResponse(res, 'User deleted successfully');
};
