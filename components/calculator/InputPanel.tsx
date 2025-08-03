'use client';

import React from 'react';
import { useCalculatorStore } from '@/stores/calculator';
import { HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

function InputField({ 
  label, 
  value, 
  onChange, 
  tooltip, 
  prefix = '', 
  suffix = '',
  min = 0,
  max,
  step = 1
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="input-label">{label}</label>
        {tooltip && (
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="tooltip-trigger">
                  <HelpCircle className="w-3 h-3" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-50 max-w-xs rounded-lg bg-muted border border-border px-3 py-2 text-sm text-foreground shadow-xl"
                  sideOffset={5}
                >
                  {tooltip}
                  <Tooltip.Arrow className="fill-muted" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`input-field ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''}`}
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function InputPanel() {
  const { inputs, updateRecurringInputs, updateProjectInputs, updateProjectionMonths } = useCalculatorStore();

  return (
    <div className="space-y-8">
      {/* Recurring Revenue Module */}
      <div className="glass-panel p-6 space-y-4 animate-slide-up">
        <h3 className="section-title text-primary">Recurring Revenue Engine</h3>
        
        <InputField
          label="Current Monthly Recurring Revenue (MRR)"
          value={inputs.recurring.currentMRR}
          onChange={(value) => updateRecurringInputs({ currentMRR: value })}
          prefix="$"
          tooltip="Your existing monthly recurring revenue from all active subscriptions and contracts. This compounds monthly."
          step={1000}
        />
        
        <InputField
          label="New Customers per Month"
          value={inputs.recurring.newCustomersPerMonth}
          onChange={(value) => updateRecurringInputs({ newCustomersPerMonth: value })}
          tooltip="Average number of new recurring customers you acquire each month. Connect with The Meeting Machine™ to increase this."
          min={0}
          max={100}
        />
        
        <InputField
          label="Average MRR per New Customer"
          value={inputs.recurring.averageMRRPerCustomer}
          onChange={(value) => updateRecurringInputs({ averageMRRPerCustomer: value })}
          prefix="$"
          tooltip="Average monthly revenue per new customer. Higher-value contracts drive exponential growth."
          step={100}
        />
        
        <InputField
          label="Monthly Growth from Existing Customers"
          value={inputs.recurring.monthlyGrowthFromExisting}
          onChange={(value) => updateRecurringInputs({ monthlyGrowthFromExisting: value })}
          suffix="%"
          tooltip="Expansion revenue from upsells and cross-sells to existing customers. Key to net negative churn."
          min={0}
          max={20}
          step={0.5}
        />
        
        <InputField
          label="Monthly Churn Rate"
          value={inputs.recurring.monthlyChurnRate}
          onChange={(value) => updateRecurringInputs({ monthlyChurnRate: value })}
          suffix="%"
          tooltip="Percentage of MRR lost each month from cancellations. Industry average is 3-5% monthly."
          min={0}
          max={20}
          step={0.5}
        />
      </div>

      {/* One-Time Projects Module */}
      <div className="glass-panel p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="section-title text-accent">One-Time Projects Engine</h3>
        
        <InputField
          label="New Projects per Month"
          value={inputs.projects.newProjectsPerMonth}
          onChange={(value) => updateProjectInputs({ newProjectsPerMonth: value })}
          tooltip="Number of one-time projects or engagements closed monthly. These don't compound but provide cash flow."
          min={0}
          max={50}
        />
        
        <InputField
          label="Average Project Value"
          value={inputs.projects.averageProjectValue}
          onChange={(value) => updateProjectInputs({ averageProjectValue: value })}
          prefix="$"
          tooltip="Average revenue per project. Focus on high-value strategic engagements for better margins."
          step={1000}
        />
        
        <InputField
          label="Average Time to Close"
          value={inputs.projects.averageTimeToClose}
          onChange={(value) => updateProjectInputs({ averageTimeToClose: value })}
          suffix="days"
          tooltip="Average days from initial contact to signed contract. Shorter cycles improve cash flow."
          min={1}
          max={180}
        />
      </div>

      {/* Projection Settings */}
      <div className="glass-panel p-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="section-title">Projection Settings</h3>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => updateProjectionMonths(12)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              inputs.projectionMonths === 12
                ? 'bg-primary text-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            12 Months
          </button>
          <button
            onClick={() => updateProjectionMonths(24)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              inputs.projectionMonths === 24
                ? 'bg-primary text-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            24 Months
          </button>
        </div>
      </div>
    </div>
  );
}