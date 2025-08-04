import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { userButtonAppearance } from '@/lib/clerk-theme'
import { Calculator, TrendingUp, FileText, Settings } from 'lucide-react'

export default async function DashboardPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="command-center min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gradient">
                Red Sovereign
              </h1>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Calculator
                </Link>
                <Link href="/scenarios" className="text-muted-foreground hover:text-foreground transition-colors">
                  Scenarios
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.emailAddresses[0]?.emailAddress}
              </span>
              <UserButton 
                afterSignOutUrl="/"
                appearance={userButtonAppearance}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.firstName || 'Founder'}!
          </h2>
          <p className="text-muted-foreground">
            Your revenue growth command center
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/calculator" className="glass-panel glass-panel-hover p-6 flex flex-col items-center text-center space-y-3">
            <Calculator className="w-10 h-10 text-primary" />
            <h3 className="font-semibold">Revenue Calculator</h3>
            <p className="text-sm text-muted-foreground">Model your growth</p>
          </Link>
          
          <Link href="/scenarios" className="glass-panel glass-panel-hover p-6 flex flex-col items-center text-center space-y-3">
            <FileText className="w-10 h-10 text-accent" />
            <h3 className="font-semibold">Saved Scenarios</h3>
            <p className="text-sm text-muted-foreground">View your models</p>
          </Link>
          
          <Link href="/actuals" className="glass-panel glass-panel-hover p-6 flex flex-col items-center text-center space-y-3">
            <TrendingUp className="w-10 h-10 text-primary" />
            <h3 className="font-semibold">Track Actuals</h3>
            <p className="text-sm text-muted-foreground">Compare performance</p>
          </Link>
          
          <Link href="/settings" className="glass-panel glass-panel-hover p-6 flex flex-col items-center text-center space-y-3">
            <Settings className="w-10 h-10 text-accent" />
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm text-muted-foreground">Manage account</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-8">
          <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="font-medium">No scenarios yet</p>
                <p className="text-sm text-muted-foreground">Create your first revenue model</p>
              </div>
              <Link href="/calculator" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-12">
          <div className="glass-panel p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Accelerate Your Growth?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our Strategy Sprint helps you turn these projections into reality. 
              Get expert guidance on achieving your revenue targets.
            </p>
            <button className="btn-primary">
              Schedule Strategy Sprint
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}