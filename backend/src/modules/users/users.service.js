import bcrypt from 'bcryptjs';
import { logActivity } from '../../utils/activityLogger.js';
import { countUsers, createUser, deleteUser, findRoleByName, findUserById, findUsers, updateUser } from './users.repository.js';

export const listUsers = async ({ page, limit, search, role, status }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findUsers({ skip, take, search, role, status });
  const total = await countUsers({ search, role, status });
  return { items, total, page: Number(page || 1), limit: take };
};

export const getUser = async (id) => {
  const user = await findUserById(id);
  if (!user) throw { statusCode: 404, message: 'User not found' };
  return user;
};

export const createNewUser = async (payload) => {
  const role = await findRoleByName(payload.role);
  if (!role) throw { statusCode: 400, message: 'Invalid role' };
  const password_hash = await bcrypt.hash(payload.password, 12);
  const user = await createUser({
    name: payload.name,
    email: payload.email,
    password_hash,
    role_id: role.id,
    is_active: payload.is_active ?? true,
  });
  await logActivity({ user_id: user.id, entity_type: 'USER', entity_id: user.id, action: 'CREATE', new_data: user });
  return user;
};

export const updateExistingUser = async (id, payload) => {
  const user = await findUserById(id);
  if (!user) throw { statusCode: 404, message: 'User not found' };
  const data = {};
  if (payload.name) data.name = payload.name;
  if (payload.email) data.email = payload.email;
  if (payload.role) {
    const role = await findRoleByName(payload.role);
    if (!role) throw { statusCode: 400, message: 'Invalid role' };
    data.role_id = role.id;
  }
  if (payload.password) {
    data.password_hash = await bcrypt.hash(payload.password, 12);
  }
  if (payload.is_active !== undefined) data.is_active = payload.is_active;
  const updated = await updateUser(id, data);
  await logActivity({ user_id: updated.id, entity_type: 'USER', entity_id: updated.id, action: 'UPDATE', old_data: user, new_data: updated });
  return updated;
};

export const removeUser = async (id) => {
  const existing = await findUserById(id);
  if (!existing) throw { statusCode: 404, message: 'User not found' };
  const deleted = await deleteUser(id);
  await logActivity({ user_id: deleted.id, entity_type: 'USER', entity_id: deleted.id, action: 'DELETE', old_data: existing });
  return deleted;
};
