'use client'

import { useState } from 'react'
import { Database } from '@/types/database'
import { Trash2, Edit, BarChart3 } from 'lucide-react'
import Link from 'next/link'

type Scenario = Database['public']['Tables']['scenarios']['Row']

interface ScenarioListProps {
  scenarios: Scenario[]
  onDelete: (id: string) => Promise<void>
}

export default function ScenarioList({ scenarios, onDelete }: ScenarioListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value)
  }
  
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scenario?')) return
    
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }
  
  if (scenarios.length === 0) {
    return (
      <div className="glass-panel p-12 text-center">
        <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No scenarios yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first revenue scenario to start tracking growth
        </p>
        <Link
          href="/calculator"
          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-foreground font-bold rounded-lg transition-all"
        >
          Create First Scenario
        </Link>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scenarios.map((scenario) => (
        <div
          key={scenario.id}
          className="glass-panel glass-panel-hover p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{scenario.name}</h3>
              <p className="text-xs text-muted-foreground">
                Created {new Date(scenario.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/scenarios/${scenario.id}`}
                className="p-2 hover:bg-background/50 rounded transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDelete(scenario.id)}
                disabled={deletingId === scenario.id}
                className="p-2 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Initial MRR</span>
              <span className="font-medium">{formatCurrency(scenario.initial_mrr)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">MRR Growth</span>
              <span className="font-medium text-primary">{formatPercent(scenario.mrr_growth_rate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Project Revenue</span>
              <span className="font-medium">{formatCurrency(scenario.project_revenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Churn Rate</span>
              <span className="font-medium text-red-400">{formatPercent(scenario.churn_rate)}</span>
            </div>
          </div>
          
          <Link
            href={`/scenarios/${scenario.id}`}
            className="block w-full px-4 py-2 bg-background/50 hover:bg-background/70 text-center font-medium rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  )
}