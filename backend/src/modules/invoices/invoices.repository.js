import prisma from '../../config/database.js';

export const findInvoices = async ({ skip, take, status, vendor_id }) => {
  const where = {
    AND: [
      status ? { status } : {},
      vendor_id ? { vendor_id } : {},
    ],
  };
  return prisma.invoice.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: { vendor: true, purchase_order: true },
  });
};

export const countInvoices = async ({ status, vendor_id }) => prisma.invoice.count({ where: { AND: [status ? { status } : {}, vendor_id ? { vendor_id } : {}] } });
export const findInvoiceById = async (id) => prisma.invoice.findUnique({ where: { id }, include: { vendor: true, purchase_order: true } });
export const createInvoice = async (data) => prisma.invoice.create({ data });
export const updateInvoice = async (id, data) => prisma.invoice.update({ where: { id }, data });
