'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestDB() {
  const [status, setStatus] = useState<string>('')
  const [tables, setTables] = useState<any[]>([])

  const testConnection = async () => {
    setStatus('Testing connection...')
    
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .single()
      
      if (error) {
        if (error.message.includes('relation "public.users" does not exist')) {
          setStatus('❌ Tables not created yet. Please run the SQL in Supabase SQL Editor.')
        } else {
          setStatus(`❌ Error: ${error.message}`)
        }
      } else {
        setStatus('✅ Database connected and tables exist!')
      }
    } catch (err: any) {
      setStatus(`❌ Connection error: ${err.message}`)
    }
  }

  const checkTables = async () => {
    try {
      // Check which tables exist
      const tableChecks = [
        { name: 'users', check: () => supabase.from('users').select('count').single() },
        { name: 'scenarios', check: () => supabase.from('scenarios').select('count').single() },
        { name: 'actuals', check: () => supabase.from('actuals').select('count').single() }
      ]

      const results = []
      for (const table of tableChecks) {
        const { error } = await table.check()
        results.push({
          name: table.name,
          exists: !error || !error.message.includes('does not exist'),
          error: error?.message
        })
      }

      setTables(results)
    } catch (err: any) {
      setStatus(`Error checking tables: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Database Setup Test</h1>
        
        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-xl font-semibold">Connection Status</h2>
          
          <div className="flex gap-4">
            <button
              onClick={testConnection}
              className="btn-primary"
            >
              Test Connection
            </button>
            
            <button
              onClick={checkTables}
              className="btn-secondary"
            >
              Check Tables
            </button>
          </div>

          {status && (
            <div className="p-4 rounded-md bg-card border border-border">
              <pre className="text-sm font-mono">{status}</pre>
            </div>
          )}

          {tables.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Table Status:</h3>
              {tables.map(table => (
                <div key={table.name} className="flex items-center gap-2">
                  <span className={table.exists ? 'text-green-500' : 'text-red-500'}>
                    {table.exists ? '✅' : '❌'}
                  </span>
                  <span className="font-mono">{table.name}</span>
                  {table.error && !table.exists && (
                    <span className="text-xs text-muted-foreground">
                      (not found)
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-xl font-semibold">Setup Instructions</h2>
          
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to your Supabase SQL Editor:</li>
            <li className="ml-4">
              <a 
                href="https://hmmpnsfnuyqzhyejfbml.supabase.co/project/hmmpnsfnuyqzhyejfbml/editor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://hmmpnsfnuyqzhyejfbml.supabase.co/project/hmmpnsfnuyqzhyejfbml/editor
              </a>
            </li>
            <li>Copy and paste the SQL from <code className="text-xs bg-card px-2 py-1 rounded">supabase/setup.sql</code></li>
            <li>Click &quot;Run&quot; to execute the SQL</li>
            <li>Come back here and test the connection</li>
          </ol>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4">SQL to Run</h2>
          <div className="bg-black/50 p-4 rounded-md overflow-x-auto">
            <pre className="text-xs font-mono text-green-400">{`-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  initial_mrr DECIMAL(12,2) NOT NULL,
  mrr_growth_rate DECIMAL(5,2) NOT NULL,
  project_revenue DECIMAL(12,2) NOT NULL,
  project_growth_rate DECIMAL(5,2) NOT NULL,
  churn_rate DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create actuals table
CREATE TABLE IF NOT EXISTS actuals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 24),
  mrr_actual DECIMAL(12,2),
  project_actual DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(scenario_id, month)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_actuals_scenario_id ON actuals(scenario_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}