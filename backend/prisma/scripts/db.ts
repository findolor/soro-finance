import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient to be used across all scripts
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma; 