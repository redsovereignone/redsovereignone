#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createTables() {
  console.log('Creating database tables via Supabase API...\n');

  // First, let's test the connection
  try {
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });

    if (testResponse.ok) {
      console.log('✅ Connected to Supabase successfully!\n');
    }
  } catch (error) {
    console.error('Connection test failed:', error);
  }

  // Since we can't execute raw SQL via REST API, let's use the Management API
  // Extract project ref from URL
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];
  
  console.log(`Project Reference: ${projectRef}`);
  console.log('\nSince direct SQL execution is not available via the REST API,');
  console.log('I\'ll create a simpler approach using the Supabase client library.\n');
  
  // Create a Node.js script that uses the Supabase client to check and create tables
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test if tables exist by trying to query them
  const tables = ['users', 'scenarios', 'actuals'];
  const tableStatus = {};

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(0);
      
      if (error && error.message.includes('does not exist')) {
        tableStatus[table] = '❌ Not found';
        console.log(`❌ Table '${table}' does not exist`);
      } else if (error) {
        tableStatus[table] = `⚠️ Error: ${error.message}`;
        console.log(`⚠️ Table '${table}': ${error.message}`);
      } else {
        tableStatus[table] = '✅ Exists';
        console.log(`✅ Table '${table}' exists`);
      }
    } catch (err) {
      tableStatus[table] = `❌ Error: ${err.message}`;
      console.log(`❌ Table '${table}': ${err.message}`);
    }
  }

  // If tables don't exist, provide instructions
  const missingTables = Object.entries(tableStatus).filter(([_, status]) => !status.includes('Exists'));
  
  if (missingTables.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 MANUAL SETUP REQUIRED');
    console.log('='.repeat(60));
    console.log('\nPlease follow these steps to create the tables:\n');
    console.log('1. Open your Supabase Dashboard:');
    console.log(`   https://supabase.com/dashboard/project/${projectRef}/editor\n`);
    console.log('2. Click on "SQL Editor" in the left sidebar\n');
    console.log('3. Click "New query" button\n');
    console.log('4. Copy and paste the SQL below:\n');
    console.log('='.repeat(60));
    
    const sql = `-- Enable UUID extension
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
    
    console.log(sql);
    console.log('\n' + '='.repeat(60));
    console.log('\n5. Click "Run" button to execute the SQL\n');
    console.log('6. You should see "Success. No rows returned"\n');
    console.log('7. Go back to http://localhost:3000/test-db and test again\n');
    console.log('='.repeat(60));
    
    // Save SQL to file for easy copying
    const fs = require('fs');
    const sqlPath = './create-tables.sql';
    fs.writeFileSync(sqlPath, sql);
    console.log(`\n💾 SQL also saved to: ${sqlPath}\n`);
  } else {
    console.log('\n✅ All tables exist! Your database is ready.');
  }
}

createTables().catch(console.error);