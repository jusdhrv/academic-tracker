/**
 * Prisma client singleton.
 * Uncomment and install @prisma/client when the schema is added.
 */

// import { PrismaClient } from '@prisma/client'
//
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
//
// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
//   })
//
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const prisma = null as unknown as null
