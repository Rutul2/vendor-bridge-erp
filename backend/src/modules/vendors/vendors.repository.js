import prisma from '../../config/database.js';

export const findVendors = async ({ skip, take, search, category, status }) => {
  const where = {
    AND: [
      search
        ? {
            OR: [
              { company_name: { contains: search, mode: 'insensitive' } },
              { vendor_code: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      category ? { category: { equals: category, mode: 'insensitive' } } : {},
      status ? { status: { equals: status, mode: 'insensitive' } } : {},
      { deleted_at: null },
    ],
  };
  return prisma.vendor.findMany({ where, skip, take, orderBy: { created_at: 'desc' } });
};

export const countVendors = async ({ search, category, status }) => {
  const where = {
    AND: [
      search
        ? {
            OR: [
              { company_name: { contains: search, mode: 'insensitive' } },
              { vendor_code: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      category ? { category: { equals: category, mode: 'insensitive' } } : {},
      status ? { status: { equals: status, mode: 'insensitive' } } : {},
      { deleted_at: null },
    ],
  };
  return prisma.vendor.count({ where });
};

export const findVendorById = async (id) => prisma.vendor.findFirst({ where: { id, deleted_at: null } });
export const createVendor = async (data) => prisma.vendor.create({ data });
export const updateVendor = async (id, data) => prisma.vendor.update({ where: { id }, data });
export const softDeleteVendor = async (id) => prisma.vendor.update({ where: { id }, data: { deleted_at: new Date() } });
