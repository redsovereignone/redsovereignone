'use client'

import { useState } from 'react'
import { useCalculatorStore } from '@/stores/calculator'
import InputPanel from './InputPanel'
import ResultsChart from './ResultsChart'
import MetricsDisplay from './MetricsDisplay'
import SaveScenarioModal from './SaveScenarioModal'
import { Save, Calculator as CalcIcon } from 'lucide-react'

export default function Calculator() {
  const { projection, isCalculating, calculate } = useCalculatorStore()
  const [showSaveModal, setShowSaveModal] = useState(false)
  
  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 animate-slide-up">
        <div className="section-header">
          <h2 className="section-title">Revenue Inputs</h2>
          <p className="section-description">Configure your growth parameters</p>
        </div>
        <InputPanel />
        
        <button
          onClick={calculate}
          disabled={isCalculating}
          className="mt-6 w-full btn-primary inline-flex items-center justify-center gap-2"
        >
          <CalcIcon className="w-4 h-4" />
          {isCalculating ? 'Calculating...' : 'Calculate Revenue Projection'}
        </button>
      </div>
      
      {projection && (
        <>
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowSaveModal(true)}
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" />
                Save Scenario
              </button>
            </div>
            <ResultsChart data={projection.months} />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-header mb-6">
              <h2 className="section-title">Key Metrics</h2>
              <p className="section-description">Performance indicators</p>
            </div>
            <MetricsDisplay metrics={projection.metrics} />
          </div>
        </>
      )}
      
      <SaveScenarioModal 
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  )
}