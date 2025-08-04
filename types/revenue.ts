export interface RevenueInputs {
  initialMRR: number
  mrrGrowthRate: number
  projectRevenue: number
  projectGrowthRate: number
  churnRate: number
}

export interface MonthlyRevenue {
  month: number
  monthLabel: string
  mrr: number
  projectRevenue: number
  totalRevenue: number
  cumulativeRevenue: number
  mrrGrowth: number
  projectGrowth: number
}

export interface RevenueMetrics {
  totalRevenue24Months: number
  averageMonthlyRevenue: number
  endingMRR: number
  endingProjectRevenue: number
  effectiveGrowthRate: number
  mrrContribution: number
  projectContribution: number
}

export interface RevenueProjection {
  months: MonthlyRevenue[]
  metrics: RevenueMetrics
}

export interface TooltipContent {
  title: string;
  description: string;
  redSovereignService?: string;
  ctaText?: string;
}