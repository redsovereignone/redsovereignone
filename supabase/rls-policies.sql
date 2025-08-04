-- Improved RLS Policies for Production
-- These policies work with Clerk authentication

-- First, ensure RLS is enabled (run after testing)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE actuals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view own scenarios" ON scenarios;
DROP POLICY IF EXISTS "Users can create own scenarios" ON scenarios;
DROP POLICY IF EXISTS "Users can update own scenarios" ON scenarios;
DROP POLICY IF EXISTS "Users can delete own scenarios" ON scenarios;
DROP POLICY IF EXISTS "Service role can manage all scenarios" ON scenarios;
DROP POLICY IF EXISTS "Users can view own actuals" ON actuals;
DROP POLICY IF EXISTS "Users can create own actuals" ON actuals;
DROP POLICY IF EXISTS "Users can update own actuals" ON actuals;
DROP POLICY IF EXISTS "Users can delete own actuals" ON actuals;
DROP POLICY IF EXISTS "Service role can manage all actuals" ON actuals;

-- Users table policies
-- Allow service role to do everything
CREATE POLICY "Service role can manage all users" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow users to read their own record (using clerk_id)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (
    clerk_id = auth.jwt() ->> 'sub' OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow users to update their own record
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (
    clerk_id = auth.jwt() ->> 'sub' OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Scenarios table policies
-- Allow service role to do everything
CREATE POLICY "Service role can manage all scenarios" ON scenarios
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow users to view their own scenarios
CREATE POLICY "Users can view own scenarios" ON scenarios
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ) OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow users to create scenarios
CREATE POLICY "Users can create own scenarios" ON scenarios
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ) OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow users to update their own scenarios
CREATE POLICY "Users can update own scenarios" ON scenarios
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ) OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow users to delete their own scenarios
CREATE POLICY "Users can delete own scenarios" ON scenarios
  FOR DELETE USING (
    user_id IN (
      SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
    ) OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Actuals table policies
-- Allow service role to do everything
CREATE POLICY "Service role can manage all actuals" ON actuals
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow users to view actuals for their scenarios
CREATE POLICY "Users can view own actuals" ON actuals
  FOR SELECT USING (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    ) OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow users to create actuals for their scenarios
CREATE POLICY "Users can create own actuals" ON actuals
  FOR INSERT WITH CHECK (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    ) OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow users to update actuals for their scenarios
CREATE POLICY "Users can update own actuals" ON actuals
  FOR UPDATE USING (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    ) OR
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Allow users to delete actuals for their scenarios
CREATE POLICY "Users can delete own actuals" ON actuals
  FOR DELETE USING (
    scenario_id IN (
      SELECT id FROM scenarios WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    ) OR
    auth.jwt() ->> 'role' = 'service_role'
  );