import { RevenueInputs, RevenueProjection, MonthlyRevenue, RevenueMetrics } from '@/types/revenue'
import { calculateMRR, calculateMRRGrowth } from './mrr'
import { calculateProjectRevenue, calculateProjectGrowth } from './projects'

export function calculateHybridRevenue(inputs: RevenueInputs): RevenueProjection {
  const months: MonthlyRevenue[] = []
  let cumulativeRevenue = 0
  
  for (let month = 0; month < 24; month++) {
    const mrr = calculateMRR(inputs.initialMRR, inputs.mrrGrowthRate, inputs.churnRate, month)
    const projectRevenue = calculateProjectRevenue(inputs.projectRevenue, inputs.projectGrowthRate, month)
    const totalRevenue = mrr + projectRevenue
    cumulativeRevenue += totalRevenue
    
    const previousMRR = month === 0 ? inputs.initialMRR : months[month - 1].mrr
    const previousProject = month === 0 ? inputs.projectRevenue : months[month - 1].projectRevenue
    
    months.push({
      month: month + 1,
      monthLabel: getMonthLabel(month),
      mrr,
      projectRevenue,
      totalRevenue,
      cumulativeRevenue,
      mrrGrowth: calculateMRRGrowth(previousMRR, mrr),
      projectGrowth: calculateProjectGrowth(previousProject, projectRevenue)
    })
  }
  
  const metrics = calculateMetrics(months, inputs)
  
  return {
    months,
    metrics
  }
}

function calculateMetrics(months: MonthlyRevenue[], inputs: RevenueInputs): RevenueMetrics {
  const totalRevenue24Months = months.reduce((sum, m) => sum + m.totalRevenue, 0)
  const totalMRR = months.reduce((sum, m) => sum + m.mrr, 0)
  const totalProjects = months.reduce((sum, m) => sum + m.projectRevenue, 0)
  
  return {
    totalRevenue24Months,
    averageMonthlyRevenue: totalRevenue24Months / 24,
    endingMRR: months[23].mrr,
    endingProjectRevenue: months[23].projectRevenue,
    effectiveGrowthRate: ((months[23].totalRevenue - months[0].totalRevenue) / months[0].totalRevenue) * 100,
    mrrContribution: (totalMRR / totalRevenue24Months) * 100,
    projectContribution: (totalProjects / totalRevenue24Months) * 100
  }
}

function getMonthLabel(monthIndex: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Calculate the target date by adding months
  const targetDate = new Date(currentYear, currentMonth + monthIndex + 1, 1)
  const targetMonth = targetDate.getMonth()
  const targetYear = targetDate.getFullYear()
  
  // For the first 12 months, just show the month
  // For months 13-24, show month + year to distinguish
  if (monthIndex >= 12) {
    return `${months[targetMonth]} ${targetYear}`
  }
  
  return months[targetMonth]
}