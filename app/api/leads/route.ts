import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeadStatus } from '@/lib/generated/prisma'

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        assignedAgent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Failed to fetch leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, assignedAgentId } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        assignedAgentId: assignedAgentId || null,
        status: LeadStatus.NEW,
      },
      include: {
        assignedAgent: true,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Failed to create lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
