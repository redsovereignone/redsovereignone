const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.log('Anon Key:', supabaseAnonKey ? '✅ Found' : '❌ Missing')
  console.log('Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing')

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('\n❌ Missing required environment variables')
    process.exit(1)
  }

  // Test with service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('\n📊 Testing database queries...\n')

    // Test 1: Check if tables exist
    console.log('1. Checking tables...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (usersError) {
      console.log('   ❌ Users table:', usersError.message)
    } else {
      console.log('   ✅ Users table exists')
    }

    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select('*')
      .limit(1)

    if (scenariosError) {
      console.log('   ❌ Scenarios table:', scenariosError.message)
    } else {
      console.log('   ✅ Scenarios table exists')
    }

    const { data: actuals, error: actualsError } = await supabase
      .from('actuals')
      .select('*')
      .limit(1)

    if (actualsError) {
      console.log('   ❌ Actuals table:', actualsError.message)
    } else {
      console.log('   ✅ Actuals table exists')
    }

    // Test 2: Try to create a test user
    console.log('\n2. Testing user creation...')
    const testUser = {
      clerk_id: 'test_' + Date.now(),
      email: 'test@example.com'
    }

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert(testUser)
      .select()
      .single()

    if (createError) {
      console.log('   ❌ User creation failed:', createError.message)
    } else {
      console.log('   ✅ User created:', newUser.id)

      // Clean up test user
      await supabase.from('users').delete().eq('id', newUser.id)
      console.log('   🧹 Test user cleaned up')
    }

    console.log('\n✅ Connection test completed successfully!')

  } catch (error) {
    console.error('\n❌ Connection test failed:', error)
    process.exit(1)
  }
}

testConnection()