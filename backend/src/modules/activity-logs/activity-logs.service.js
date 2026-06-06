import { countActivityLogs, findActivityLogs } from './activity-logs.repository.js';

export const listActivityLogs = async ({ page, limit, entity_type, entity_id, action }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findActivityLogs({ skip, take, entity_type, entity_id, action });
  const total = await countActivityLogs({ entity_type, entity_id, action });
  return { items, total, page: Number(page || 1), limit: take };
};
