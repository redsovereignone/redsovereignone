'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { X, Save } from 'lucide-react'
import { useCalculatorStore } from '@/stores/calculator'

interface SaveScenarioModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SaveScenarioModal({ isOpen, onClose }: SaveScenarioModalProps) {
  const { inputs, scenarioContext } = useCalculatorStore()
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveMode, setSaveMode] = useState<'new' | 'update'>('new')
  
  const { isSignedIn } = useUser()
  const router = useRouter()
  
  useEffect(() => {
    if (scenarioContext?.name) {
      setName(scenarioContext.name)
      setSaveMode('update')
    } else {
      setName('')
      setSaveMode('new')
    }
  }, [scenarioContext, isOpen])
  
  if (!isOpen) return null
  
  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a scenario name')
      return
    }
    
    if (!isSignedIn) {
      router.push('/sign-up')
      return
    }
    
    setIsSaving(true)
    setError('')
    
    try {
      const isUpdating = saveMode === 'update' && scenarioContext?.id
      
      const url = isUpdating 
        ? `/api/scenarios/${scenarioContext.id}`
        : '/api/scenarios'
      
      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          initial_mrr: inputs.initialMRR,
          mrr_growth_rate: inputs.mrrGrowthRate,
          project_revenue: inputs.projectRevenue,
          project_growth_rate: inputs.projectGrowthRate,
          churn_rate: inputs.churnRate,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save scenario')
      }
      
      const scenario = await response.json()
      
      // Close modal and reset form
      setName('')
      setError('')
      onClose()
      
      // Show success message
      console.log(isUpdating ? '✅ Scenario updated!' : '✅ Scenario saved!')
      
      // Navigate appropriately
      if (isUpdating) {
        router.refresh()
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save scenario. Please try again.')
      console.error('Error saving scenario:', err)
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-panel p-6 max-w-md w-full space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {saveMode === 'update' ? 'Update Scenario' : 'Save Scenario'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {!isSignedIn ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Create an account to save and track your revenue scenarios
            </p>
            <button
              onClick={() => router.push('/sign-up')}
              className="w-full btn-primary"
            >
              Sign Up to Save
            </button>
            <button
              onClick={() => router.push('/sign-in')}
              className="w-full btn-secondary"
            >
              Already have an account? Sign In
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="form-label">
                Scenario Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Aggressive Growth Plan"
                className="w-full px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff'
                }}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>
            
            {scenarioContext && (
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                <input
                  type="checkbox"
                  id="saveAsNew"
                  checked={saveMode === 'new'}
                  onChange={(e) => setSaveMode(e.target.checked ? 'new' : 'update')}
                  className="rounded"
                />
                <label htmlFor="saveAsNew" className="text-sm text-muted-foreground">
                  Save as new scenario
                </label>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
                className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : (saveMode === 'update' ? 'Update Scenario' : 'Save Scenario')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}