import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Navigation } from '@/components/layout/Navigation'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Red Sovereign Growth Dashboard',
  description: 'Model your hybrid revenue future with precision. The command center for B2B founders scaling from $1M to $5M ARR.',
  keywords: 'revenue modeling, SaaS growth, B2B scaling, MRR calculator, hybrid revenue',
  authors: [{ name: 'Red Sovereign' }],
  openGraph: {
    title: 'Red Sovereign Growth Dashboard',
    description: 'Model your hybrid revenue future with precision',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} antialiased dark`}>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}