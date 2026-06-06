import { countNotifications, findNotificationById, findNotifications, markAsRead } from './notifications.repository.js';

export const listNotifications = async ({ page, limit, user_id, is_read }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findNotifications({ skip, take, user_id, is_read });
  const total = await countNotifications({ user_id, is_read });
  return { items, total, page: Number(page || 1), limit: take };
};

export const readNotification = async (id, user_id) => {
  const notification = await findNotificationById(id, user_id);
  if (!notification || notification.user_id !== user_id) throw { statusCode: 404, message: 'Notification not found' };
  return markAsRead(id);
};
