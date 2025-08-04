import { InputPanel } from '@/components/calculator/InputPanel';
import { ResultsChart } from '@/components/calculator/ResultsChart';
import { MetricsDisplay } from '@/components/calculator/MetricsDisplay';
import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function CalculatorPage() {
  const user = await currentUser();
  
  return (
    <div className="command-center min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gradient">
                Red Sovereign Growth Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Model your hybrid revenue future with precision
              </p>
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    baseTheme: 'dark',
                    elements: {
                      avatarBox: 'w-10 h-10',
                      userButtonPopoverCard: 'bg-muted border border-border',
                      userButtonPopoverText: 'text-foreground',
                      userButtonPopoverFooter: 'hidden',
                    },
                  }}
                />
              </div>
            ) : (
              <Link href="/sign-up" className="btn-primary">
                Create Free Account →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel - Left Side */}
          <div className="lg:col-span-4">
            <InputPanel />
          </div>

          {/* Results - Right Side */}
          <div className="lg:col-span-8 space-y-8">
            <ResultsChart />
            <MetricsDisplay />
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="glass-panel p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Turn This Model Into Reality?
            </h2>
            <p className="text-muted-foreground mb-6">
              Save your projections, track actual performance, and get expert guidance
              on achieving these growth targets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-primary">
                    View Your Dashboard
                  </Link>
                  <button className="btn-secondary">
                    Schedule Strategy Sprint
                  </button>
                </>
              ) : (
                <>
                  <Link href="/sign-up" className="btn-primary">
                    Create Your Free Account
                  </Link>
                  <button className="btn-secondary">
                    Schedule Strategy Sprint
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2025 Red Sovereign. Your Growth Command Center.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}