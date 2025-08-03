# lib/ Directory Guide

## Purpose
The lib directory contains all business logic, utilities, and external service integrations. This is where the core revenue calculation engine lives, separated from UI concerns.

## Directory Structure

```
lib/
├── calculations/       # Revenue modeling engine
├── supabase/          # Database client and queries
├── clerk/             # Authentication utilities
├── utils/             # Helper functions
├── constants/         # App-wide constants
├── types/             # Shared TypeScript types
└── validation/        # Input validation schemas
```

## Core Modules

### Calculations (`calculations/`)
The heart of the revenue modeling system.

#### mrr.ts - Monthly Recurring Revenue
```typescript
export function calculateMRR(
  initialMRR: number,
  growthRate: number,
  churnRate: number,
  months: number
): MonthlyMRR[] {
  // Compound growth formula
  // MRR(n) = MRR(n-1) * (1 + growthRate - churnRate)
  const effectiveGrowth = growthRate - churnRate;
  const results: MonthlyMRR[] = [];
  
  let currentMRR = initialMRR;
  for (let month = 0; month < months; month++) {
    results.push({
      month,
      mrr: currentMRR,
      newMRR: currentMRR * growthRate,
      churnedMRR: currentMRR * churnRate,
    });
    currentMRR *= (1 + effectiveGrowth);
  }
  
  return results;
}
```

#### projects.ts - One-Time Project Revenue
```typescript
export function calculateProjects(
  baseRevenue: number,
  growthRate: number,
  months: number
): MonthlyProjects[] {
  // Linear growth (non-compounding)
  // Projects(n) = baseRevenue * (1 + growthRate * n)
  return Array.from({ length: months }, (_, month) => ({
    month,
    revenue: baseRevenue * (1 + growthRate * month),
    count: Math.floor(baseRevenue / AVG_PROJECT_SIZE),
  }));
}
```

#### hybrid.ts - Combined Revenue Model
```typescript
export function calculateHybridRevenue(
  mrrParams: MRRParams,
  projectParams: ProjectParams,
  months = 24
): HybridProjection {
  const mrrData = calculateMRR(
    mrrParams.initial,
    mrrParams.growth,
    mrrParams.churn,
    months
  );
  
  const projectData = calculateProjects(
    projectParams.base,
    projectParams.growth,
    months
  );
  
  // Combine both revenue streams
  const combined = mrrData.map((mrr, index) => ({
    month: mrr.month,
    totalRevenue: mrr.mrr + projectData[index].revenue,
    mrrRevenue: mrr.mrr,
    projectRevenue: projectData[index].revenue,
    cumulativeRevenue: calculateCumulative(mrr, projectData, index),
  }));
  
  return {
    projections: combined,
    summary: calculateSummaryMetrics(combined),
  };
}
```

#### metrics.ts - Key Performance Indicators
```typescript
export function calculateMetrics(projection: HybridProjection) {
  return {
    totalRevenue: sum(projection.projections, 'totalRevenue'),
    avgMonthlyGrowth: calculateCAGR(projection.projections),
    mrrMultiple: projection.projections[23].mrrRevenue / projection.projections[0].mrrRevenue,
    projectsShare: calculateRevenueShare(projection.projections),
    runway: calculateRunway(projection.projections),
  };
}
```

### Database (`supabase/`)
Supabase client configuration and query functions.

#### client.ts - Database Connection
```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side client with service role
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

#### queries/scenarios.ts - Scenario CRUD
```typescript
export async function getScenarios(userId: string) {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function createScenario(scenario: ScenarioInput) {
  const { data, error } = await supabase
    .from('scenarios')
    .insert(scenario)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateScenario(id: string, updates: Partial<Scenario>) {
  const { data, error } = await supabase
    .from('scenarios')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
```

#### queries/actuals.ts - Actual Revenue Tracking
```typescript
export async function saveActuals(actuals: ActualsInput) {
  const { error } = await supabase
    .from('actuals')
    .upsert(actuals, {
      onConflict: 'scenario_id,month'
    });
    
  if (error) throw error;
}

export async function getActuals(scenarioId: string) {
  const { data, error } = await supabase
    .from('actuals')
    .select('*')
    .eq('scenario_id', scenarioId)
    .order('month');
    
  if (error) throw error;
  return data;
}
```

### Authentication (`clerk/`)
Clerk integration and auth utilities.

#### config.ts - Clerk Setup
```typescript
import { ClerkProvider } from '@clerk/nextjs';

export const clerkConfig = {
  appearance: {
    baseTheme: dark,
    variables: {
      colorPrimary: '#EF476F',
      colorBackground: '#2B2D42',
    },
  },
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/onboarding',
};
```

#### webhooks.ts - User Sync
```typescript
export async function handleUserCreated(user: ClerkUser) {
  // Sync new Clerk user to Supabase
  await supabaseAdmin
    .from('users')
    .insert({
      clerk_id: user.id,
      email: user.emailAddresses[0].emailAddress,
      created_at: new Date().toISOString(),
    });
}

export async function handleUserUpdated(user: ClerkUser) {
  await supabaseAdmin
    .from('users')
    .update({
      email: user.emailAddresses[0].emailAddress,
    })
    .eq('clerk_id', user.id);
}
```

### Utilities (`utils/`)
Helper functions used throughout the app.

#### format.ts - Data Formatting
```typescript
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatCompact(value: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });
  return formatter.format(value);
}
```

#### cn.ts - Class Name Helper
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### date.ts - Date Utilities
```typescript
export function getMonthName(monthIndex: number): string {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
```

### Constants (`constants/`)
Application-wide configuration.

#### business.ts - Business Rules
```typescript
export const BUSINESS_CONSTANTS = {
  DEFAULT_MRR: 100000,
  DEFAULT_GROWTH_RATE: 0.15,
  DEFAULT_CHURN_RATE: 0.05,
  DEFAULT_PROJECT_REVENUE: 50000,
  AVG_PROJECT_SIZE: 25000,
  PROJECTION_MONTHS: 24,
  TARGET_CONVERSION_RATE: 0.15,
  MIN_ARR: 1000000,
  MAX_ARR: 5000000,
};
```

#### validation.ts - Input Constraints
```typescript
export const VALIDATION_RULES = {
  mrr: {
    min: 0,
    max: 10000000,
  },
  growthRate: {
    min: -0.5,
    max: 2.0,
  },
  churnRate: {
    min: 0,
    max: 0.5,
  },
};
```

### Validation (`validation/`)
Input validation schemas using Zod.

#### schemas.ts - Data Validation
```typescript
import { z } from 'zod';

export const ScenarioSchema = z.object({
  name: z.string().min(1).max(100),
  initialMRR: z.number().min(0).max(10000000),
  mrrGrowthRate: z.number().min(-0.5).max(2),
  projectRevenue: z.number().min(0).max(10000000),
  projectGrowthRate: z.number().min(-0.5).max(2),
  churnRate: z.number().min(0).max(0.5),
});

export const ActualsSchema = z.object({
  scenarioId: z.string().uuid(),
  month: z.number().min(0).max(23),
  mrrActual: z.number().min(0),
  projectActual: z.number().min(0),
});
```

## Connections to Other Parts

### Used by app/
- API routes use database queries
- Pages use calculations for SSR
- Layouts use auth utilities

### Used by components/
- Calculator uses calculation engine
- Charts format data with utils
- Forms use validation schemas

### Used by hooks/
- Custom hooks wrap database queries
- State management uses calculations
- Auth hooks use Clerk utilities

## Testing Strategy

### Unit Tests
```typescript
// calculations/mrr.test.ts
describe('calculateMRR', () => {
  it('compounds growth correctly', () => {
    const result = calculateMRR(100000, 0.1, 0.02, 12);
    expect(result[11].mrr).toBeCloseTo(221671);
  });
});
```

### Integration Tests
```typescript
// supabase/queries.test.ts
describe('Scenario queries', () => {
  it('creates and retrieves scenarios', async () => {
    const scenario = await createScenario(mockScenario);
    const retrieved = await getScenario(scenario.id);
    expect(retrieved).toEqual(scenario);
  });
});
```

## Performance Considerations

### Memoization
```typescript
// Expensive calculations are memoized
export const calculateProjections = memoize(
  (params: ProjectionParams) => calculateHybridRevenue(params),
  (params) => JSON.stringify(params)
);
```

### Batch Operations
```typescript
// Batch database operations
export async function upsertMultipleActuals(actuals: ActualsInput[]) {
  const { error } = await supabase
    .from('actuals')
    .upsert(actuals);
  
  if (error) throw error;
}
```

### Caching
```typescript
// Cache expensive queries
const CACHE_TTL = 60 * 1000; // 1 minute
const scenarioCache = new Map();

export async function getCachedScenario(id: string) {
  const cached = scenarioCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await getScenario(id);
  scenarioCache.set(id, { data, timestamp: Date.now() });
  return data;
}
```

## Error Handling

### Custom Errors
```typescript
export class CalculationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'CalculationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}
```

### Error Recovery
```typescript
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}
```

## Best Practices

1. Pure functions for calculations
2. Single responsibility per module
3. Comprehensive error handling
4. Type safety with TypeScript
5. Validate all external inputs
6. Cache expensive operations
7. Use environment variables for config
8. Document complex algorithms