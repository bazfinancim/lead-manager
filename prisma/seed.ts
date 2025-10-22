import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Create some sample agents
  const agent1 = await prisma.agent.create({
    data: {
      name: 'דוד כהן',
      email: 'david.cohen@company.com',
    },
  })

  const agent2 = await prisma.agent.create({
    data: {
      name: 'שרה לוי',
      email: 'sarah.levi@company.com',
    },
  })

  const agent3 = await prisma.agent.create({
    data: {
      name: 'יוסי מזרחי',
      email: 'yossi.mizrachi@company.com',
    },
  })

  // Create some sample leads
  await prisma.lead.createMany({
    data: [
      {
        name: 'רחל אברהם',
        email: 'rachel.avraham@example.com',
        phone: '050-1234567',
        status: 'NEW',
        assignedAgentId: agent1.id,
      },
      {
        name: 'משה ישראלי',
        email: 'moshe.israeli@example.com',
        phone: '052-2345678',
        status: 'CONTACTED',
        assignedAgentId: agent1.id,
      },
      {
        name: 'יעל כהן',
        email: 'yael.cohen@example.com',
        phone: '054-3456789',
        status: 'QUALIFIED',
        assignedAgentId: agent2.id,
      },
      {
        name: 'אבי מילר',
        email: 'avi.miller@example.com',
        phone: '050-4567890',
        status: 'WON',
        assignedAgentId: agent2.id,
      },
      {
        name: 'תמר גרסיה',
        email: 'tamar.garcia@example.com',
        phone: '052-5678901',
        status: 'NEW',
        assignedAgentId: agent3.id,
      },
      {
        name: 'רון מרטינז',
        email: 'ron.martinez@example.com',
        phone: '054-6789012',
        status: 'CONTACTED',
      },
      {
        name: 'חן לי',
        email: 'chen.lee@example.com',
        phone: '050-7890123',
        status: 'LOST',
        assignedAgentId: agent3.id,
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
