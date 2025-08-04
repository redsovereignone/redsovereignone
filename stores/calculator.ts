import { create } from 'zustand'
import { RevenueInputs, RevenueProjection } from '@/types/revenue'
import { calculateHybridRevenue } from '@/lib/calculations/hybrid'

interface CalculatorState {
  inputs: RevenueInputs
  projection: RevenueProjection | null
  isCalculating: boolean
  scenarioContext: {
    id?: string
    name?: string
  } | null
  
  setInputs: (inputs: Partial<RevenueInputs>) => void
  loadScenario: (scenario: any) => void
  calculate: () => void
  reset: () => void
  setScenarioContext: (context: { id?: string; name?: string } | null) => void
}

const defaultInputs: RevenueInputs = {
  initialMRR: 100000,
  mrrGrowthRate: 15,
  projectRevenue: 50000,
  projectGrowthRate: 10,
  churnRate: 5
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  inputs: defaultInputs,
  projection: null,
  isCalculating: false,
  scenarioContext: null,
  
  setInputs: (newInputs) => {
    set((state) => ({
      inputs: { ...state.inputs, ...newInputs }
    }))
  },
  
  loadScenario: (scenario) => {
    set({
      inputs: {
        initialMRR: Number(scenario.initial_mrr),
        mrrGrowthRate: Number(scenario.mrr_growth_rate),
        projectRevenue: Number(scenario.project_revenue),
        projectGrowthRate: Number(scenario.project_growth_rate),
        churnRate: Number(scenario.churn_rate)
      },
      scenarioContext: {
        id: scenario.id,
        name: scenario.name
      },
      projection: null
    })
  },
  
  calculate: () => {
    set({ isCalculating: true })
    const { inputs } = get()
    const projection = calculateHybridRevenue(inputs)
    set({ projection, isCalculating: false })
  },
  
  reset: () => {
    set({
      inputs: defaultInputs,
      projection: null,
      isCalculating: false,
      scenarioContext: null
    })
  },
  
  setScenarioContext: (context) => {
    set({ scenarioContext: context })
  }
}))