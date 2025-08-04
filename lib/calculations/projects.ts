export function calculateProjectRevenue(
  baseRevenue: number,
  growthRate: number,
  month: number
): number {
  const monthlyGrowth = (growthRate / 100) / 12
  return baseRevenue * (1 + monthlyGrowth * month)
}

export function calculateProjectGrowth(
  previousRevenue: number,
  currentRevenue: number
): number {
  return currentRevenue - previousRevenue
}