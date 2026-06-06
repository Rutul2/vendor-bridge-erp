import dotenv from 'dotenv';
import prisma from '../src/config/database.js';

dotenv.config();

const roles = ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'];

import bcrypt from 'bcryptjs';

const main = async () => {
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
  
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' }});
  const officerRole = await prisma.role.findUnique({ where: { name: 'PROCUREMENT_OFFICER' }});
  const managerRole = await prisma.role.findUnique({ where: { name: 'MANAGER' }});
  const vendorRole = await prisma.role.findUnique({ where: { name: 'VENDOR' }});

  const passwordHash = await bcrypt.hash('password123', 10);

  const officer = await prisma.user.upsert({
    where: { email: 'officer@vendorbridge.com' },
    update: {},
    create: {
      name: 'Demo Officer',
      email: 'officer@vendorbridge.com',
      password_hash: passwordHash,
      role_id: officerRole.id
    }
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@vendorbridge.com' },
    update: {},
    create: {
      name: 'Demo Manager',
      email: 'manager@vendorbridge.com',
      password_hash: passwordHash,
      role_id: managerRole.id
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vendorbridge.com' },
    update: {},
    create: {
      name: 'Demo Admin',
      email: 'admin@vendorbridge.com',
      password_hash: passwordHash,
      role_id: adminRole.id
    }
  });

  const vendorUser1 = await prisma.user.upsert({
    where: { email: 'rajesh@infrasupplies.in' },
    update: {},
    create: {
      name: 'Rajesh Kumar',
      email: 'rajesh@infrasupplies.in',
      password_hash: passwordHash,
      role_id: vendorRole.id
    }
  });

  const vendor1 = await prisma.vendor.upsert({
    where: { vendor_code: 'V001' },
    update: {},
    create: {
      company_name: 'Infra Supplies Pvt Ltd',
      vendor_code: 'V001',
      category: 'Construction',
      gst_number: '27AABCI5678B1Z0',
      email: 'rajesh@infrasupplies.in',
      phone: '+91 98765 43210',
      address: 'Plot 42, MIDC Andheri East, Mumbai 400093',
      rating: 4.5
    }
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { vendor_code: 'V002' },
    update: {},
    create: {
      company_name: 'TechCore LTD',
      vendor_code: 'V002',
      category: 'IT',
      gst_number: '27AABCT3921B2Z0',
      email: 'priya@techcore.in',
      phone: '+91 87654 32109',
      address: '5th Floor, Cyber Tower, Hitech City, Hyderabad',
      rating: 4.2
    }
  });

  console.log('Seed data inserted successfully');
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
