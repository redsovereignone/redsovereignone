#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up database tables...');

  // SQL to create tables
  const sql = `
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Create users table (synced from Clerk)
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
      initial_mrr DECIMAL(12, 2) NOT NULL DEFAULT 0,
      mrr_growth_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
      project_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
      project_growth_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
      churn_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
    );

    -- Create actuals table for tracking real revenue vs projections
    CREATE TABLE IF NOT EXISTS actuals (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
      month INTEGER NOT NULL,
      mrr_actual DECIMAL(12, 2),
      project_actual DECIMAL(12, 2),
      notes TEXT,
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
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_scenarios_updated_at ON scenarios;
    CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_actuals_updated_at ON actuals;
    CREATE TRIGGER update_actuals_updated_at BEFORE UPDATE ON actuals
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    // Execute the SQL using Supabase RPC
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();
    
    if (error) {
      // If RPC doesn't exist, try direct approach
      console.log('Note: Direct SQL execution not available via Supabase JS client.');
      console.log('Please run the following SQL in Supabase SQL Editor:');
      console.log('\n' + sql);
      console.log('\nGo to: https://hmmpnsfnuyqzhyejfbml.supabase.co/project/hmmpnsfnuyqzhyejfbml/editor');
    } else {
      console.log('✅ Database tables created successfully!');
    }
  } catch (error) {
    console.log('\n📋 Please run this SQL in your Supabase SQL Editor:');
    console.log('URL: https://hmmpnsfnuyqzhyejfbml.supabase.co/project/hmmpnsfnuyqzhyejfbml/editor\n');
    console.log(sql);
  }
}

setupDatabase().catch(console.error);