import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { getUserByClerkId } from '@/lib/supabase/queries/users'
import { createClient } from '@supabase/supabase-js'
import ScenarioCalculator from './ScenarioCalculator'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getScenario(scenarioId: string, userId: string) {
  const user = await getUserByClerkId(userId)
  if (!user) return null

  const { data, error } = await supabaseAdmin
    .from('scenarios')
    .select('*')
    .eq('id', scenarioId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null
  return data
}

export default async function ScenarioPage({
  params
}: {
  params: { id: string }
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const scenario = await getScenario(params.id, userId)
  
  if (!scenario) {
    notFound()
  }

  return <ScenarioCalculator scenario={scenario} />
}