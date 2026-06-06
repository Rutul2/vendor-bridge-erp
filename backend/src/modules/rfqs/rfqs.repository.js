import prisma from '../../config/database.js';

export const findRfqs = async ({ skip, take, search, status, createdBy }) => {
  const where = {
    AND: [
      search
        ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }
        : {},
      status ? { status } : {},
      createdBy ? { created_by: createdBy } : {},
    ],
  };
  return prisma.rfq.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: { items: true, vendors: true, quotations: true },
  });
};

export const countRfqs = async ({ search, status, createdBy }) => {
  const where = {
    AND: [
      search
        ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }
        : {},
      status ? { status } : {},
      createdBy ? { created_by: createdBy } : {},
    ],
  };
  return prisma.rfq.count({ where });
};

export const findRfqById = async (id) => prisma.rfq.findUnique({
  where: { id },
  include: { items: true, vendors: { include: { vendor: true } }, quotations: true },
});

export const createRfq = async (data) => prisma.rfq.create({ data });
export const updateRfq = async (id, data) => prisma.rfq.update({ where: { id }, data });
export const deleteRfq = async (id) => prisma.rfq.delete({ where: { id } });

export const assignVendors = async (rfqId, vendorIds) => {
  const data = vendorIds.map((vendor_id) => ({ rfq_id: rfqId, vendor_id, invitation_status: 'PENDING' }));
  return prisma.rfqVendor.createMany({ data, skipDuplicates: true });
};

export const createAttachment = async (data) => prisma.attachment.create({ data });
export const findAttachmentsByRfq = async (rfqId) => prisma.attachment.findMany({ where: { rfq_id: rfqId }, orderBy: { created_at: 'desc' } });
