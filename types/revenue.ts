export interface RecurringRevenueInputs {
  currentMRR: number;
  newCustomersPerMonth: number;
  averageMRRPerCustomer: number;
  monthlyGrowthFromExisting: number;
  monthlyChurnRate: number;
}

export interface ProjectRevenueInputs {
  newProjectsPerMonth: number;
  averageProjectValue: number;
  averageTimeToClose: number;
}

export interface RevenueInputs {
  recurring: RecurringRevenueInputs;
  projects: ProjectRevenueInputs;
  projectionMonths: number;
}

export interface MonthlyProjection {
  month: number;
  monthLabel: string;
  existingMRR: number;
  newMRR: number;
  totalMRR: number;
  projectRevenue: number;
  totalRevenue: number;
  cumulativeRevenue: number;
}

export interface RevenueMetrics {
  projectedARR: number;
  totalRevenue12Months: number;
  totalRevenue24Months: number;
  recurringPercentage: number;
  projectPercentage: number;
  monthlyGrowthRate: number;
  currentRunRate: number;
}

export interface CalculationResult {
  projections: MonthlyProjection[];
  metrics: RevenueMetrics;
}

export interface TooltipContent {
  title: string;
  description: string;
  redSovereignService?: string;
  ctaText?: string;
}