import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Only initialize if DATABASE_URL is available (skip during static build analysis)
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    // Return a mock-like placeholder during build when no DB URL is available
    return null as unknown as PrismaClient
  }
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  })
}

export const prisma = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma ?? undefined
