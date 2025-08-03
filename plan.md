# Red Sovereign Growth Dashboard - Implementation Plan

## Overview
This plan breaks down the implementation into PR-sized chunks (~200 lines each), ordered by dependencies, with clear test requirements and GitHub issue templates.

## Phase 1: Foundation & Setup

### PR-1: Project Initialization & Core Setup
**Size:** ~150 lines  
**Dependencies:** None  
**Branch:** `feat/project-setup`

#### Files:
- `package.json` - Dependencies & scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind setup with design system colors
- `.env.example` - Environment variable template
- `src/styles/globals.css` - Global styles & Tailwind imports
- `src/app/layout.tsx` - Root layout with basic providers
- `src/app/page.tsx` - Placeholder landing page

#### Tests Required:
- Build passes without errors
- Development server starts successfully
- TypeScript compilation succeeds
- Tailwind classes apply correctly

#### GitHub Issue:
```markdown
## Issue: Project Initialization & Core Setup

### Description
Set up the foundational Next.js 14 project with TypeScript, Tailwind CSS, and basic configuration.

### Acceptance Criteria
- [ ] Next.js 14 app with App Router configured
- [ ] TypeScript setup with strict mode
- [ ] Tailwind CSS with custom design system colors
- [ ] ESLint and Prettier configured
- [ ] Environment variable template created
- [ ] Development server runs without errors

### Technical Requirements
- Next.js 14 with App Router
- TypeScript with strict configuration
- Tailwind CSS with Inter font
- Design system colors: Navy (#2B2D42), Coral-Red (#EF476F), Off-white (#F5F5F5)

### Testing
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
```

---

### PR-2: Type System & Data Models
**Size:** ~180 lines  
**Dependencies:** PR-1  
**Branch:** `feat/type-system`

#### Files:
- `src/types/revenue.ts` - Revenue calculation types
- `src/types/database.ts` - Database schema types
- `src/types/auth.ts` - Authentication types
- `src/types/index.ts` - Re-exports

#### Tests Required:
- Type definitions compile without errors
- No circular dependencies
- All required fields defined

#### GitHub Issue:
```markdown
## Issue: Type System & Data Models

### Description
Define TypeScript interfaces and types for the entire application, establishing the data model foundation.

### Acceptance Criteria
- [ ] Revenue calculation types (MRR, projects, hybrid)
- [ ] Database schema types (scenarios, actuals, users)
- [ ] Authentication types (user, session)
- [ ] Input validation types
- [ ] Chart/visualization data types

### Technical Requirements
- Strict TypeScript types
- No `any` types allowed
- Proper enum definitions for status/state
- Zod schemas for runtime validation (optional)

### Testing
- [ ] TypeScript compilation succeeds
- [ ] No type errors in IDE
- [ ] Types properly exported and importable
```

---

## Phase 2: Core Business Logic

### PR-3: Revenue Calculation Engine
**Size:** ~200 lines  
**Dependencies:** PR-2  
**Branch:** `feat/calculation-engine`

#### Files:
- `src/lib/calculations/mrr.ts` - MRR compound growth calculations
- `src/lib/calculations/projects.ts` - Linear project revenue
- `src/lib/calculations/hybrid.ts` - Combined model with churn
- `src/lib/calculations/index.ts` - Exported calculation functions
- `src/lib/calculations/__tests__/calculations.test.ts` - Unit tests

#### Tests Required:
- MRR compounds correctly month-over-month
- Project revenue grows linearly
- Churn applies only to recurring revenue
- 24-month projections accurate
- Edge cases handled (negative growth, 100% churn)

#### GitHub Issue:
```markdown
## Issue: Revenue Calculation Engine

### Description
Implement the core business logic for hybrid revenue calculations (MRR + Projects).

### Acceptance Criteria
- [ ] MRR calculation with compound growth
- [ ] Project revenue with linear growth
- [ ] Churn applied only to recurring revenue
- [ ] 24-month projection capability
- [ ] Handles edge cases (0 values, negative growth)

### Business Rules
- MRR compounds monthly: `new_mrr = current_mrr * (1 + growth_rate) * (1 - churn_rate)`
- Projects are linear: `new_projects = current_projects * (1 + growth_rate)`
- Churn affects MRR only, not project revenue
- All calculations return monthly breakdowns for 24 months

### Testing
- [ ] Unit tests for each calculation function
- [ ] Test compound vs linear growth differences
- [ ] Test churn application
- [ ] Test edge cases (0%, 100%, negative rates)
- [ ] Performance test for 24-month calculations
```

---

### PR-4: Zustand State Management
**Size:** ~150 lines  
**Dependencies:** PR-3  
**Branch:** `feat/state-management`

#### Files:
- `src/stores/calculator.ts` - Calculator state & actions
- `src/stores/scenarios.ts` - Scenario management state
- `src/stores/index.ts` - Store exports
- `src/hooks/useCalculator.ts` - Calculator hook
- `src/stores/__tests__/stores.test.ts` - Store tests

#### Tests Required:
- State updates trigger recalculations
- Input validation works
- State persists correctly
- Reset functionality works

#### GitHub Issue:
```markdown
## Issue: Zustand State Management

### Description
Implement global state management for calculator inputs and results using Zustand.

### Acceptance Criteria
- [ ] Calculator state with input fields
- [ ] Computed results based on inputs
- [ ] Scenario comparison state
- [ ] Persistent state across navigation
- [ ] Reset and clear functions

### Technical Requirements
- Zustand for state management
- TypeScript types for all state
- Computed values update reactively
- LocalStorage persistence (optional)

### Testing
- [ ] State updates correctly
- [ ] Calculations trigger on input change
- [ ] State persists during navigation
- [ ] Reset clears all values
```

---

## Phase 3: Database & Authentication

### PR-5: Supabase Database Setup
**Size:** ~180 lines  
**Dependencies:** PR-2  
**Branch:** `feat/database-setup`

#### Files:
- `src/lib/supabase/client.ts` - Supabase client configuration
- `src/lib/supabase/server.ts` - Server-side client
- `src/lib/supabase/queries.ts` - Database queries
- `supabase/migrations/001_initial_schema.sql` - Database schema
- `src/lib/supabase/types.ts` - Generated types

#### Tests Required:
- Database connection works
- Tables created successfully
- Queries execute without errors
- RLS policies work correctly

#### GitHub Issue:
```markdown
## Issue: Supabase Database Setup

### Description
Set up Supabase database with schema for scenarios, actuals, and users.

### Acceptance Criteria
- [ ] Database schema created (scenarios, actuals, users)
- [ ] Supabase client configured for browser and server
- [ ] CRUD operations for scenarios
- [ ] Query functions for dashboard data
- [ ] Row Level Security (RLS) policies

### Database Schema
- scenarios: id, user_id, name, params, created_at, updated_at
- actuals: id, scenario_id, month, mrr_actual, project_actual
- users: id, clerk_id, email, created_at

### Testing
- [ ] Database migrations run successfully
- [ ] CRUD operations work
- [ ] RLS prevents unauthorized access
- [ ] Queries return expected data
```

---

### PR-6: Clerk Authentication Integration
**Size:** ~150 lines  
**Dependencies:** PR-5  
**Branch:** `feat/auth-integration`

#### Files:
- `src/lib/clerk/config.ts` - Clerk configuration
- `src/middleware.ts` - Auth middleware
- `src/app/api/auth/webhook/route.ts` - Clerk webhook for user sync
- `src/components/auth/SignInButton.tsx` - Sign in component
- `src/components/auth/UserButton.tsx` - User menu component

#### Tests Required:
- Authentication flow works
- Protected routes redirect correctly
- User sync to database works
- Sign out clears session

#### GitHub Issue:
```markdown
## Issue: Clerk Authentication Integration

### Description
Integrate Clerk for authentication with user sync to Supabase.

### Acceptance Criteria
- [ ] Clerk SDK integrated
- [ ] Sign in/up flows working
- [ ] Protected route middleware
- [ ] Webhook syncs users to Supabase
- [ ] User menu with sign out

### Technical Requirements
- Clerk Next.js SDK
- Webhook endpoint for user events
- Middleware for route protection
- User sync to Supabase on signup

### Testing
- [ ] Sign up creates Clerk and Supabase user
- [ ] Sign in redirects to dashboard
- [ ] Protected routes require auth
- [ ] Sign out clears session
```

---

## Phase 4: UI Components

### PR-7: Calculator UI Components
**Size:** ~200 lines  
**Dependencies:** PR-4  
**Branch:** `feat/calculator-ui`

#### Files:
- `src/components/calculator/InputPanel.tsx` - Input form
- `src/components/calculator/InputField.tsx` - Reusable input
- `src/components/calculator/MetricsDisplay.tsx` - Key metrics
- `src/components/calculator/CalculatorContainer.tsx` - Main container
- `src/components/ui/Card.tsx` - Reusable card component

#### Tests Required:
- Input validation works
- State updates on input change
- Responsive design works
- Accessibility standards met

#### GitHub Issue:
```markdown
## Issue: Calculator UI Components

### Description
Build the interactive calculator interface with input fields and metrics display.

### Acceptance Criteria
- [ ] Input fields for all parameters
- [ ] Real-time validation
- [ ] Responsive design (mobile-first)
- [ ] Metrics cards showing key results
- [ ] Loading states for calculations

### UI Requirements
- Navy background (#2B2D42)
- Coral-Red accents (#EF476F)
- Inter font (Bold headers, Regular body)
- Accessible form inputs with labels
- Mobile-responsive layout

### Testing
- [ ] Component renders without errors
- [ ] Input validation works
- [ ] State updates correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
```

---

### PR-8: Data Visualization Components
**Size:** ~200 lines  
**Dependencies:** PR-7  
**Branch:** `feat/charts`

#### Files:
- `src/components/calculator/ResultsChart.tsx` - Main revenue chart
- `src/components/calculator/ChartControls.tsx` - Chart options
- `src/components/calculator/ChartTooltip.tsx` - Custom tooltip
- `src/components/calculator/ComparisonChart.tsx` - Scenario comparison
- `src/lib/chart-utils.ts` - Chart data formatting

#### Tests Required:
- Charts render with data
- Responsive sizing works
- Tooltips show correct values
- Chart controls work

#### GitHub Issue:
```markdown
## Issue: Data Visualization Components

### Description
Implement Recharts-based visualization for revenue projections.

### Acceptance Criteria
- [ ] Line chart for 24-month projection
- [ ] Stacked area for MRR vs Projects
- [ ] Interactive tooltips
- [ ] Legend and controls
- [ ] Responsive chart sizing

### Chart Requirements
- Recharts library
- MRR and Project revenue lines
- Total revenue area
- Custom styled tooltips
- Mobile-responsive

### Testing
- [ ] Charts render with sample data
- [ ] Tooltips display correct values
- [ ] Charts responsive to window resize
- [ ] Performance with 24 data points
```

---

## Phase 5: Pages & Routes

### PR-9: Public Calculator Page
**Size:** ~180 lines  
**Dependencies:** PR-7, PR-8  
**Branch:** `feat/public-calculator`

#### Files:
- `src/app/(public)/calculator/page.tsx` - Calculator page
- `src/app/(public)/calculator/layout.tsx` - Calculator layout
- `src/components/calculator/CTASection.tsx` - Call-to-action
- `src/components/calculator/SaveScenarioModal.tsx` - Save modal

#### Tests Required:
- Page renders without auth
- Calculator fully functional
- CTA triggers auth flow
- Save requires authentication

#### GitHub Issue:
```markdown
## Issue: Public Calculator Page

### Description
Create the public-facing revenue calculator page with conversion CTA.

### Acceptance Criteria
- [ ] Public access (no auth required)
- [ ] Full calculator functionality
- [ ] Results visualization
- [ ] CTA to create account after calculation
- [ ] Save scenario triggers auth

### Conversion Flow
1. User models revenue
2. Sees impressive results
3. CTA: "Save & Track Your Growth"
4. Auth modal/redirect
5. Scenario saved to account

### Testing
- [ ] Page accessible without login
- [ ] Calculator works end-to-end
- [ ] CTA prominent after calculation
- [ ] Auth flow from CTA works
```

---

### PR-10: Dashboard Page
**Size:** ~200 lines  
**Dependencies:** PR-6, PR-9  
**Branch:** `feat/dashboard`

#### Files:
- `src/app/(auth)/dashboard/page.tsx` - Dashboard page
- `src/app/(auth)/dashboard/layout.tsx` - Auth layout
- `src/components/dashboard/ScenarioList.tsx` - Saved scenarios
- `src/components/dashboard/QuickStats.tsx` - Overview metrics
- `src/components/dashboard/NewScenarioButton.tsx` - Create new

#### Tests Required:
- Authentication required
- Scenarios load from database
- Create/edit/delete work
- Responsive layout

#### GitHub Issue:
```markdown
## Issue: Dashboard Page

### Description
Build the authenticated dashboard for managing saved scenarios.

### Acceptance Criteria
- [ ] Protected route (auth required)
- [ ] Lists user's saved scenarios
- [ ] Quick stats overview
- [ ] Create new scenario
- [ ] Edit/delete scenarios

### Dashboard Features
- Scenario cards with key metrics
- Last updated timestamps
- Quick actions (edit, compare, delete)
- New scenario button
- Search/filter (stretch goal)

### Testing
- [ ] Requires authentication
- [ ] Loads user's scenarios
- [ ] CRUD operations work
- [ ] Responsive design
- [ ] Loading states
```

---

## Phase 6: Advanced Features

### PR-11: Scenario Comparison
**Size:** ~180 lines  
**Dependencies:** PR-10  
**Branch:** `feat/scenario-comparison`

#### Files:
- `src/app/(auth)/scenarios/compare/page.tsx` - Comparison page
- `src/components/dashboard/ComparisonView.tsx` - Comparison UI
- `src/components/dashboard/ScenarioSelector.tsx` - Scenario picker
- `src/components/dashboard/ComparisonMetrics.tsx` - Metrics table

#### Tests Required:
- Multiple scenarios load
- Comparison calculations correct
- Chart shows all scenarios
- Responsive design

#### GitHub Issue:
```markdown
## Issue: Scenario Comparison Feature

### Description
Enable side-by-side comparison of multiple growth scenarios.

### Acceptance Criteria
- [ ] Select 2-3 scenarios to compare
- [ ] Side-by-side metrics
- [ ] Overlaid projection charts
- [ ] Difference calculations
- [ ] Export comparison (stretch)

### Comparison Features
- Scenario selector (checkbox)
- Metrics comparison table
- Multi-line chart
- Best/worst case highlighting

### Testing
- [ ] Can select multiple scenarios
- [ ] Comparison calculations correct
- [ ] Chart displays all lines
- [ ] Responsive layout
```

---

### PR-12: Actuals Tracking
**Size:** ~200 lines  
**Dependencies:** PR-10  
**Branch:** `feat/actuals-tracking`

#### Files:
- `src/app/(auth)/scenarios/[id]/actuals/page.tsx` - Actuals page
- `src/components/dashboard/ActualsTracker.tsx` - Input form
- `src/components/dashboard/VarianceChart.tsx` - Actual vs forecast
- `src/components/dashboard/ActualsTable.tsx` - Historical data
- `src/app/api/scenarios/[id]/actuals/route.ts` - API endpoint

#### Tests Required:
- Actuals save to database
- Variance calculations correct
- Chart shows both lines
- API endpoints work

#### GitHub Issue:
```markdown
## Issue: Actuals Tracking Feature

### Description
Add ability to track actual revenue against projections.

### Acceptance Criteria
- [ ] Input actual MRR and project revenue
- [ ] Store monthly actuals
- [ ] Calculate variance from forecast
- [ ] Visualize actual vs projected
- [ ] Trend analysis

### Tracking Features
- Monthly actual input form
- Historical actuals table
- Variance calculations
- Actual vs Forecast chart
- Performance indicators

### Testing
- [ ] Actuals save correctly
- [ ] Variance math accurate
- [ ] Chart shows both datasets
- [ ] Historical data loads
- [ ] API validation works
```

---

## Phase 7: Polish & Optimization

### PR-13: Landing Page & Marketing
**Size:** ~180 lines  
**Dependencies:** PR-9  
**Branch:** `feat/landing-page`

#### Files:
- `src/app/page.tsx` - Landing page
- `src/components/landing/Hero.tsx` - Hero section
- `src/components/landing/Features.tsx` - Feature cards
- `src/components/landing/Testimonials.tsx` - Social proof
- `src/components/landing/CTASection.tsx` - Bottom CTA

#### Tests Required:
- Page loads quickly
- All links work
- Responsive design
- SEO meta tags present

#### GitHub Issue:
```markdown
## Issue: Landing Page & Marketing

### Description
Create high-converting landing page for the calculator app.

### Acceptance Criteria
- [ ] Compelling hero section
- [ ] Clear value proposition
- [ ] Feature highlights
- [ ] Social proof section
- [ ] Multiple CTAs to calculator

### Landing Page Copy
- Headline: "Model Your Path to $5M ARR"
- Subhead: "The hybrid revenue calculator built for B2B founders"
- Features: MRR + Projects, 24-month view, Save scenarios
- CTA: "Start Modeling Free"

### Testing
- [ ] Page loads in <3s
- [ ] All CTAs work
- [ ] Mobile responsive
- [ ] SEO tags present
- [ ] Analytics tracking
```

---

### PR-14: Performance & SEO
**Size:** ~150 lines  
**Dependencies:** All previous  
**Branch:** `feat/performance`

#### Files:
- `src/app/sitemap.ts` - Dynamic sitemap
- `src/app/robots.ts` - Robots.txt
- `next.config.js` - Performance optimizations
- `src/components/SEO.tsx` - SEO component
- Various page metadata updates

#### Tests Required:
- Lighthouse score >90
- Core Web Vitals pass
- Meta tags present
- Sitemap generates

#### GitHub Issue:
```markdown
## Issue: Performance & SEO Optimization

### Description
Optimize application performance and search engine visibility.

### Acceptance Criteria
- [ ] Lighthouse score >90
- [ ] Core Web Vitals passing
- [ ] Meta tags on all pages
- [ ] Dynamic sitemap
- [ ] Image optimization

### Optimizations
- Code splitting
- Image optimization
- Font optimization
- Meta tags and OG images
- Sitemap generation
- Analytics setup

### Testing
- [ ] Lighthouse audit passes
- [ ] Page load <3s
- [ ] SEO audit passes
- [ ] Images optimized
- [ ] No console errors
```

---

### PR-15: Testing & Documentation
**Size:** ~200 lines  
**Dependencies:** All previous  
**Branch:** `feat/testing`

#### Files:
- `jest.config.js` - Jest configuration
- `src/**/__tests__/*.test.ts` - Unit tests
- `cypress/e2e/*.cy.ts` - E2E tests
- `README.md` - User documentation
- `.github/workflows/ci.yml` - CI pipeline

#### Tests Required:
- Unit test coverage >80%
- E2E critical paths pass
- CI pipeline runs
- Documentation complete

#### GitHub Issue:
```markdown
## Issue: Testing & Documentation

### Description
Add comprehensive testing and documentation.

### Acceptance Criteria
- [ ] Unit tests for calculations
- [ ] Component tests for UI
- [ ] E2E tests for critical flows
- [ ] CI/CD pipeline
- [ ] README documentation

### Test Coverage
- Calculation engine: 100%
- Components: 80%
- API routes: 90%
- E2E: Critical paths

### Testing
- [ ] Jest tests pass
- [ ] Cypress tests pass
- [ ] CI pipeline green
- [ ] Coverage >80%
- [ ] Docs complete
```

---

## Deployment Timeline

### Week 1-2: Foundation
- PR-1: Project Setup
- PR-2: Type System
- PR-3: Calculation Engine
- PR-4: State Management

### Week 3-4: Infrastructure
- PR-5: Database Setup
- PR-6: Authentication
- PR-7: Calculator UI
- PR-8: Charts

### Week 5-6: Core Features
- PR-9: Public Calculator
- PR-10: Dashboard
- PR-11: Comparison
- PR-12: Actuals Tracking

### Week 7-8: Polish & Launch
- PR-13: Landing Page
- PR-14: Performance
- PR-15: Testing

## Success Metrics
- [ ] Public calculator converts at >15%
- [ ] Dashboard loads in <2s
- [ ] Mobile responsive
- [ ] 200+ accounts in 6 months
- [ ] Zero critical bugs in production

## Risk Mitigation
1. **Database costs**: Monitor Supabase usage, implement caching
2. **Authentication issues**: Clerk fallback to email/password
3. **Performance**: Implement code splitting, lazy loading
4. **Browser compatibility**: Test on Chrome, Safari, Firefox, Edge
5. **Mobile experience**: Mobile-first design, touch optimizations

## Notes
- Each PR should include its own tests
- Features can be feature-flagged for gradual rollout
- Database migrations should be reversible
- Performance monitoring from day 1
- User feedback loop established early