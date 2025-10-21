'use client'

import { useEffect, useState } from 'react'
import { LeadsTable } from '@/components/leads-table'
import { CreateLeadDialog } from '@/components/create-lead-dialog'
import { CreateAgentDialog } from '@/components/create-agent-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadStatus } from '@/lib/generated/prisma'

interface Agent {
  id: string
  name: string
  email: string
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: LeadStatus
  assignedAgentId: string | null
  assignedAgent: Agent | null
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchData() {
    try {
      const [leadsRes, agentsRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/agents'),
      ])

      const leadsData = await leadsRes.json()
      const agentsData = await agentsRes.json()

      setLeads(leadsData)
      setAgents(agentsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Lead Management System</h1>
        <p className="text-muted-foreground">
          Manage your leads and assign them to agents
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leads</CardTitle>
              <CardDescription>
                View and manage all your leads in one place
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <CreateAgentDialog onAgentCreated={fetchData} />
              <CreateLeadDialog agents={agents} onLeadCreated={fetchData} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LeadsTable leads={leads} agents={agents} onUpdate={fetchData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold">{leads.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Agents</p>
              <p className="text-2xl font-bold">{agents.length}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Unassigned Leads</p>
              <p className="text-2xl font-bold">
                {leads.filter((lead) => !lead.assignedAgentId).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
