import prisma from '../../config/database.js';

export const findActivityLogs = async ({ skip, take, entity_type, entity_id, action }) => {
  const where = {
    AND: [
      entity_type ? { entity_type } : {},
      entity_id ? { entity_id } : {},
      action ? { action: { contains: action, mode: 'insensitive' } } : {},
    ],
  };
  return prisma.activityLog.findMany({ where, skip, take, orderBy: { created_at: 'desc' }, include: { user: true } });
};

export const countActivityLogs = async ({ entity_type, entity_id, action }) => prisma.activityLog.count({ where: {
  AND: [
    entity_type ? { entity_type } : {},
    entity_id ? { entity_id } : {},
    action ? { action: { contains: action, mode: 'insensitive' } } : {},
  ],
}});
