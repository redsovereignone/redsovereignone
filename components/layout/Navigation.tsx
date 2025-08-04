'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, SignInButton } from '@clerk/nextjs'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserMenu } from './UserMenu'
import { cn } from '@/lib/utils'

export function Navigation() {
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Calculator', href: '/calculator' },
    { name: 'Dashboard', href: '/dashboard', authRequired: true },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-1 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RS</span>
              </div>
              <span className="text-lg font-bold text-foreground hidden sm:block">
                Red Sovereign
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                if (item.authRequired && !isSignedIn) return null
                
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'nav-item',
                      isActive && 'nav-item-active'
                    )}
                  >
                    {item.name === 'Dashboard' && (
                      <LayoutDashboard className="w-4 h-4 mr-1" />
                    )}
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <UserMenu user={user} />
            ) : (
              <SignInButton mode="modal">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isSignedIn && <UserMenu user={user} />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {navigation.map((item) => {
                if (item.authRequired && !isSignedIn) return null
                
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'nav-item block px-3 py-2 rounded-md text-base font-medium',
                      isActive && 'nav-item-active'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      {item.name === 'Dashboard' && (
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                      )}
                      {item.name}
                    </div>
                  </Link>
                )
              })}
              
              {!isSignedIn && (
                <div className="pt-4 border-t border-border mt-4">
                  <SignInButton mode="modal">
                    <Button variant="default" className="w-full">
                      Sign In
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}