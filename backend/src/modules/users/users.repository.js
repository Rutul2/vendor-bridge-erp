import prisma from '../../config/database.js';

export const findUsers = async ({ skip, take, search, role, status }) => {
  const where = {
    AND: [
      search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
        : {},
      role ? { role: { name: role } } : {},
      status !== undefined ? { is_active: status === 'active' } : {},
    ],
  };
  return prisma.user.findMany({ where, skip, take, include: { role: true } });
};

export const countUsers = async ({ search, role, status }) => {
  const where = {
    AND: [
      search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
        : {},
      role ? { role: { name: role } } : {},
      status !== undefined ? { is_active: status === 'active' } : {},
    ],
  };
  return prisma.user.count({ where });
};

export const findUserById = async (id) => prisma.user.findUnique({ where: { id }, include: { role: true } });
export const createUser = async (data) => prisma.user.create({ data });
export const updateUser = async (id, data) => prisma.user.update({ where: { id }, data });
export const deleteUser = async (id) => prisma.user.delete({ where: { id } });
export const findRoleByName = async (name) => prisma.role.findUnique({ where: { name } });
