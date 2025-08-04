import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Create a single admin client instance
let adminClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseAdmin() {
  if (!adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    adminClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  return adminClient
}