import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();
try {
  await client.$connect();
  console.log('DB CONNECTED');
  await client.$disconnect();
} catch (err) {
  console.error('DB CONNECT FAILED');
  console.error(err.message || err);
  process.exit(1);
}
