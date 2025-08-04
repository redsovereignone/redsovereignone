'use client'

import { useEffect } from 'react'
import { useCalculatorStore } from '@/stores/calculator'
import Calculator from '@/components/calculator/Calculator'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ScenarioCalculatorProps {
  scenario: any
}

export default function ScenarioCalculator({ scenario }: ScenarioCalculatorProps) {
  const { loadScenario, calculate } = useCalculatorStore()

  useEffect(() => {
    // Load the scenario data into the calculator store
    loadScenario(scenario)
    // Automatically calculate to show the projection
    setTimeout(() => {
      calculate()
    }, 100)
  }, [scenario, loadScenario, calculate])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <span className="text-muted-foreground">|</span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {scenario.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Editing Scenario • Created {new Date(scenario.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <Calculator />
      </div>
    </main>
  )
}