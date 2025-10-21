import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Create some sample agents
  const agent1 = await prisma.agent.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@company.com',
    },
  })

  const agent2 = await prisma.agent.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
    },
  })

  const agent3 = await prisma.agent.create({
    data: {
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
    },
  })

  // Create some sample leads
  await prisma.lead.createMany({
    data: [
      {
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        phone: '+1234567890',
        status: 'NEW',
        assignedAgentId: agent1.id,
      },
      {
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        phone: '+1234567891',
        status: 'CONTACTED',
        assignedAgentId: agent1.id,
      },
      {
        name: 'Carol Davis',
        email: 'carol.davis@example.com',
        phone: '+1234567892',
        status: 'QUALIFIED',
        assignedAgentId: agent2.id,
      },
      {
        name: 'David Miller',
        email: 'david.miller@example.com',
        phone: '+1234567893',
        status: 'WON',
        assignedAgentId: agent2.id,
      },
      {
        name: 'Emma Garcia',
        email: 'emma.garcia@example.com',
        phone: '+1234567894',
        status: 'NEW',
        assignedAgentId: agent3.id,
      },
      {
        name: 'Frank Martinez',
        email: 'frank.martinez@example.com',
        phone: '+1234567895',
        status: 'CONTACTED',
      },
      {
        name: 'Grace Lee',
        email: 'grace.lee@example.com',
        phone: '+1234567896',
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
