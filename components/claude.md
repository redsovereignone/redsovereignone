# components/ Directory Guide

## Purpose
The components directory contains all React components organized by feature and responsibility. Components follow a strict separation between presentational (UI) and container (feature) components.

## Directory Structure

```
components/
├── calculator/          # Revenue calculator feature
├── dashboard/          # Dashboard-specific components
├── ui/                 # Reusable design system components
├── charts/            # Data visualization components
└── layout/            # Navigation and layout components
```

## Component Categories

### UI Components (`ui/`)
Pure presentational components following the design system.

#### Core Components
- `Button.tsx` - Primary CTA with coral-red (#EF476F) accent
- `Card.tsx` - Navy (#2B2D42) containers with subtle borders
- `Input.tsx` - Form inputs with validation states
- `Modal.tsx` - Overlay dialogs for actions
- `Tooltip.tsx` - Contextual help linking to services

#### Design Tokens
```typescript
// ui/tokens.ts
export const colors = {
  background: '#2B2D42',  // Navy
  primary: '#EF476F',     // Coral-Red
  text: '#F5F5F5',        // Off-white
  muted: '#8B8C9A',       // Muted gray
  success: '#06D6A0',     // Teal
  warning: '#FFD166',     // Yellow
};
```

### Calculator Components (`calculator/`)
Interactive components for the revenue modeling tool.

#### InputPanel.tsx
```typescript
interface InputPanelProps {
  initialMRR: number;
  mrrGrowthRate: number;
  projectRevenue: number;
  projectGrowthRate: number;
  churnRate: number;
  onValueChange: (field: string, value: number) => void;
}
```
- Controlled inputs with Zustand state
- Real-time validation
- Tooltips explaining each metric
- Responsive grid layout

#### ResultsChart.tsx
```typescript
interface ResultsChartProps {
  data: MonthlyProjection[];
  showActuals?: boolean;
  comparisonData?: MonthlyProjection[];
}
```
- Recharts area chart implementation
- Dual axis for MRR and projects
- Interactive tooltips
- Export to PNG functionality

#### MetricsDisplay.tsx
```typescript
interface MetricsDisplayProps {
  totalRevenue: number;
  finalMRR: number;
  totalProjects: number;
  growthRate: number;
}
```
- Key metrics cards
- Animated number transitions
- Color coding for performance

### Dashboard Components (`dashboard/`)
Components for authenticated user experience.

#### ScenarioList.tsx
```typescript
interface ScenarioListProps {
  scenarios: Scenario[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}
```
- Virtualized list for performance
- Drag-to-reorder functionality
- Quick actions menu
- Search and filter

#### ComparisonView.tsx
```typescript
interface ComparisonViewProps {
  baseScenario: Scenario;
  compareScenarios: Scenario[];
}
```
- Side-by-side metrics
- Variance highlighting
- Export comparison report
- Share via link

#### ActualsTracker.tsx
```typescript
interface ActualsTrackerProps {
  scenarioId: string;
  month: number;
  onSave: (actuals: ActualsData) => void;
}
```
- Monthly input forms
- Progress indicators
- Variance from forecast
- Trend analysis

### Chart Components (`charts/`)
Reusable data visualization components.

#### LineChart.tsx
- Wrapper around Recharts LineChart
- Consistent styling with design system
- Responsive container
- Custom tooltips

#### BarChart.tsx
- Grouped/stacked bar options
- Animation on mount
- Click handlers for drilling down

#### SparkLine.tsx
- Minimal trend indicator
- Used in cards and lists
- No axes, pure trend

### Layout Components (`layout/`)
Application structure and navigation.

#### Navigation.tsx
```typescript
interface NavigationProps {
  user?: User;
  currentPath: string;
}
```
- Responsive header
- User menu with Clerk
- Mobile hamburger menu
- Active state indicators

#### Footer.tsx
- Links to Red Sovereign services
- Social proof metrics
- Newsletter signup
- Terms and privacy

## Component Patterns

### Composition Pattern
```typescript
// Complex components built from primitives
<Card>
  <Card.Header>
    <Card.Title>Revenue Forecast</Card.Title>
  </Card.Header>
  <Card.Body>
    <ResultsChart data={projections} />
  </Card.Body>
  <Card.Footer>
    <Button onClick={saveScenario}>Save Scenario</Button>
  </Card.Footer>
</Card>
```

### Render Props Pattern
```typescript
// Flexible rendering logic
<DataTable
  data={scenarios}
  renderRow={(scenario) => (
    <ScenarioRow 
      key={scenario.id}
      scenario={scenario}
      onEdit={handleEdit}
    />
  )}
/>
```

### Compound Components
```typescript
// Related components grouped together
<Tabs defaultValue="revenue">
  <Tabs.List>
    <Tabs.Tab value="revenue">Revenue</Tabs.Tab>
    <Tabs.Tab value="growth">Growth</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="revenue">
    <RevenueChart />
  </Tabs.Panel>
  <Tabs.Panel value="growth">
    <GrowthChart />
  </Tabs.Panel>
</Tabs>
```

## State Management

### Local State
- Use useState for UI-only state
- Form inputs before submission
- Toggle states (modals, dropdowns)

### Global State (Zustand)
- Calculator input values
- Current scenario selection
- User preferences

### Server State (React Query)
- Cached API responses
- Optimistic updates
- Background refetching

## Styling Approach

### Tailwind Classes
```typescript
// Consistent spacing and colors
<div className="bg-navy-900 p-6 rounded-lg border border-gray-800">
  <h2 className="text-xl font-bold text-off-white mb-4">
    Revenue Projections
  </h2>
</div>
```

### CSS Modules (Complex Components)
```typescript
// components/calculator/Calculator.module.css
.grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}
```

### Dynamic Styles
```typescript
// Conditional styling based on props
<div 
  className={cn(
    "px-4 py-2 rounded",
    variant === 'primary' && "bg-coral-red text-white",
    variant === 'secondary' && "bg-gray-800 text-gray-300"
  )}
>
```

## Connections to Other Parts

### Imports from lib/
- `lib/calculations` - Revenue math for charts
- `lib/utils` - Formatting, validation helpers
- `lib/constants` - Shared configuration

### Used by app/
- Page components import feature components
- Layouts use navigation components
- API routes return component-ready data

### Uses hooks/
- `useCalculator` - Calculator state
- `useScenarios` - Dashboard data
- `useDebounce` - Input optimization

## Testing Strategy

### Unit Tests
```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders with correct variant styles', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-coral-red');
  });
});
```

### Integration Tests
```typescript
// Calculator.test.tsx
describe('Calculator', () => {
  it('updates projections when inputs change', async () => {
    render(<Calculator />);
    fireEvent.change(screen.getByLabelText('Initial MRR'), {
      target: { value: '10000' }
    });
    await waitFor(() => {
      expect(screen.getByTestId('total-revenue')).toHaveTextContent('$240,000');
    });
  });
});
```

## Performance Optimizations

### Code Splitting
```typescript
// Lazy load heavy components
const ResultsChart = lazy(() => import('./ResultsChart'));
```

### Memoization
```typescript
// Prevent unnecessary re-renders
const MemoizedChart = memo(ResultsChart, (prev, next) => {
  return prev.data === next.data;
});
```

### Virtual Scrolling
```typescript
// Large lists use react-window
import { FixedSizeList } from 'react-window';
```

## Accessibility

### ARIA Labels
```typescript
<button
  aria-label="Save scenario"
  aria-pressed={isSaved}
>
```

### Keyboard Navigation
- Tab order management
- Focus trapping in modals
- Escape key handling

### Screen Reader Support
- Semantic HTML
- Live regions for updates
- Alt text for charts

## Best Practices

1. One component per file
2. Props interfaces always defined
3. Default props where sensible
4. Composition over inheritance
5. Extract business logic to hooks/lib
6. Keep components under 200 lines
7. Write stories for UI components
8. Test user interactions, not implementation