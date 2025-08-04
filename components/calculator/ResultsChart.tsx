'use client'

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { MonthlyRevenue } from '@/types/revenue'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ResultsChartProps {
  data: MonthlyRevenue[]
}

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  mrr: {
    label: "MRR",
    color: "#ef4444", // Bright red - primary brand color
  },
  projectRevenue: {
    label: "Projects", 
    color: "#8b5a3c", // Rich brown/taupe
  },
} satisfies ChartConfig

export default function ResultsChart({ data }: ResultsChartProps) {
  const [timeRange, setTimeRange] = React.useState("24m")

  // Debug: Log sample calculation
  React.useEffect(() => {
    if (data && data.length > 0) {
      const firstMonth = data[0]
      const lastMonth = data[data.length - 1]
      console.log('Month 1:', { mrr: firstMonth.mrr, projects: firstMonth.projectRevenue, total: firstMonth.totalRevenue })
      console.log('Month 24:', { mrr: lastMonth.mrr, projects: lastMonth.projectRevenue, total: lastMonth.totalRevenue })
    }
  }, [data])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value)
  }

  const filteredData = React.useMemo(() => {
    if (!data) return []
    
    let monthsToShow = 24
    if (timeRange === "12m") {
      monthsToShow = 12
    } else if (timeRange === "6m") {
      monthsToShow = 6
    }
    
    return data.slice(0, monthsToShow)
  }, [data, timeRange])

  const totalRevenue = React.useMemo(() => {
    return filteredData.reduce((sum, month) => sum + month.totalRevenue, 0)
  }, [filteredData])

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Revenue Projection</CardTitle>
          <CardDescription>
            Hybrid revenue forecast showing MRR growth and project revenue
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select timeframe"
          >
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="24m" className="rounded-lg">
              Next 24 months
            </SelectItem>
            <SelectItem value="12m" className="rounded-lg">
              Next 12 months
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Next 6 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart 
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="fillMRR" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="#ef4444"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="#ef4444"
                  stopOpacity={0.2}
                />
              </linearGradient>
              <linearGradient id="fillProjects" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="#8b5a3c"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="#8b5a3c"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              stroke="hsl(var(--border))"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              fontSize={12}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: any) => value}
                  formatter={(value: any, name: any) => [
                    `${formatCurrency(Number(value))} `,
                    chartConfig[name as keyof typeof chartConfig]?.label || name,
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="projectRevenue"
              type="monotone"
              fill="url(#fillProjects)"
              stroke="#8b5a3c"
              strokeWidth={2}
              stackId="1"
              fillOpacity={1}
            />
            <Area
              dataKey="mrr"
              type="monotone"
              fill="url(#fillMRR)"
              stroke="#ef4444"
              strokeWidth={2}
              stackId="1"
              fillOpacity={1}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
          <span>Total projected revenue ({timeRange})</span>
          <span className="font-medium text-foreground">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}