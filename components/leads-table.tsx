'use client'

import { LeadStatus } from '@/lib/generated/prisma'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AgentAvatar } from '@/components/agent-avatar'

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

interface LeadsTableProps {
  leads: Lead[]
  agents: Agent[]
  onUpdate: () => void
}

const statusColors: Record<LeadStatus, string> = {
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-yellow-500',
  QUALIFIED: 'bg-purple-500',
  WON: 'bg-green-500',
  LOST: 'bg-red-500',
}

export function LeadsTable({ leads, agents, onUpdate }: LeadsTableProps) {
  async function updateLeadStatus(leadId: string, status: LeadStatus) {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to update lead status:', error)
    }
  }

  async function updateLeadAgent(leadId: string, assignedAgentId: string) {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedAgentId: assignedAgentId || null }),
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to assign agent:', error)
    }
  }

  async function deleteLead(leadId: string) {
    if (!confirm('Are you sure you want to delete this lead?')) return

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to delete lead:', error)
    }
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No leads yet. Create your first lead to get started.
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Agent</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>
                <Select
                  value={lead.status}
                  onValueChange={(value) => updateLeadStatus(lead.id, value as LeadStatus)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue>
                      <Badge className={statusColors[lead.status]}>
                        {lead.status}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LeadStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        <Badge className={statusColors[status]}>{status}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={lead.assignedAgentId || 'unassigned'}
                  onValueChange={(value) =>
                    updateLeadAgent(lead.id, value === 'unassigned' ? '' : value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Unassigned">
                      {lead.assignedAgent ? (
                        <AgentAvatar name={lead.assignedAgent.name} showName />
                      ) : (
                        'Unassigned'
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">
                      <span className="text-muted-foreground">Unassigned</span>
                    </SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <AgentAvatar name={agent.name} showName />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {new Date(lead.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteLead(lead.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
