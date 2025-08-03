import Link from 'next/link'
import { ArrowRight, TrendingUp, Target, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="command-center min-h-screen">
      {/* Hero Section */}
      <main className="flex min-h-screen flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="max-w-5xl w-full space-y-8 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse-slow">
                Red Sovereign
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              Your Growth Command Center
            </p>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Model Your Hybrid Revenue Future
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The only revenue modeling tool designed for B2B founders scaling from 
              $1M to $5M ARR. Combine recurring and project revenue in one unified dashboard.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/calculator"
              className="group px-8 py-4 bg-primary hover:bg-primary/90 text-foreground font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Model Your Future Revenue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/dashboard"
              className="px-8 py-4 glass-panel glass-panel-hover text-foreground font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Access Dashboard
            </Link>
          </div>
          
          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="glass-panel glass-panel-hover p-8 space-y-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <Target className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">$1M-$5M ARR</h3>
              <p className="text-muted-foreground">
                Built specifically for B2B SaaS and service companies in the scaling phase
              </p>
            </div>
            
            <div className="glass-panel glass-panel-hover p-8 space-y-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <TrendingUp className="w-10 h-10 text-accent mx-auto" />
              <h3 className="text-2xl font-bold">Hybrid Model</h3>
              <p className="text-muted-foreground">
                Accurately model both MRR compound growth and linear project revenue
              </p>
            </div>
            
            <div className="glass-panel glass-panel-hover p-8 space-y-3 animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <Zap className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">24-Month View</h3>
              <p className="text-muted-foreground">
                See your growth trajectory with month-by-month precision and KPIs
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-muted-foreground mb-4">Trusted by ambitious B2B founders</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm text-left">
                <div>Companies</div>
                <div className="text-muted-foreground">Modeling Growth</div>
              </div>
              <div className="text-3xl font-bold">15%</div>
              <div className="text-sm text-left">
                <div>Convert to</div>
                <div className="text-muted-foreground">Strategy Sprint</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}