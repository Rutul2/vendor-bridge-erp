import prisma from '../../config/database.js';

export const findUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });
export const findUserById = async (id) => prisma.user.findUnique({ where: { id }, include: { role: true } });
export const createUser = async (data) => prisma.user.create({ data });
export const findRoleByName = async (name) => prisma.role.findUnique({ where: { name } });
export const updateUserPassword = async (id, password_hash) => prisma.user.update({ where: { id }, data: { password_hash } });
