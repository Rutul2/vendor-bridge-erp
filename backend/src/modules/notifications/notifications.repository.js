import prisma from '../../config/database.js';

export const findNotifications = async ({ skip, take, user_id, is_read }) => {
  const where = {
    user_id,
    ...(is_read !== undefined ? { is_read: is_read === 'true' } : {}),
  };
  return prisma.notification.findMany({ where, skip, take, orderBy: { created_at: 'desc' } });
};

export const countNotifications = async ({ user_id, is_read }) => prisma.notification.count({ where: { user_id, ...(is_read !== undefined ? { is_read: is_read === 'true' } : {}) } });
export const findNotificationById = async (id, user_id) => prisma.notification.findUnique({ where: { id } });
export const markAsRead = async (id) => prisma.notification.update({ where: { id }, data: { is_read: true } });
