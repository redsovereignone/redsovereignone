import Calculator from '@/components/calculator/Calculator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Revenue Calculator | Red Sovereign',
  description: 'Model your hybrid revenue growth with our powerful B2B SaaS calculator. Combine MRR and project revenue forecasting.',
}

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-gradient">
              Revenue Growth Calculator
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Model your hybrid revenue future with precision. Combine recurring MRR and project revenue in one unified forecast.
          </p>
        </div>
        
        <Calculator />
      </div>
    </main>
  )
}