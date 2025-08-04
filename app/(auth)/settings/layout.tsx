import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Settings, 
  CreditCard, 
  Palette, 
  Download, 
  HelpCircle 
} from 'lucide-react'

const settingsNavigation = [
  {
    name: 'Profile',
    href: '/settings/profile',
    icon: User,
    description: 'Manage your personal information'
  },
  {
    name: 'Account',
    href: '/settings/account',
    icon: Settings,
    description: 'Account settings and security'
  },
  {
    name: 'Billing & Usage',
    href: '/settings/billing',
    icon: CreditCard,
    description: 'View your plan and usage'
  },
  {
    name: 'Preferences',
    href: '/settings/preferences',
    icon: Palette,
    description: 'Customize your experience'
  },
]

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {settingsNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="glass-panel glass-panel-hover p-4 block group"
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 text-primary mt-0.5 group-hover:text-chart-1 transition-colors" />
                    <div>
                      <div className="text-sm font-medium text-foreground group-hover:text-foreground">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            
            <Link
              href="/export"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Link>
            
            <Link
              href="/help"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </Link>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}