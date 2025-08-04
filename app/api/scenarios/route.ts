import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { getScenarios, createScenario } from '@/lib/supabase/queries/scenarios'
import { getUserByClerkId, syncClerkUser } from '@/lib/supabase/queries/users'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await getUserByClerkId(userId)

    if (!user) {
      console.error('User not found for Clerk ID:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const scenarios = await getScenarios(user.id)
    return NextResponse.json(scenarios)
  } catch (error) {
    console.error('Unexpected error in GET /api/scenarios:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/scenarios - Starting...')
  
  const { userId } = await auth()
  const clerkUser = await currentUser()
  
  console.log('Auth check - userId:', userId)
  console.log('Auth check - clerkUser:', clerkUser?.id)
  
  if (!userId || !clerkUser) {
    console.log('Auth failed - no user found')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { 
      name, 
      description,
      initial_mrr, 
      mrr_growth_rate, 
      project_revenue, 
      project_growth_rate, 
      churn_rate 
    } = body

    if (!name) {
      return NextResponse.json({ error: 'Scenario name is required' }, { status: 400 })
    }

    // Ensure user exists in database
    const email = clerkUser.emailAddresses[0]?.emailAddress || 'no-email@example.com'
    const dbUser = await syncClerkUser(userId, email)

    // Create the scenario
    const scenario = await createScenario({
      user_id: dbUser.id,
      name,
      description: description || null,
      initial_mrr: initial_mrr || 0,
      mrr_growth_rate: mrr_growth_rate || 0,
      project_revenue: project_revenue || 0,
      project_growth_rate: project_growth_rate || 0,
      churn_rate: churn_rate || 0,
    })

    console.log('Created scenario:', scenario)
    return NextResponse.json(scenario)
  } catch (error) {
    console.error('Unexpected error in POST /api/scenarios:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}