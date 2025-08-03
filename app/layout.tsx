import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}