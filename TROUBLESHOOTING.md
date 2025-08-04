# Troubleshooting Guide

## Scenario Save Error - "Internal Server Error"

### Problem
When trying to save a scenario from the calculator, you get an "Internal server error" message.

### Solution Steps

1. **Verify Database Tables Exist**
   Run this SQL in Supabase SQL Editor to check:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Temporarily Disable RLS (for testing only)**
   Run this SQL in Supabase SQL Editor:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE scenarios DISABLE ROW LEVEL SECURITY;
   ALTER TABLE actuals DISABLE ROW LEVEL SECURITY;
   ```

3. **Check Server Logs**
   When you try to save a scenario, check the terminal running `npm run dev` for error messages.

4. **Verify Environment Variables**
   Ensure these are set in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

5. **Test Database Connection**
   Run: `node scripts/test-connection.js`
   This should show all tables exist and can be accessed.

6. **Re-enable RLS (for production)**
   After fixing the issue, re-enable RLS:
   ```sql
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
   ALTER TABLE actuals ENABLE ROW LEVEL SECURITY;
   ```

### Common Causes

1. **Authentication Issue**: Clerk auth token not being passed to API routes
2. **RLS Policies**: Row Level Security blocking access even with service role
3. **Missing User Record**: User not synced from Clerk to Supabase users table
4. **Environment Variables**: Missing or incorrect Supabase credentials

### Quick Fix

If you need to get it working immediately:

1. Run the SQL from `supabase/disable-rls.sql` to disable RLS
2. This will allow all operations to work
3. Debug the RLS policies later and re-enable them

### Testing

To test if everything is working:
```bash
node scripts/test-scenario-save.js
```

This will create a test user and scenario, then clean up afterward.