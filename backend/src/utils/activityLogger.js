import prisma from '../config/database.js';

export const logActivity = async ({ user_id, entity_type, entity_id, action, old_data, new_data }) => {
  return prisma.activityLog.create({
    data: {
      user_id,
      entity_type,
      entity_id,
      action,
      old_data: old_data || null,
      new_data: new_data || null,
    },
  });
};
