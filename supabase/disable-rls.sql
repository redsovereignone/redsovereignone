-- Temporarily disable RLS for testing
-- WARNING: Only use this for debugging, re-enable RLS for production!

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE actuals DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS later:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE actuals ENABLE ROW LEVEL SECURITY;