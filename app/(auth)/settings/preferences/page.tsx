import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Moon, Sun, Bell, Calculator, TrendingUp, DollarSign } from 'lucide-react'

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Preferences</h2>
        <p className="text-muted-foreground">
          Customize your experience and set default values for calculations
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-background border-2 border-border rounded-full flex items-center justify-center">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Dark Theme</div>
                <div className="text-sm text-muted-foreground">
                  Currently using dark theme
                </div>
              </div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <Sun className="h-4 w-4 inline mr-1" />
              Theme customization will be available in a future update. For now, the dark theme provides optimal viewing for data-heavy dashboards.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Control when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-muted-foreground">
                Receive updates about your scenarios and account
              </div>
            </div>
            <Switch disabled />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">Milestone Alerts</div>
              <div className="text-sm text-muted-foreground">
                Get notified when you reach revenue milestones
              </div>
            </div>
            <Switch disabled />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">Weekly Reports</div>
              <div className="text-sm text-muted-foreground">
                Weekly summary of your scenarios and progress
              </div>
            </div>
            <Switch disabled />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Notification preferences will be configurable in a future update.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Calculator Defaults</span>
          </CardTitle>
          <CardDescription>
            Set default values for new revenue calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Default Initial MRR</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  className="input-field pl-10" 
                  placeholder="100,000"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">Default MRR Growth Rate</label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  className="input-field pl-10" 
                  placeholder="15%"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Default Project Revenue</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  className="input-field pl-10" 
                  placeholder="50,000"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">Default Churn Rate</label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  className="input-field pl-10" 
                  placeholder="5%"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button disabled>
              Save Defaults
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Custom default values will be available in a future update. Currently using industry-standard defaults.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>
            Customize how data is displayed in charts and tables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">Currency Format</div>
              <div className="text-sm text-muted-foreground">
                USD ($) with thousand separators
              </div>
            </div>
            <Badge variant="outline">USD</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">Number Format</div>
              <div className="text-sm text-muted-foreground">
                Compact notation (e.g., 1.2M instead of 1,200,000)
              </div>
            </div>
            <Switch disabled defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">Chart Animation</div>
              <div className="text-sm text-muted-foreground">
                Animate chart transitions and updates
              </div>
            </div>
            <Switch disabled defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}