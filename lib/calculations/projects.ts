import { ProjectRevenueInputs } from '@/types/revenue';

export interface ProjectCalculation {
  month: number;
  newProjects: number;
  revenue: number;
  averageValue: number;
  pipelineValue: number;
}

export function calculateProjectRevenue(
  inputs: ProjectRevenueInputs,
  months: number
): ProjectCalculation[] {
  const results: ProjectCalculation[] = [];
  
  // Calculate closing delay impact (convert days to month fraction)
  const closeDelayMonths = inputs.averageTimeToClose / 30;
  
  for (let month = 1; month <= months; month++) {
    // Projects grow linearly, not compounding
    // Each month gets the same number of new projects
    const newProjects = inputs.newProjectsPerMonth;
    
    // Revenue recognition might be delayed based on time to close
    const effectiveMonth = Math.max(1, month - Math.floor(closeDelayMonths));
    
    // Linear growth - project value may increase over time but doesn't compound
    const averageValue = inputs.averageProjectValue;
    
    // Monthly project revenue (linear, non-compounding)
    const revenue = newProjects * averageValue;
    
    // Pipeline value (future revenue in closing process)
    const pipelineValue = newProjects * averageValue * (closeDelayMonths);
    
    results.push({
      month,
      newProjects,
      revenue,
      averageValue,
      pipelineValue
    });
  }
  
  return results;
}

export function calculateTotalProjectRevenue(
  projections: ProjectCalculation[]
): number {
  return projections.reduce((sum, month) => sum + month.revenue, 0);
}

export function calculateAverageProjectSize(
  projections: ProjectCalculation[]
): number {
  const totalRevenue = calculateTotalProjectRevenue(projections);
  const totalProjects = projections.reduce((sum, month) => sum + month.newProjects, 0);
  return totalProjects > 0 ? totalRevenue / totalProjects : 0;
}