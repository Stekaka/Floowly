import { PrismaClient } from '@prisma/client'
import { db } from './database'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use in-memory database for development and testing
// Use Prisma for production
let prisma: PrismaClient | any;

try {
  if (process.env.NODE_ENV === 'production') {
    // Production: Use Prisma with PostgreSQL
    prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: ['error', 'warn'],
    });
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  } else {
    // Development: Use in-memory database
    prisma = db;
  }
} catch (error) {
  console.log('Prisma connection failed, using in-memory database:', error);
  prisma = db;
}

export { prisma }
