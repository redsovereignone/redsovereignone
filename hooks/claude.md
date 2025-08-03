# hooks/ Directory Guide

## Purpose
The hooks directory contains custom React hooks that encapsulate stateful logic, side effects, and provide reusable functionality across components. These hooks abstract complex operations and integrate with external services.

## Directory Structure

```
hooks/
├── useAuth.ts           # Authentication state and helpers
├── useCalculator.ts     # Calculator state management
├── useScenarios.ts      # Scenario CRUD operations
├── useActuals.ts        # Actual revenue tracking
├── useDebounce.ts       # Input debouncing
├── useLocalStorage.ts   # Persistent local state
├── useMediaQuery.ts     # Responsive design
├── useToast.ts          # Notification system
├── useExport.ts         # Data export functionality
└── useAnalytics.ts      # Event tracking
```

## Core Hooks

### useAuth.ts - Authentication Management
```typescript
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  const requireAuth = useCallback(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
      return false;
    }
    return true;
  }, [isLoaded, isSignedIn, router]);
  
  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push('/');
  }, [signOut, router]);
  
  return {
    user,
    isLoaded,
    isSignedIn,
    requireAuth,
    signOut: handleSignOut,
    userId: user?.id,
    userEmail: user?.primaryEmailAddress?.emailAddress,
  };
}
```

### useCalculator.ts - Calculator State Management
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateHybridRevenue } from '@/lib/calculations/hybrid';

interface CalculatorState {
  // Input values
  initialMRR: number;
  mrrGrowthRate: number;
  projectRevenue: number;
  projectGrowthRate: number;
  churnRate: number;
  
  // Computed values
  projections: HybridProjection | null;
  
  // Actions
  updateField: (field: string, value: number) => void;
  calculate: () => void;
  reset: () => void;
  loadScenario: (scenario: Scenario) => void;
}

export const useCalculator = create<CalculatorState>()(
  persist(
    (set, get) => ({
      // Default values
      initialMRR: 100000,
      mrrGrowthRate: 0.15,
      projectRevenue: 50000,
      projectGrowthRate: 0.10,
      churnRate: 0.05,
      projections: null,
      
      updateField: (field, value) => {
        set({ [field]: value });
        get().calculate();
      },
      
      calculate: () => {
        const state = get();
        const projections = calculateHybridRevenue(
          {
            initial: state.initialMRR,
            growth: state.mrrGrowthRate,
            churn: state.churnRate,
          },
          {
            base: state.projectRevenue,
            growth: state.projectGrowthRate,
          }
        );
        set({ projections });
      },
      
      reset: () => {
        set({
          initialMRR: 100000,
          mrrGrowthRate: 0.15,
          projectRevenue: 50000,
          projectGrowthRate: 0.10,
          churnRate: 0.05,
          projections: null,
        });
      },
      
      loadScenario: (scenario) => {
        set({
          initialMRR: scenario.initial_mrr,
          mrrGrowthRate: scenario.mrr_growth_rate,
          projectRevenue: scenario.project_revenue,
          projectGrowthRate: scenario.project_growth_rate,
          churnRate: scenario.churn_rate,
        });
        get().calculate();
      },
    }),
    {
      name: 'calculator-storage',
      partialize: (state) => ({
        initialMRR: state.initialMRR,
        mrrGrowthRate: state.mrrGrowthRate,
        projectRevenue: state.projectRevenue,
        projectGrowthRate: state.projectGrowthRate,
        churnRate: state.churnRate,
      }),
    }
  )
);
```

### useScenarios.ts - Scenario Management
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { 
  getScenarios, 
  createScenario, 
  updateScenario, 
  deleteScenario 
} from '@/lib/supabase/queries/scenarios';

export function useScenarios() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch all scenarios
  const { data: scenarios, isLoading, error } = useQuery({
    queryKey: ['scenarios', userId],
    queryFn: () => getScenarios(userId!),
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
  });
  
  // Create scenario mutation
  const createMutation = useMutation({
    mutationFn: createScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', userId] });
    },
    onError: (error) => {
      console.error('Failed to create scenario:', error);
    },
  });
  
  // Update scenario mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Scenario> }) =>
      updateScenario(id, updates),
    onMutate: async ({ id, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['scenarios', userId] });
      const previousScenarios = queryClient.getQueryData(['scenarios', userId]);
      
      queryClient.setQueryData(['scenarios', userId], (old: Scenario[]) =>
        old.map(s => s.id === id ? { ...s, ...updates } : s)
      );
      
      return { previousScenarios };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['scenarios', userId], context?.previousScenarios);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', userId] });
    },
  });
  
  // Delete scenario mutation
  const deleteMutation = useMutation({
    mutationFn: deleteScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', userId] });
    },
  });
  
  return {
    scenarios: scenarios || [],
    isLoading,
    error,
    createScenario: createMutation.mutate,
    updateScenario: updateMutation.mutate,
    deleteScenario: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
```

### useActuals.ts - Actual Revenue Tracking
```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import { getActuals, saveActuals } from '@/lib/supabase/queries/actuals';

export function useActuals(scenarioId: string) {
  // Fetch actuals for scenario
  const { data: actuals, isLoading } = useQuery({
    queryKey: ['actuals', scenarioId],
    queryFn: () => getActuals(scenarioId),
    enabled: !!scenarioId,
  });
  
  // Save actuals mutation
  const saveMutation = useMutation({
    mutationFn: saveActuals,
    onSuccess: () => {
      // Invalidate both actuals and scenarios (for variance calc)
      queryClient.invalidateQueries({ queryKey: ['actuals', scenarioId] });
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
    },
  });
  
  // Calculate variance from forecast
  const calculateVariance = useCallback((month: number) => {
    if (!actuals || !actuals[month]) return null;
    
    const actual = actuals[month];
    const forecast = projections[month];
    
    return {
      mrrVariance: (actual.mrr_actual - forecast.mrrRevenue) / forecast.mrrRevenue,
      projectVariance: (actual.project_actual - forecast.projectRevenue) / forecast.projectRevenue,
    };
  }, [actuals, projections]);
  
  return {
    actuals: actuals || [],
    isLoading,
    saveActuals: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    calculateVariance,
  };
}
```

### useDebounce.ts - Input Debouncing
```typescript
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage in component
export function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  // API call only fires after user stops typing
  useEffect(() => {
    if (debouncedSearch) {
      searchScenarios(debouncedSearch);
    }
  }, [debouncedSearch]);
}
```

### useLocalStorage.ts - Persistent Local State
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get from local storage then parse
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  
  const [storedValue, setStoredValue] = useState<T>(readValue);
  
  // Return a wrapped version of useState's setter
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  // Sync with other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);
  
  return [storedValue, setValue];
}
```

### useMediaQuery.ts - Responsive Design
```typescript
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatch = () => setMatches(media.matches);
    
    updateMatch();
    
    if (media.addEventListener) {
      media.addEventListener('change', updateMatch);
      return () => media.removeEventListener('change', updateMatch);
    } else {
      // Fallback for older browsers
      media.addListener(updateMatch);
      return () => media.removeListener(updateMatch);
    }
  }, [query]);
  
  return matches;
}

// Preset breakpoints
export const useBreakpoint = () => ({
  isMobile: useMediaQuery('(max-width: 640px)'),
  isTablet: useMediaQuery('(min-width: 641px) and (max-width: 1024px)'),
  isDesktop: useMediaQuery('(min-width: 1025px)'),
});
```

### useToast.ts - Notification System
```typescript
import { create } from 'zustand';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 5000);
    }
  },
  
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function useToast() {
  const { addToast, removeToast, toasts } = useToastStore();
  
  return {
    toasts,
    toast: {
      success: (title: string, description?: string) =>
        addToast({ title, description, type: 'success' }),
      error: (title: string, description?: string) =>
        addToast({ title, description, type: 'error' }),
      warning: (title: string, description?: string) =>
        addToast({ title, description, type: 'warning' }),
      info: (title: string, description?: string) =>
        addToast({ title, description, type: 'info' }),
    },
    dismiss: removeToast,
  };
}
```

### useExport.ts - Data Export
```typescript
import { useCallback } from 'react';
import { formatCurrency } from '@/lib/utils/format';

export function useExport() {
  const exportToCSV = useCallback((data: any[], filename: string) => {
    // Convert data to CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(v => 
        typeof v === 'string' ? `"${v}"` : v
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);
  
  const exportToJSON = useCallback((data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);
  
  const exportChart = useCallback((chartRef: React.RefObject<any>, filename: string) => {
    if (!chartRef.current) return;
    
    // Use recharts export functionality
    const svg = chartRef.current.container.children[0];
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  }, []);
  
  return {
    exportToCSV,
    exportToJSON,
    exportChart,
  };
}
```

### useAnalytics.ts - Event Tracking
```typescript
import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function useAnalytics() {
  const { userId } = useAuth();
  
  const track = useCallback((event: string, properties?: Record<string, any>) => {
    // Send to analytics service (e.g., Mixpanel, Amplitude)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        user_id: userId,
        ...properties,
      });
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event, properties);
    }
  }, [userId]);
  
  const page = useCallback((path: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_path: path,
        user_id: userId,
      });
    }
  }, [userId]);
  
  // Preset events
  const events = {
    calculatorUsed: (params: any) => track('calculator_used', params),
    scenarioCreated: (name: string) => track('scenario_created', { name }),
    scenarioDeleted: () => track('scenario_deleted'),
    actualsUpdated: (month: number) => track('actuals_updated', { month }),
    exportCompleted: (format: string) => track('export_completed', { format }),
    conversionGoal: () => track('conversion_goal_reached'),
  };
  
  return {
    track,
    page,
    events,
  };
}
```

## Hook Patterns

### Composition Pattern
```typescript
// Combine multiple hooks for complex logic
export function useScenarioWithActuals(scenarioId: string) {
  const scenario = useScenario(scenarioId);
  const actuals = useActuals(scenarioId);
  const calculator = useCalculator();
  
  useEffect(() => {
    if (scenario.data) {
      calculator.loadScenario(scenario.data);
    }
  }, [scenario.data]);
  
  return {
    scenario: scenario.data,
    actuals: actuals.data,
    projections: calculator.projections,
    isLoading: scenario.isLoading || actuals.isLoading,
  };
}
```

### Factory Pattern
```typescript
// Create specialized hooks from generic ones
export function createResourceHook<T>(
  resourceName: string,
  fetcher: () => Promise<T>
) {
  return function useResource() {
    return useQuery({
      queryKey: [resourceName],
      queryFn: fetcher,
    });
  };
}

// Usage
export const useCompanyMetrics = createResourceHook(
  'company-metrics',
  getCompanyMetrics
);
```

## Connections to Other Parts

### Uses lib/
- Database queries from `lib/supabase`
- Calculations from `lib/calculations`
- Utilities from `lib/utils`
- Types from `lib/types`

### Used by components/
- Calculator components use `useCalculator`
- Dashboard uses `useScenarios`
- Forms use `useDebounce`
- Layouts use `useAuth`

### Integration with app/
- Pages use hooks for data fetching
- API routes share logic via hooks
- Layouts use auth and theme hooks

## Testing Hooks

### Test Setup
```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

### Hook Tests
```typescript
describe('useCalculator', () => {
  it('updates projections when fields change', () => {
    const { result } = renderHook(() => useCalculator());
    
    act(() => {
      result.current.updateField('initialMRR', 200000);
    });
    
    expect(result.current.projections).toBeDefined();
    expect(result.current.projections.summary.totalRevenue).toBeGreaterThan(4800000);
  });
});

describe('useDebounce', () => {
  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'initial' } }
    );
    
    expect(result.current).toBe('initial');
    
    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');
    
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });
});
```

## Best Practices

1. Keep hooks focused on single responsibility
2. Always clean up side effects
3. Memoize expensive computations
4. Handle loading and error states
5. Provide TypeScript types for return values
6. Test hooks in isolation
7. Document complex logic
8. Use proper dependency arrays