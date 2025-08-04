import { getSupabaseAdmin } from '../admin'
import type { User, NewUser } from '@/types/database'

export async function getUserByClerkId(clerkId: string) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user:', error)
    throw error
  }

  return data
}

export async function createUser(user: NewUser) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert(user)
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    throw error
  }

  return data
}

export async function updateUser(clerkId: string, updates: Partial<User>) {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('clerk_id', clerkId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    throw error
  }

  return data
}

export async function syncClerkUser(clerkId: string, email: string) {
  const existingUser = await getUserByClerkId(clerkId)
  
  if (existingUser) {
    if (existingUser.email !== email) {
      return await updateUser(clerkId, { email })
    }
    return existingUser
  }

  return await createUser({
    clerk_id: clerkId,
    email,
  })
}