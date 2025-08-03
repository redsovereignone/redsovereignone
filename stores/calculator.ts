import { create } from 'zustand';
import { RevenueInputs, CalculationResult } from '@/types/revenue';
import { calculateHybridRevenue } from '@/lib/calculations/hybrid';

interface CalculatorState {
  inputs: RevenueInputs;
  results: CalculationResult | null;
  isCalculating: boolean;
  
  // Actions
  updateRecurringInputs: (inputs: Partial<RevenueInputs['recurring']>) => void;
  updateProjectInputs: (inputs: Partial<RevenueInputs['projects']>) => void;
  updateProjectionMonths: (months: number) => void;
  calculate: () => void;
  reset: () => void;
}

const defaultInputs: RevenueInputs = {
  recurring: {
    currentMRR: 100000,
    newCustomersPerMonth: 5,
    averageMRRPerCustomer: 2000,
    monthlyGrowthFromExisting: 2,
    monthlyChurnRate: 3,
  },
  projects: {
    newProjectsPerMonth: 2,
    averageProjectValue: 25000,
    averageTimeToClose: 30,
  },
  projectionMonths: 24,
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  inputs: defaultInputs,
  results: null,
  isCalculating: false,
  
  updateRecurringInputs: (recurringInputs) => {
    set((state) => ({
      inputs: {
        ...state.inputs,
        recurring: {
          ...state.inputs.recurring,
          ...recurringInputs,
        },
      },
    }));
    // Auto-calculate on input change
    get().calculate();
  },
  
  updateProjectInputs: (projectInputs) => {
    set((state) => ({
      inputs: {
        ...state.inputs,
        projects: {
          ...state.inputs.projects,
          ...projectInputs,
        },
      },
    }));
    // Auto-calculate on input change
    get().calculate();
  },
  
  updateProjectionMonths: (months) => {
    set((state) => ({
      inputs: {
        ...state.inputs,
        projectionMonths: months,
      },
    }));
    // Auto-calculate on input change
    get().calculate();
  },
  
  calculate: () => {
    const { inputs } = get();
    set({ isCalculating: true });
    
    try {
      const results = calculateHybridRevenue(inputs);
      set({ results, isCalculating: false });
    } catch (error) {
      console.error('Calculation error:', error);
      set({ isCalculating: false });
    }
  },
  
  reset: () => {
    set({
      inputs: defaultInputs,
      results: null,
      isCalculating: false,
    });
  },
}));

// Initialize with calculations on store creation
useCalculatorStore.getState().calculate();