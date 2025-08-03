'use client';

import React from 'react';
import { useCalculatorStore } from '@/stores/calculator';
import { formatRevenue, formatPercentage } from '@/lib/calculations/hybrid';
import { TrendingUp, DollarSign, PieChart, Target } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  delay?: string;
}

function MetricCard({ label, value, icon, trend, delay = '0s' }: MetricCardProps) {
  return (
    <div 
      className="metric-card animate-slide-up" 
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="metric-label">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="metric-value text-gradient">{value}</div>
      {trend && (
        <div className="text-sm text-muted-foreground mt-1">{trend}</div>
      )}
    </div>
  );
}

export function MetricsDisplay() {
  const { results } = useCalculatorStore();

  if (!results || !results.metrics) {
    return null;
  }

  const { metrics } = results;

  return (
    <div className="space-y-6">
      <h3 className="section-title">Key Performance Indicators</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Projected ARR (12 mo)"
          value={formatRevenue(metrics.projectedARR)}
          icon={<Target className="w-5 h-5" />}
          trend="Annual Recurring Revenue"
          delay="0s"
        />
        
        <MetricCard
          label="Total Revenue (24 mo)"
          value={formatRevenue(metrics.totalRevenue24Months)}
          icon={<DollarSign className="w-5 h-5" />}
          trend="Combined all revenue streams"
          delay="0.1s"
        />
        
        <MetricCard
          label="Revenue Mix"
          value={`${formatPercentage(metrics.recurringPercentage)} Recurring`}
          icon={<PieChart className="w-5 h-5" />}
          trend={`${formatPercentage(metrics.projectPercentage)} Projects`}
          delay="0.2s"
        />
        
        <MetricCard
          label="Monthly Growth Rate"
          value={formatPercentage(metrics.monthlyGrowthRate)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="Compound monthly growth"
          delay="0.3s"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          label="12-Month Revenue"
          value={formatRevenue(metrics.totalRevenue12Months)}
          icon={<DollarSign className="w-5 h-5" />}
          trend="Next 12 months total"
          delay="0.4s"
        />
        
        <MetricCard
          label="Current Run Rate"
          value={formatRevenue(metrics.currentRunRate)}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="Annualized current revenue"
          delay="0.5s"
        />
      </div>
    </div>
  );
}