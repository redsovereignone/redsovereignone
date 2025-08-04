async function testAPI() {
  console.log('🧪 Testing API endpoints...\n')

  const baseUrl = 'http://localhost:3001'

  // Test data
  const testScenario = {
    name: 'Test Scenario ' + Date.now(),
    description: 'Testing the API',
    initial_mrr: 100000,
    mrr_growth_rate: 0.15,
    project_revenue: 50000,
    project_growth_rate: 0.10,
    churn_rate: 0.05
  }

  try {
    // Test 1: Create scenario without auth (should fail)
    console.log('1. Testing POST /api/scenarios without auth...')
    const response1 = await fetch(`${baseUrl}/api/scenarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testScenario)
    })

    const data1 = await response1.json()
    console.log(`   Status: ${response1.status}`)
    console.log(`   Response:`, JSON.stringify(data1, null, 2))

    // Test 2: Get scenarios without auth (should fail)
    console.log('\n2. Testing GET /api/scenarios without auth...')
    const response2 = await fetch(`${baseUrl}/api/scenarios`)
    const data2 = await response2.json()
    console.log(`   Status: ${response2.status}`)
    console.log(`   Response:`, JSON.stringify(data2, null, 2))

  } catch (error) {
    console.error('❌ API test failed:', error.message)
  }
}

testAPI()