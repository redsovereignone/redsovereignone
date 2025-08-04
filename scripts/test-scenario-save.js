const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testScenarioSave() {
  console.log('🧪 Testing scenario save functionality...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Step 1: Create a test user (simulating Clerk user)
    console.log('1. Creating test user...')
    const testClerkId = 'test_clerk_' + Date.now()
    const testEmail = `test${Date.now()}@example.com`

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        clerk_id: testClerkId,
        email: testEmail
      })
      .select()
      .single()

    if (userError) {
      console.error('   ❌ Failed to create user:', userError.message)
      process.exit(1)
    }

    console.log('   ✅ User created:', user.id)

    // Step 2: Create a test scenario
    console.log('\n2. Creating test scenario...')
    const { data: scenario, error: scenarioError } = await supabase
      .from('scenarios')
      .insert({
        user_id: user.id,
        name: 'Test Scenario ' + Date.now(),
        description: 'Testing scenario save functionality',
        initial_mrr: 100000,
        mrr_growth_rate: 0.15,
        project_revenue: 50000,
        project_growth_rate: 0.10,
        churn_rate: 0.05
      })
      .select()
      .single()

    if (scenarioError) {
      console.error('   ❌ Failed to create scenario:', scenarioError.message)
      // Clean up user
      await supabase.from('users').delete().eq('id', user.id)
      process.exit(1)
    }

    console.log('   ✅ Scenario created:', scenario.id)
    console.log('   Name:', scenario.name)
    console.log('   MRR:', scenario.initial_mrr)
    console.log('   Growth Rate:', scenario.mrr_growth_rate)

    // Step 3: Verify we can retrieve it
    console.log('\n3. Retrieving scenarios for user...')
    const { data: scenarios, error: fetchError } = await supabase
      .from('scenarios')
      .select('*')
      .eq('user_id', user.id)

    if (fetchError) {
      console.error('   ❌ Failed to fetch scenarios:', fetchError.message)
    } else {
      console.log('   ✅ Found', scenarios.length, 'scenario(s)')
    }

    // Step 4: Clean up test data
    console.log('\n4. Cleaning up test data...')
    await supabase.from('scenarios').delete().eq('id', scenario.id)
    await supabase.from('users').delete().eq('id', user.id)
    console.log('   ✅ Test data cleaned up')

    console.log('\n✅ All tests passed! Scenario save functionality is working.')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

testScenarioSave()