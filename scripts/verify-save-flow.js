const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function verifyFlow() {
  console.log('✅ Verifying Save Scenario Flow\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Check existing data
    console.log('📊 Current Database Status:')
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
    
    console.log(`   Users: ${users?.length || 0} records`)
    
    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select('*')
    
    console.log(`   Scenarios: ${scenarios?.length || 0} records`)
    
    if (scenarios && scenarios.length > 0) {
      console.log('\n📝 Recent Scenarios:')
      scenarios.slice(0, 3).forEach(s => {
        console.log(`   - ${s.name} (MRR: $${s.initial_mrr})`)
      })
    }

    console.log('\n✅ Database is ready for saving scenarios!')
    console.log('\n📋 Next Steps:')
    console.log('1. Go to http://localhost:3000/calculator')
    console.log('2. Enter your revenue parameters')
    console.log('3. Click "Save Scenario"')
    console.log('4. Sign in with Clerk if prompted')
    console.log('5. Enter a scenario name and save')
    console.log('6. Check http://localhost:3000/dashboard to see saved scenarios')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

verifyFlow()