# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Red Sovereign Growth Dashboard

## Project Overview
A sophisticated B2B SaaS lead generation tool that models hybrid revenue (recurring + one-time) for companies $1M-$5M ARR. This is a high-conversion interactive dashboard serving as the primary entry point for Red Sovereign's sales funnel.

## Tech Stack
- Framework: Next.js 14 (App Router)
- Auth: Clerk
- Database: Supabase (PostgreSQL)
- Charts: Recharts
- Styling: Tailwind CSS
- State: Zustand
- Deployment: Vercel

## Development Commands

### Initial Setup
```bash
# Create Next.js project (if not initialized)
npx create-next-app@latest . --typescript --tailwind --app --eslint

# Install dependencies
npm install

# Install additional packages
npm install @clerk/nextjs @supabase/supabase-js recharts zustand
npm install -D @types/node
```

### Common Commands
```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix auto-fixable lint issues
npm run type-check   # Run TypeScript compiler check

# Testing (once configured)
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
```

## Project Architecture

### Directory Structure
```
src/
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

## Development Status
Current Sprint: Foundation & Public Dashboard
Next Milestone: Public calculator live