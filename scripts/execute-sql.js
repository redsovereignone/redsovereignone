#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Parse Supabase connection string from URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project reference from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

// Supabase PostgreSQL connection details
const connectionString = `postgresql://postgres.${projectRef}:${supabaseKey}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

async function executeSql() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // SQL commands to execute
    const sqlCommands = [
      // Enable UUID extension
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
      
      // Create users table
      `CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      )`,
      
      // Create scenarios table
      `CREATE TABLE IF NOT EXISTS scenarios (
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
      )`,
      
      // Create actuals table
      `CREATE TABLE IF NOT EXISTS actuals (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
        month INTEGER NOT NULL CHECK (month >= 1 AND month <= 24),
        mrr_actual DECIMAL(12,2),
        project_actual DECIMAL(12,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        UNIQUE(scenario_id, month)
      )`,
      
      // Create indexes
      `CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_actuals_scenario_id ON actuals(scenario_id)`,
      `CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id)`,
      
      // Create update trigger function
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = TIMEZONE('utc', NOW());
        RETURN NEW;
      END;
      $$ language 'plpgsql'`,
      
      // Create triggers
      `DROP TRIGGER IF EXISTS update_users_updated_at ON users`,
      `CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
      
      `DROP TRIGGER IF EXISTS update_scenarios_updated_at ON scenarios`,
      `CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
      
      `DROP TRIGGER IF EXISTS update_actuals_updated_at ON actuals`,
      `CREATE TRIGGER update_actuals_updated_at BEFORE UPDATE ON actuals
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`
    ];

    // Execute each command
    for (const sql of sqlCommands) {
      const commandName = sql.split(' ').slice(0, 3).join(' ');
      try {
        await client.query(sql);
        console.log(`✅ ${commandName}...`);
      } catch (err) {
        console.error(`❌ Failed: ${commandName}`);
        console.error(`   Error: ${err.message}`);
      }
    }

    // Verify tables were created
    console.log('\n📊 Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name IN ('users', 'scenarios', 'actuals')
    `);
    
    console.log('Tables found:');
    result.rows.forEach(row => {
      console.log(`  ✅ ${row.table_name}`);
    });

    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('Connection error:', error.message);
    console.error('\nTrying alternative connection method...');
    
    // Try alternative connection string format
    const altConnectionString = `postgresql://postgres:${supabaseKey}@db.${projectRef}.supabase.co:5432/postgres`;
    const altClient = new Client({
      connectionString: altConnectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    try {
      await altClient.connect();
      console.log('Connected with alternative method!');
      // You can repeat the SQL execution here if needed
    } catch (altError) {
      console.error('Alternative connection also failed:', altError.message);
    } finally {
      await altClient.end();
    }
  } finally {
    await client.end();
  }
}

executeSql().catch(console.error);