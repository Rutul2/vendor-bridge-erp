import prisma from '../../config/database.js';

export const findQuotations = async ({ skip, take, search, status, vendor_id }) => {
  const where = {
    AND: [
      search
        ? { OR: [{ notes: { contains: search, mode: 'insensitive' } }, { id: { contains: search, mode: 'insensitive' } }] }
        : {},
      status ? { status } : {},
      vendor_id ? { vendor_id } : {},
    ],
  };
  return prisma.quotation.findMany({
    where,
    skip,
    take,
    orderBy: { submitted_at: 'desc' },
    include: { items: true, vendor: true, rfq: true, approvals: true },
  });
};

export const countQuotations = async ({ search, status, vendor_id }) => {
  const where = {
    AND: [
      search
        ? { OR: [{ notes: { contains: search, mode: 'insensitive' } }, { id: { contains: search, mode: 'insensitive' } }] }
        : {},
      status ? { status } : {},
      vendor_id ? { vendor_id } : {},
    ],
  };
  return prisma.quotation.count({ where });
};

export const findQuotationById = async (id) => prisma.quotation.findUnique({ where: { id }, include: { items: true, vendor: true, rfq: true, approvals: true } });
export const createQuotation = async (data) => prisma.quotation.create({ data });
export const updateQuotation = async (id, data) => prisma.quotation.update({ where: { id }, data });
export const findQuotationsByRfq = async (rfqId) => prisma.quotation.findMany({ where: { rfq_id: rfqId }, include: { items: true, vendor: true, approvals: true } });
