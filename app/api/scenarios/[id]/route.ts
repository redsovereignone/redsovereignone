import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getScenario, updateScenario, deleteScenario } from '@/lib/supabase/queries/scenarios'
import { getUserByClerkId } from '@/lib/supabase/queries/users'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await getUserByClerkId(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const scenario = await getScenario(params.id)

    if (!scenario || scenario.user_id !== user.id) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }

    return NextResponse.json(scenario)
  } catch (error) {
    console.error('Error fetching scenario:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const user = await getUserByClerkId(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify ownership before updating
    const existing = await getScenario(params.id)
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }

    const scenario = await updateScenario(params.id, body)
    return NextResponse.json(scenario)
  } catch (error) {
    console.error('Error updating scenario:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await getUserByClerkId(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify ownership before deleting
    const existing = await getScenario(params.id)
    if (!existing || existing.user_id !== user.id) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
    }

    await deleteScenario(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting scenario:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}