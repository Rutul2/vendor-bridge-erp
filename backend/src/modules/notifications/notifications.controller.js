import { successResponse } from '../../utils/response.js';
import { listNotifications, readNotification } from './notifications.service.js';

export const listNotificationsHandler = async (req, res) => {
  const data = await listNotifications({ ...req.query, user_id: req.user.id });
  return successResponse(res, 'Notifications retrieved successfully', data);
};

export const markReadHandler = async (req, res) => {
  const data = await readNotification(req.params.id, req.user.id);
  return successResponse(res, 'Notification marked as read', data);
};
