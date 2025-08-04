-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Revenue parameters
  initial_mrr DECIMAL(12, 2) NOT NULL DEFAULT 0,
  mrr_growth_rate DECIMAL(5, 2) NOT NULL DEFAULT 0, -- Percentage
  project_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
  project_growth_rate DECIMAL(5, 2) NOT NULL DEFAULT 0, -- Percentage
  churn_rate DECIMAL(5, 2) NOT NULL DEFAULT 0, -- Percentage
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create actuals table for tracking real performance
CREATE TABLE IF NOT EXISTS actuals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  month INTEGER NOT NULL, -- Month number (1-24)
  mrr_actual DECIMAL(12, 2),
  project_actual DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Ensure unique month per scenario
  UNIQUE(scenario_id, month)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_actuals_scenario_id ON actuals(scenario_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_timestamp_users
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_scenarios
  BEFORE UPDATE ON scenarios
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_actuals
  BEFORE UPDATE ON actuals
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE actuals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = clerk_id);

-- RLS Policies for scenarios table
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

-- RLS Policies for actuals table
CREATE POLICY "Users can view own actuals" ON actuals
  FOR SELECT USING (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
      )
    )
  );

CREATE POLICY "Users can create own actuals" ON actuals
  FOR INSERT WITH CHECK (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
      )
    )
  );

CREATE POLICY "Users can update own actuals" ON actuals
  FOR UPDATE USING (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
      )
    )
  );

CREATE POLICY "Users can delete own actuals" ON actuals
  FOR DELETE USING (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
      )
    )
  );