# app/ Directory Guide

## Purpose
The app directory is the heart of the Next.js 14 App Router, containing all routes, layouts, and API endpoints. It uses file-based routing where folder structure directly maps to URL paths.

## Directory Structure

### Route Groups
- `(public)/` - Unauthenticated routes accessible to all visitors
- `(auth)/` - Protected routes requiring Clerk authentication

### Key Files
- `layout.tsx` - Root layout wrapping all pages with providers
- `page.tsx` - Landing page (/)
- `globals.css` - Global styles and Tailwind imports

## Routing Patterns

### Public Routes
```
(public)/
├── calculator/page.tsx     # /calculator - Public revenue modeler
├── about/page.tsx         # /about - Company information
└── pricing/page.tsx       # /pricing - Service tiers
```

### Authenticated Routes
```
(auth)/
├── dashboard/
│   ├── page.tsx           # /dashboard - Main dashboard view
│   ├── loading.tsx        # Loading state with skeleton
│   └── error.tsx          # Error boundary
├── scenarios/
│   ├── page.tsx           # /scenarios - List all scenarios
│   ├── [id]/page.tsx      # /scenarios/[id] - Single scenario
│   └── new/page.tsx       # /scenarios/new - Create scenario
└── settings/page.tsx      # /settings - User preferences
```

### API Routes
```
api/
├── auth/
│   └── webhook/route.ts   # Clerk webhook handler
├── scenarios/
│   ├── route.ts           # GET all, POST new scenario
│   └── [id]/route.ts      # GET, PUT, DELETE single scenario
└── actuals/
    └── route.ts           # POST actual revenue data
```

## Key Functions

### Layout (layout.tsx)
- Wraps all pages with ClerkProvider
- Includes global navigation
- Sets up font (Inter) and metadata
- Initializes analytics tracking

### Landing Page (page.tsx)
- Hero section with value proposition
- CTA to public calculator
- Social proof and testimonials
- Links to Red Sovereign services

### Calculator Page ((public)/calculator/page.tsx)
- Server component for initial render
- Imports client-side Calculator component
- No auth required
- Conversion tracking on first calculation

### Dashboard ((auth)/dashboard/page.tsx)
- Server component with data fetching
- Streams scenarios from Supabase
- Shows comparison view of scenarios
- Links to actuals tracking

## Data Fetching Patterns

### Server Components (Default)
```typescript
// app/(auth)/dashboard/page.tsx
export default async function DashboardPage() {
  const user = await currentUser(); // Clerk
  const scenarios = await getScenarios(user.id); // Supabase
  
  return <DashboardView scenarios={scenarios} />;
}
```

### Client Components (Interactive)
```typescript
// app/(public)/calculator/page.tsx
import Calculator from '@/components/calculator/Calculator';

export default function CalculatorPage() {
  return <Calculator />; // Client component for interactivity
}
```

### API Routes (REST)
```typescript
// app/api/scenarios/route.ts
export async function GET(request: Request) {
  const { userId } = auth(); // Clerk auth
  const scenarios = await supabase
    .from('scenarios')
    .select('*')
    .eq('user_id', userId);
  
  return Response.json(scenarios);
}
```

## Connections to Other Parts

### Imports from lib/
- `lib/supabase` - Database client
- `lib/clerk` - Auth helpers
- `lib/calculations` - Revenue math

### Uses components/
- `components/ui` - Shared UI elements
- `components/calculator` - Calculator features
- `components/dashboard` - Dashboard widgets

### Consumed by hooks/
- `useAuth` - Gets user from Clerk
- `useScenarios` - Fetches via API routes
- `useCalculator` - Accesses calculator state

## Authentication Flow

1. Public pages check for existing auth
2. If authenticated, show personalized CTAs
3. Protected routes use Clerk middleware
4. API routes verify auth before processing
5. Webhook syncs Clerk users to Supabase

## Performance Optimizations

### Streaming SSR
```typescript
// Use Suspense for progressive rendering
<Suspense fallback={<ScenarioSkeleton />}>
  <ScenarioList />
</Suspense>
```

### Static Generation
```typescript
// Pre-render marketing pages
export const dynamic = 'force-static';
```

### Dynamic Imports
```typescript
// Load heavy components only when needed
const Chart = dynamic(() => import('@/components/ResultsChart'));
```

## Error Handling

### Error Boundaries
Each route group has error.tsx for graceful failures

### Loading States
loading.tsx files provide instant feedback

### Not Found
not-found.tsx for 404 handling

## Best Practices

1. Keep page.tsx files thin - delegate to components
2. Use Server Components by default
3. Add 'use client' only when needed
4. Colocate API routes with features
5. Group related routes with (folders)
6. Stream data for better perceived performance
7. Implement proper error boundaries
8. Use TypeScript for all files