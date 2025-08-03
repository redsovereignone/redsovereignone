'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useCalculatorStore } from '@/stores/calculator';
import { formatRevenue } from '@/lib/calculations/hybrid';

export function ResultsChart() {
  const { results } = useCalculatorStore();

  if (!results || !results.projections) {
    return (
      <div className="chart-container h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading projections...</p>
      </div>
    );
  }

  // Transform data for stacked area chart
  const chartData = results.projections.map((month) => ({
    month: month.monthLabel,
    'Existing MRR': month.existingMRR,
    'New Recurring': month.newMRR,
    'Project Revenue': month.projectRevenue,
    total: month.totalRevenue,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-muted/95 backdrop-blur-md border border-border rounded-lg p-4 shadow-xl">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatRevenue(entry.value)}
            </p>
          ))}
          <p className="text-sm font-semibold text-foreground mt-2 pt-2 border-t border-border">
            Total: {formatRevenue(total)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container animate-fade-in">
      <h3 className="section-title mb-6">Revenue Projection</h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorExisting" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C71F37" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#C71F37" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF476F" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF476F" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
          <XAxis 
            dataKey="month" 
            stroke="#B8B9C3"
            tick={{ fill: '#B8B9C3', fontSize: 12 }}
          />
          <YAxis 
            stroke="#B8B9C3"
            tick={{ fill: '#B8B9C3', fontSize: 12 }}
            tickFormatter={(value) => formatRevenue(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          <Area
            type="monotone"
            dataKey="Existing MRR"
            stackId="1"
            stroke="#C71F37"
            fill="url(#colorExisting)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="New Recurring"
            stackId="1"
            stroke="#EF476F"
            fill="url(#colorNew)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Project Revenue"
            stackId="1"
            stroke="#F59E0B"
            fill="url(#colorProjects)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}