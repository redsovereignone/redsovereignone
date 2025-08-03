import { 
  RevenueInputs, 
  MonthlyProjection, 
  RevenueMetrics, 
  CalculationResult 
} from '@/types/revenue';
import { calculateMRR, calculateARR, calculateGrowthRate } from './mrr';
import { calculateProjectRevenue } from './projects';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function calculateHybridRevenue(inputs: RevenueInputs): CalculationResult {
  // Calculate MRR projections (compound growth)
  const mrrProjections = calculateMRR(inputs.recurring, inputs.projectionMonths);
  
  // Calculate project revenue projections (linear growth)
  const projectProjections = calculateProjectRevenue(inputs.projects, inputs.projectionMonths);
  
  // Combine into monthly projections
  const projections: MonthlyProjection[] = [];
  let cumulativeRevenue = 0;
  
  const currentDate = new Date();
  
  for (let i = 0; i < inputs.projectionMonths; i++) {
    const mrr = mrrProjections[i];
    const project = projectProjections[i];
    
    // Calculate month label
    const monthIndex = (currentDate.getMonth() + i) % 12;
    const yearOffset = Math.floor((currentDate.getMonth() + i) / 12);
    const year = currentDate.getFullYear() + yearOffset;
    const monthLabel = `${MONTHS[monthIndex]} ${year}`;
    
    // Calculate total revenue for the month
    const totalRevenue = mrr.totalMRR + project.revenue;
    cumulativeRevenue += totalRevenue;
    
    projections.push({
      month: i + 1,
      monthLabel,
      existingMRR: mrr.existingMRR,
      newMRR: mrr.newMRR + mrr.expansionMRR,
      totalMRR: mrr.totalMRR,
      projectRevenue: project.revenue,
      totalRevenue,
      cumulativeRevenue
    });
  }
  
  // Calculate metrics
  const metrics = calculateMetrics(projections, inputs);
  
  return {
    projections,
    metrics
  };
}

function calculateMetrics(
  projections: MonthlyProjection[], 
  inputs: RevenueInputs
): RevenueMetrics {
  // Get values at specific time points
  const month12 = projections[11] || projections[projections.length - 1];
  const month24 = projections[23] || projections[projections.length - 1];
  const lastMonth = projections[projections.length - 1];
  
  // Calculate total revenues
  const totalRevenue12Months = projections
    .slice(0, 12)
    .reduce((sum, month) => sum + month.totalRevenue, 0);
    
  const totalRevenue24Months = projections
    .reduce((sum, month) => sum + month.totalRevenue, 0);
  
  // Calculate revenue composition
  const totalMRR24 = projections.reduce((sum, month) => sum + month.totalMRR, 0);
  const totalProjects24 = projections.reduce((sum, month) => sum + month.projectRevenue, 0);
  const totalRevenue = totalMRR24 + totalProjects24;
  
  const recurringPercentage = totalRevenue > 0 ? (totalMRR24 / totalRevenue) * 100 : 0;
  const projectPercentage = totalRevenue > 0 ? (totalProjects24 / totalRevenue) * 100 : 0;
  
  // Calculate growth rate
  const startMRR = inputs.recurring.currentMRR;
  const endMRR = lastMonth.totalMRR;
  const monthlyGrowthRate = calculateGrowthRate(startMRR, endMRR, projections.length);
  
  // Calculate ARR and run rate
  const projectedARR = calculateARR(month12.totalMRR);
  const currentRunRate = calculateARR(projections[0].totalMRR + projections[0].projectRevenue);
  
  return {
    projectedARR,
    totalRevenue12Months,
    totalRevenue24Months,
    recurringPercentage,
    projectPercentage,
    monthlyGrowthRate,
    currentRunRate
  };
}

export function formatRevenue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}