import { PrismaClient } from '@prisma/client'
import { db } from './database'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use in-memory database for development and testing
// Use Prisma for production
let prisma: PrismaClient | any;

try {
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    prisma = globalForPrisma.prisma ?? new PrismaClient()
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  } else {
    // Use in-memory database for development
    prisma = db;
  }
} catch (error) {
  console.log('Prisma connection failed, using in-memory database:', error);
  prisma = db;
}

export { prisma }
