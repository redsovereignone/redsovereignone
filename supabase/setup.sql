-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (synced from Clerk)
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

-- Create actuals table for tracking real revenue vs projections
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

-- IMPORTANT: Disable RLS for now to make development easier
-- You can enable it later for production
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE actuals DISABLE ROW LEVEL SECURITY;