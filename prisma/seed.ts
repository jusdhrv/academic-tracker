import { PrismaClient } from '@prisma/client'
import { seedAnalytics } from './seed/analytics'
import { seedCore } from './seed/core'

const prisma = new PrismaClient()

async function main() {
  await seedCore(prisma)
  await seedAnalytics(prisma)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
