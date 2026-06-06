import prisma from '../../config/database.js';

export const findRfqsAssignedToVendor = async ({ vendor_id, skip = 0, take = 20 }) => {
  return prisma.rfqVendor.findMany({
    where: { vendor_id },
    skip: Number(skip),
    take: Number(take),
    orderBy: { invited_at: 'desc' },
    include: { rfq: { include: { items: true, quotations: { where: { vendor_id } } } } },
  });
};

export const findRfqAssignedToVendorById = async ({ vendor_id, rfq_id }) => prisma.rfqVendor.findFirst({ where: { vendor_id, rfq_id }, include: { rfq: { include: { items: true, quotations: { where: { vendor_id } } } } } });
