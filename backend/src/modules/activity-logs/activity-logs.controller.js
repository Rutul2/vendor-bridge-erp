import { successResponse } from '../../utils/response.js';
import { listActivityLogs } from './activity-logs.service.js';

export const listActivityLogsHandler = async (req, res) => {
  const data = await listActivityLogs(req.query);
  return successResponse(res, 'Activity logs retrieved successfully', data);
};
