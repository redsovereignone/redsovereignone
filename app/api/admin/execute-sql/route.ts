import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin endpoint to execute SQL - BE CAREFUL WITH THIS IN PRODUCTION
export async function POST(req: Request) {
  // In production, you should add authentication/authorization here
  const { sql } = await req.json()
  
  if (!sql) {
    return NextResponse.json({ error: 'No SQL provided' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: {
        schema: 'public'
      }
    }
  )

  try {
    // Unfortunately, Supabase JS client doesn't support raw SQL execution
    // We need to use the REST API directly
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`
      },
      body: JSON.stringify({ sql_query: sql })
    })

    if (!response.ok) {
      const error = await response.text()
      
      // If the RPC function doesn't exist, return instructions
      if (error.includes('function public.exec_sql') || error.includes('does not exist')) {
        return NextResponse.json({
          error: 'SQL execution not available via API',
          message: 'Direct SQL execution requires manual setup in Supabase Dashboard',
          instructions: {
            url: `https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]}/editor`,
            steps: [
              'Open the SQL Editor',
              'Paste and run the SQL',
              'Tables will be created immediately'
            ]
          }
        }, { status: 501 })
      }
      
      return NextResponse.json({ error }, { status: 400 })
    }

    const result = await response.json()
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error('SQL execution error:', error)
    return NextResponse.json({ 
      error: error.message,
      hint: 'SQL must be executed manually in Supabase Dashboard'
    }, { status: 500 })
  }
}