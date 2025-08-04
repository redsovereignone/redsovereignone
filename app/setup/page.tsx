'use client'

import { useState } from 'react'
import { Check, Copy, ExternalLink, Database } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SQL_SCRIPT = `-- Enable UUID extension
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
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actuals_updated_at BEFORE UPDATE ON actuals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`;

export default function SetupPage() {
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({})
  
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]
  const dashboardUrl = `https://supabase.com/dashboard/project/${projectRef}/editor`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(SQL_SCRIPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const checkTables = async () => {
    setChecking(true)
    const tables = ['users', 'scenarios', 'actuals']
    const status: Record<string, boolean> = {}
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(0)
        
        status[table] = !error || !error.message.includes('does not exist')
      } catch {
        status[table] = false
      }
    }
    
    setTableStatus(status)
    setChecking(false)
  }

  const openDashboard = () => {
    window.open(dashboardUrl, '_blank')
  }

  const allTablesExist = Object.keys(tableStatus).length === 3 && 
    Object.values(tableStatus).every(exists => exists)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Database Setup</h1>
          </div>

          <div className="space-y-6">
            {/* Step 1: Check Status */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Step 1: Check Current Status
              </h2>
              <button
                onClick={checkTables}
                disabled={checking}
                className="btn-primary"
              >
                {checking ? 'Checking...' : 'Check Tables'}
              </button>
              
              {Object.keys(tableStatus).length > 0 && (
                <div className="mt-4 p-4 bg-card rounded-lg space-y-2">
                  {['users', 'scenarios', 'actuals'].map(table => (
                    <div key={table} className="flex items-center gap-2">
                      <span className={tableStatus[table] ? 'text-green-500' : 'text-red-500'}>
                        {tableStatus[table] ? '✅' : '❌'}
                      </span>
                      <span className="font-mono text-sm">{table}</span>
                    </div>
                  ))}
                  
                  {allTablesExist ? (
                    <div className="mt-4 p-3 bg-green-500/20 rounded-md">
                      <p className="text-green-400 font-semibold">
                        ✨ All tables exist! Your database is ready.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-yellow-500/20 rounded-md">
                      <p className="text-yellow-400">
                        ⚠️ Some tables are missing. Follow steps 2-4 below.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Copy SQL */}
            {!allTablesExist && (
              <>
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">
                    Step 2: Copy SQL Script
                  </h2>
                  <button
                    onClick={copyToClipboard}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy SQL to Clipboard
                      </>
                    )}
                  </button>
                </div>

                {/* Step 3: Open Dashboard */}
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">
                    Step 3: Open Supabase SQL Editor
                  </h2>
                  <button
                    onClick={openDashboard}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Supabase Dashboard
                  </button>
                  <p className="text-sm text-muted-foreground">
                    This will open in a new tab. You may need to sign in.
                  </p>
                </div>

                {/* Step 4: Instructions */}
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">
                    Step 4: Execute SQL
                  </h2>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>In the SQL Editor, click "New query"</li>
                    <li>Paste the SQL script (Cmd+V or Ctrl+V)</li>
                    <li>Click the "Run" button</li>
                    <li>You should see "Success. No rows returned"</li>
                    <li>Come back here and check tables again</li>
                  </ol>
                </div>
              </>
            )}

            {/* SQL Preview */}
            <details className="group">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                View SQL Script
              </summary>
              <div className="mt-3 bg-black/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-green-400">
                  {SQL_SCRIPT}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="flex gap-4">
            <a
              href="/test-db"
              className="text-primary hover:underline text-sm"
            >
              Test Database Page
            </a>
            <a
              href="/"
              className="text-primary hover:underline text-sm"
            >
              Back to Calculator
            </a>
            {allTablesExist && (
              <a
                href="/dashboard"
                className="text-primary hover:underline text-sm"
              >
                Go to Dashboard
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}