import dotenv from 'dotenv';
import prisma from '../src/config/database.js';

dotenv.config();

const roles = ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'];

const main = async () => {
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
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
