import prisma from '../../config/database.js';

export const findApprovals = async ({ skip, take, status, quotation_id }) => {
  const where = {
    AND: [
      status ? { status } : {},
      quotation_id ? { quotation_id } : {},
    ],
  };
  return prisma.approval.findMany({
    where,
    skip,
    take,
    orderBy: { approved_at: 'desc' },
    include: { quotation: true, approver: true },
  });
};

export const countApprovals = async ({ status, quotation_id }) => prisma.approval.count({ where: { AND: [status ? { status } : {}, quotation_id ? { quotation_id } : {}] } });
export const findApprovalById = async (id) => prisma.approval.findUnique({
  where: { id },
  include: { approver: true, quotation: { include: { vendor: true, rfq: true, items: true } } }
});
export const findQuotationById = async (quotation_id) => prisma.quotation.findUnique({ where: { id: quotation_id } });
export const createApproval = async (data) => prisma.approval.create({ data });
export const updateQuotationStatus = async (quotationId, status) => prisma.quotation.update({ where: { id: quotationId }, data: { status } });
