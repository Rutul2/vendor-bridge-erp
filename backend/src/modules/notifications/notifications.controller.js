import { successResponse } from '../../utils/response.js';
import { listNotifications, readNotification, readAllNotifications, createNewNotification } from './notifications.service.js';

export const listNotificationsHandler = async (req, res) => {
  const data = await listNotifications({ ...req.query, user_id: req.user.id });
  return successResponse(res, 'Notifications retrieved successfully', data);
};

export const markReadHandler = async (req, res) => {
  const data = await readNotification(req.params.id, req.user.id);
  return successResponse(res, 'Notification marked as read', data);
};

export const markAllReadHandler = async (req, res) => {
  const data = await readAllNotifications(req.user.id);
  return successResponse(res, 'All notifications marked as read', data);
};

export const createNotificationHandler = async (req, res) => {
  const data = await createNewNotification(req.body);
  return successResponse(res, 'Notification created successfully', data);
};
