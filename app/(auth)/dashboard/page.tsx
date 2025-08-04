import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calculator, Plus, TrendingUp, FileText } from 'lucide-react'
import ScenarioList from '@/components/dashboard/ScenarioList'
import { supabase } from '@/lib/supabase/client'

async function getScenarios(userId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!user) return []

  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return scenarios || []
}

export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const scenarios = await getScenarios(user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.firstName || 'Founder'}!
            </h1>
            <p className="text-muted-foreground">
              Your revenue growth command center
            </p>
          </div>
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-foreground font-bold rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            New Scenario
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">{scenarios.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Scenarios</p>
        </div>
        
        <Link href="/calculator" className="glass-panel glass-panel-hover p-6">
          <div className="flex items-center justify-between mb-2">
            <Calculator className="w-8 h-8 text-accent" />
            <Plus className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium">Create New Model</p>
        </Link>
        
        <Link href="/actuals" className="glass-panel glass-panel-hover p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <span className="text-sm text-muted-foreground">Track</span>
          </div>
          <p className="text-sm font-medium">Update Actuals</p>
        </Link>
        
        <div className="glass-panel p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <p className="text-sm text-muted-foreground mb-1">Next Milestone</p>
          <p className="text-xl font-bold">$2M ARR</p>
          <p className="text-xs text-muted-foreground mt-1">6 months away</p>
        </div>
      </div>

      {/* Scenarios List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Scenarios</h2>
        <ScenarioList 
          scenarios={scenarios}
          onDelete={async (id) => {
            'use server'
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/scenarios/${id}`, {
              method: 'DELETE',
            })
            if (!response.ok) {
              throw new Error('Failed to delete scenario')
            }
          }}
        />
      </div>

      {/* CTA Section */}
      {scenarios.length > 2 && (
        <section className="mt-12">
          <div className="glass-panel p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Accelerate Your Growth?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              You&apos;ve modeled {scenarios.length} scenarios. Our Strategy Sprint helps you turn these projections into reality with expert guidance.
            </p>
            <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-foreground font-bold rounded-lg transition-all">
              Schedule Strategy Sprint →
            </button>
          </div>
        </section>
      )}
    </div>
  )
}