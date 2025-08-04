'use client'

import { RevenueMetrics } from '@/types/revenue'
import { TrendingUp, DollarSign, Target, PieChart, ArrowUp, ArrowDown } from 'lucide-react'

interface MetricsDisplayProps {
  metrics: RevenueMetrics
}

export default function MetricsDisplay({ metrics }: MetricsDisplayProps) {
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
  
  return (
    <div className="stats-grid">
      <div className="metric-card">
        <div className="flex items-center justify-between mb-3">
          <DollarSign className="w-8 h-8 text-primary" />
          <span className="badge badge-success">24M</span>
        </div>
        <p className="metric-label">Total Revenue</p>
        <p className="metric-value">{formatCurrency(metrics.totalRevenue24Months)}</p>
        <div className="metric-change text-chart-3">
          <ArrowUp className="w-3 h-3" />
          <span>{formatPercent(metrics.effectiveGrowthRate)}</span>
        </div>
      </div>
      
      <div className="metric-card">
        <div className="flex items-center justify-between mb-3">
          <Target className="w-8 h-8 text-chart-3" />
          <span className="badge badge-warning">M24</span>
        </div>
        <p className="metric-label">Ending MRR</p>
        <p className="metric-value">{formatCurrency(metrics.endingMRR)}</p>
        <div className="form-helper">
          ARR: {formatCurrency(metrics.endingMRR * 12)}
        </div>
      </div>
      
      <div className="metric-card">
        <div className="flex items-center justify-between mb-3">
          <TrendingUp className="w-8 h-8 text-chart-5" />
          <span className="text-xs text-muted-foreground">Growth</span>
        </div>
        <p className="metric-label">Effective Growth</p>
        <p className="metric-value text-chart-5">{formatPercent(metrics.effectiveGrowthRate)}</p>
        <div className="form-helper">
          Over 24 months
        </div>
      </div>
      
      <div className="metric-card">
        <div className="flex items-center justify-between mb-3">
          <PieChart className="w-8 h-8 text-chart-1" />
          <span className="text-xs text-muted-foreground">Split</span>
        </div>
        <p className="metric-label">Revenue Mix</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1">
            <div className="text-sm font-semibold text-primary">{formatPercent(metrics.mrrContribution)}</div>
            <div className="text-xs text-muted-foreground">MRR</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-chart-3">{formatPercent(metrics.projectContribution)}</div>
            <div className="text-xs text-muted-foreground">Projects</div>
          </div>
        </div>
      </div>
    </div>
  )
}