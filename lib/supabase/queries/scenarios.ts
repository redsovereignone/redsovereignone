import { getSupabaseAdmin } from '../admin'
import type { Scenario, NewScenario, UpdateScenario } from '@/types/database'

export async function getScenarios(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching scenarios:', error)
    throw error
  }

  return data || []
}

export async function getScenario(id: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching scenario:', error)
    throw error
  }

  return data
}

export async function createScenario(scenario: Omit<NewScenario, 'id'>) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('scenarios')
    .insert(scenario)
    .select()
    .single()

  if (error) {
    console.error('Error creating scenario:', error)
    throw error
  }

  return data
}

export async function updateScenario(id: string, updates: UpdateScenario) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('scenarios')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating scenario:', error)
    throw error
  }

  return data
}

export async function deleteScenario(id: string) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('scenarios')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting scenario:', error)
    throw error
  }

  return true
}

export async function archiveScenario(id: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('scenarios')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error archiving scenario:', error)
    throw error
  }

  return data
}