import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  try {
    return new PrismaClient()
  } catch (e) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return null as any as PrismaClient
    }
    throw e
  }
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
