import { RecurringRevenueInputs } from '@/types/revenue';

export interface MRRCalculation {
  month: number;
  existingMRR: number;
  newMRR: number;
  expansionMRR: number;
  churnedMRR: number;
  totalMRR: number;
  netNewMRR: number;
}

export function calculateMRR(
  inputs: RecurringRevenueInputs,
  months: number
): MRRCalculation[] {
  const results: MRRCalculation[] = [];
  let currentMRR = inputs.currentMRR;
  
  for (let month = 1; month <= months; month++) {
    // Calculate new MRR from new customers
    const newMRR = inputs.newCustomersPerMonth * inputs.averageMRRPerCustomer;
    
    // Calculate expansion MRR from existing customers (compounds on current base)
    const expansionMRR = currentMRR * (inputs.monthlyGrowthFromExisting / 100);
    
    // Calculate churned MRR (applies to current base)
    const churnedMRR = currentMRR * (inputs.monthlyChurnRate / 100);
    
    // Calculate net new MRR
    const netNewMRR = newMRR + expansionMRR - churnedMRR;
    
    // Update total MRR (compounds monthly)
    currentMRR = currentMRR + netNewMRR;
    
    results.push({
      month,
      existingMRR: month === 1 ? inputs.currentMRR : results[month - 2].totalMRR,
      newMRR,
      expansionMRR,
      churnedMRR,
      totalMRR: Math.max(0, currentMRR),
      netNewMRR
    });
  }
  
  return results;
}

export function calculateARR(mrr: number): number {
  return mrr * 12;
}

export function calculateGrowthRate(
  startValue: number,
  endValue: number,
  periods: number
): number {
  if (startValue <= 0 || periods <= 0) return 0;
  const growthMultiple = endValue / startValue;
  return (Math.pow(growthMultiple, 1 / periods) - 1) * 100;
}