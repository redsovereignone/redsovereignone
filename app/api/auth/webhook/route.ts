import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local')
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data
    const email = email_addresses[0]?.email_address

    if (email) {
      const { error } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_id: id,
          email: email
        })

      if (error) {
        console.error('Error creating user in Supabase:', error)
        return new Response('Error creating user', { status: 500 })
      }
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses } = evt.data
    const email = email_addresses[0]?.email_address

    if (email) {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ email })
        .eq('clerk_id', id)

      if (error) {
        console.error('Error updating user in Supabase:', error)
        return new Response('Error updating user', { status: 500 })
      }
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('clerk_id', id)

    if (error) {
      console.error('Error deleting user from Supabase:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('Webhook processed', { status: 200 })
}