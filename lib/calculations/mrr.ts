export function calculateMRR(
  initialMRR: number,
  growthRate: number,
  churnRate: number,
  month: number
): number {
  if (month === 0) return initialMRR
  const netGrowthRate = (growthRate - churnRate) / 100
  return initialMRR * Math.pow(1 + netGrowthRate, month)
}

export function calculateMRRGrowth(
  previousMRR: number,
  currentMRR: number
): number {
  return currentMRR - previousMRR
}