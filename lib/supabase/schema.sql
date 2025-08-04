-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Scenarios table
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

-- Actuals table for tracking real revenue vs projections
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_actuals_scenario_id ON actuals(scenario_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE actuals ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can view own scenarios" ON scenarios
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create own scenarios" ON scenarios
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update own scenarios" ON scenarios
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own scenarios" ON scenarios
  FOR DELETE USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can view own actuals" ON actuals
  FOR SELECT USING (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
      )
    )
  );

CREATE POLICY "Users can manage own actuals" ON actuals
  FOR ALL USING (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
      )
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actuals_updated_at BEFORE UPDATE ON actuals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();