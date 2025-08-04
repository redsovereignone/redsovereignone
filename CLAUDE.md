# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Red Sovereign Growth Dashboard

## Project Overview
A sophisticated B2B SaaS lead generation tool that models hybrid revenue (recurring + one-time) for companies $1M-$5M ARR. This is a high-conversion interactive dashboard serving as the primary entry point for Red Sovereign's sales funnel.

## Current Development Status 🚀

### ✅ Completed Features
- **Core Calculator**: Fully functional revenue modeling with MRR and project revenue
- **Navigation System**: Fixed header with dashboard button and user profile menu
- **Authentication**: Clerk integration with sign-in/sign-up flows
- **Settings Pages**: Complete user settings system (profile, account, billing, preferences)
- **Database Integration**: Supabase tables for users and scenarios
- **Responsive Design**: Mobile-optimized with hamburger menu
- **Glass Panel UI**: Consistent design system across all components
- **Deployment**: Live on Vercel with CI/CD from GitHub

### 🔄 In Progress / Needs Attention
- **Scenario Saving**: Backend API exists but needs frontend integration
- **Actuals Tracking**: Database schema ready, UI components pending
- **Data Export**: Placeholder buttons ready, implementation needed
- **Comparison View**: ScenarioList component exists, needs comparison logic

### 🎯 Priority Next Steps

#### 1. Complete Scenario Saving Flow
```typescript
// In SaveScenarioModal.tsx, add:
const handleSave = async () => {
  const response = await fetch('/api/scenarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: scenarioName,
      ...calculatorState
    })
  })
  // Handle response, close modal, redirect to dashboard
}
```

#### 2. Implement Actuals vs Forecast
```typescript
// Create new component: components/dashboard/ActualsTracker.tsx
// Add form for monthly actual inputs
// Store in 'actuals' table with scenario_id reference
// Display variance chart comparing actuals vs projections
```

#### 3. Enable Data Export
```typescript
// Create new API route: app/api/export/route.ts
// Generate CSV from scenario data
// Use libraries: 'papaparse' for CSV, 'jspdf' for PDF
// Add download buttons to dashboard
```

#### 4. Add Comparison Features
```typescript
// Enhance ScenarioList.tsx with:
// - Checkbox selection for comparison
// - Side-by-side metrics display
// - Difference highlighting
// - Sensitivity sliders for what-if analysis
```

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Auth**: Clerk (configured and working)
- **Database**: Supabase (tables created, RLS disabled for dev)
- **Charts**: Recharts (area charts implemented)
- **Styling**: Tailwind CSS + custom glass panel design
- **State**: Zustand (calculator store configured)
- **UI Components**: Radix UI primitives
- **Deployment**: Vercel (auto-deploy from main branch)

## Quick Start for Continuing Development

```bash
# Dependencies are already installed, just run:
npm run dev

# Before committing, always run:
npm run lint:fix
npm run type-check
npm run build

# Common commands
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Test production build
npm run lint:fix     # Fix linting issues
npm run type-check   # Check TypeScript types
```

## Key Files for Continuation

### Most Important Files to Understand
1. **`components/calculator/Calculator.tsx`** - Main calculator component, handles all revenue modeling
2. **`stores/calculator.ts`** - Zustand store for calculator state management
3. **`app/(auth)/dashboard/page.tsx`** - Dashboard entry point, shows user's scenarios
4. **`lib/calculations/hybrid.ts`** - Core revenue calculation logic
5. **`components/layout/Navigation.tsx`** - Main navigation header component
6. **`app/api/scenarios/route.ts`** - API for saving/loading scenarios

### Files That Need Work
1. **`components/calculator/SaveScenarioModal.tsx`** - Needs API connection
2. **`components/dashboard/ScenarioList.tsx`** - Needs delete/edit functionality
3. **`app/api/scenarios/[id]/route.ts`** - Update/delete endpoints need testing
4. **Export functionality** - No files exist yet, needs creation

### Configuration Files
- **`.env.local`** - All environment variables (DO NOT commit)
- **`middleware.ts`** - Clerk auth middleware configuration
- **`tailwind.config.ts`** - Custom colors and theme configuration
- **`tsconfig.json`** - TypeScript configuration

## Project Architecture

### Directory Structure
```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authenticated routes group
│   │   ├── dashboard/       # Main dashboard page
│   │   └── scenarios/       # Scenario management
│   ├── (public)/            # Public routes group
│   │   └── calculator/      # Public revenue calculator
│   ├── api/                 # API routes
│   │   ├── auth/           # Clerk webhooks
│   │   └── scenarios/      # CRUD endpoints
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Landing page
├── components/
│   ├── calculator/         # Revenue calculator components
│   │   ├── InputPanel.tsx
│   │   ├── ResultsChart.tsx
│   │   └── MetricsDisplay.tsx
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── ScenarioList.tsx
│   │   ├── ComparisonView.tsx
│   │   └── ActualsTracker.tsx
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── calculations/       # Revenue calculation engine
│   │   ├── mrr.ts         # MRR compound calculations
│   │   ├── projects.ts    # Linear project revenue
│   │   └── hybrid.ts      # Combined model logic
│   ├── supabase/          # Database client & queries
│   └── clerk/             # Auth configuration
├── stores/                 # Zustand state management
│   └── calculator.ts       # Calculator state
├── types/                  # TypeScript definitions
│   ├── revenue.ts         # Revenue model types
│   └── database.ts        # Supabase schema types
└── styles/
    └── globals.css        # Global styles & Tailwind
```

### Key Architecture Patterns

#### 1. Revenue Calculation Engine (`lib/calculations/`)
The calculation engine is the core business logic, separated from UI:
- `mrr.ts`: Handles monthly recurring revenue with compound growth
- `projects.ts`: Manages one-time project revenue (linear, non-compounding)
- `hybrid.ts`: Combines both models with churn applied only to recurring

#### 2. State Management (Zustand)
Calculator state is managed globally for consistency across components:
- Input values persist during navigation
- Results are computed reactively
- Scenarios can be saved to/loaded from database

#### 3. Database Schema (Supabase)
```sql
-- Core tables structure
scenarios (
  id, user_id, name, created_at, updated_at,
  initial_mrr, mrr_growth_rate, project_revenue,
  project_growth_rate, churn_rate
)

actuals (
  id, scenario_id, month, mrr_actual, 
  project_actual, created_at
)

users (
  id, clerk_id, email, created_at
)
```

#### 4. Auth Flow (Clerk)
- Public calculator requires no authentication
- Account creation triggered after first calculation
- Dashboard access requires authentication
- Clerk webhook syncs users to Supabase

#### 5. Component Patterns
- Server Components for initial data fetching
- Client Components for interactivity (calculator, charts)
- Streaming SSR for dashboard data
- Optimistic updates for scenario management

## Business Context
- Target: B2B founders facing scaling challenges
- Goal: 15% conversion from app user to Strategy Sprint signup
- Success Metric: >200 new accounts in 6 months

## Design System
- Background: Navy #2B2D42
- Primary: Coral-Red #EF476F
- Text: Off-white #F5F5F5
- Font: Inter (Bold for headers, Regular for body)
- Aesthetic: High-tech "Command Center" - sophisticated, data-driven, minimalist but bold

## Core Features
1. Public Revenue Modeler (no auth required)
2. Unified dashboard for hybrid revenue models
3. Save/load multiple growth scenarios
4. Actual vs forecast tracking
5. Contextual tooltips linking to Red Sovereign services

## Key User Flows
1. First Visit → Model Revenue → See Results → Create Account
2. Return User → Login → Dashboard → Update Actuals → Compare Performance
3. Power User → Create Scenarios → Compare Models → Export Insights

## Calculation Engine Rules
- MRR compounds monthly
- Project revenue is linear (non-compounding)
- Churn affects recurring only
- 24-month projection window

## Environment Variables
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Known Issues & Solutions

### Common Development Issues
1. **Port 3000 in use**: Kill process with `lsof -ti:3000 | xargs kill -9`
2. **Build errors**: Run `npm run lint:fix` then `npm run build`
3. **Supabase connection**: Check `.env.local` has all required keys
4. **Clerk auth issues**: Verify webhook secret is configured

### Testing Checklist
- [ ] Calculator saves scenarios correctly
- [ ] Dashboard displays user's scenarios
- [ ] Settings pages load without errors
- [ ] Mobile navigation works properly
- [ ] Chart tooltips show correct formatting
- [ ] Sign in/out flow works smoothly

## Development Workflow

### Adding New Features
1. **Plan First**: Update this CLAUDE.md with the feature plan
2. **Create Branch**: Work on feature branches when possible
3. **Test Locally**: Always run `npm run build` before pushing
4. **Document**: Update relevant documentation
5. **Deploy**: Push to main for auto-deployment to Vercel

### Code Quality Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **Components**: Prefer composition, keep under 200 lines
- **Styling**: Use Tailwind classes, maintain glass panel aesthetic
- **State**: Use Zustand for global, useState for local
- **API**: Keep routes simple, handle errors properly

## Important Links & Resources
- **Live Site**: https://redsovereignone.vercel.app
- **Supabase Dashboard**: Check project for URL
- **Clerk Dashboard**: https://clerk.com
- **GitHub Repo**: https://github.com/redsovereignone/redsovereignone

## Contact & Support
For questions about continuing development:
1. Review this CLAUDE.md first
2. Check TROUBLESHOOTING.md for common issues
3. Look at existing patterns in codebase
4. Maintain consistency with established patterns