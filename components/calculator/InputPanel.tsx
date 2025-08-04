'use client'

import { useCalculatorStore } from '@/stores/calculator'
import { Info } from 'lucide-react'

export default function InputPanel() {
  const { inputs, setInputs } = useCalculatorStore()
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full" />
          Recurring Revenue (MRR)
        </h3>
        
        <div className="form-group">
          <label htmlFor="initial-mrr" className="form-label flex items-center gap-2">
            Current MRR
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              id="initial-mrr"
              name="initial-mrr"
              type="number"
              value={inputs.initialMRR}
              onChange={(e) => setInputs({ initialMRR: Number(e.target.value) })}
              className="input-field pl-8"
              min="0"
              step="1000"
            />
          </div>
          <p className="form-helper">
            {formatCurrency(inputs.initialMRR)}
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="mrr-growth-rate" className="form-label flex items-center gap-2">
            Monthly Growth Rate
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </label>
          <div className="relative">
            <input
              id="mrr-growth-rate"
              name="mrr-growth-rate"
              type="number"
              value={inputs.mrrGrowthRate}
              onChange={(e) => setInputs({ mrrGrowthRate: Number(e.target.value) })}
              className="input-field pr-8"
              min="0"
              max="100"
              step="1"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="churn-rate" className="form-label flex items-center gap-2">
            Monthly Churn Rate
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </label>
          <div className="relative">
            <input
              id="churn-rate"
              name="churn-rate"
              type="number"
              value={inputs.churnRate}
              onChange={(e) => setInputs({ churnRate: Number(e.target.value) })}
              className="input-field pr-8"
              min="0"
              max="50"
              step="0.5"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-chart-3 flex items-center gap-2">
          <div className="w-1 h-6 bg-chart-3 rounded-full" />
          Project Revenue
        </h3>
        
        <div className="form-group">
          <label htmlFor="project-revenue" className="form-label flex items-center gap-2">
            Monthly Project Revenue
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              id="project-revenue"
              name="project-revenue"
              type="number"
              value={inputs.projectRevenue}
              onChange={(e) => setInputs({ projectRevenue: Number(e.target.value) })}
              className="input-field pl-8"
              min="0"
              step="1000"
            />
          </div>
          <p className="form-helper">
            {formatCurrency(inputs.projectRevenue)}
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="project-growth-rate" className="form-label flex items-center gap-2">
            Annual Growth Rate
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </label>
          <div className="relative">
            <input
              id="project-growth-rate"
              name="project-growth-rate"
              type="number"
              value={inputs.projectGrowthRate}
              onChange={(e) => setInputs({ projectGrowthRate: Number(e.target.value) })}
              className="input-field pr-8"
              min="-50"
              max="100"
              step="1"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
          </div>
          <p className="form-helper">
            Linear growth (non-compounding)
          </p>
        </div>
      </div>
    </div>
  )
}