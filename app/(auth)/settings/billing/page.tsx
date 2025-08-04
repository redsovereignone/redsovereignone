import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, BarChart3, Calendar, Award } from 'lucide-react'

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Billing & Usage</h2>
        <p className="text-muted-foreground">
          View your current plan, usage statistics, and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Current Plan</span>
          </CardTitle>
          <CardDescription>
            Your current subscription and plan details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary/10 to-chart-1/10 rounded-lg border border-primary/20">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-2xl font-bold">Free Plan</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  Current
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Perfect for getting started with revenue modeling
              </p>
              <div className="mt-4 space-y-1">
                <div className="flex items-center text-sm">
                  <span className="w-4 h-4 rounded-full bg-chart-3 mr-2"></span>
                  Unlimited revenue scenarios
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-4 h-4 rounded-full bg-chart-3 mr-2"></span>
                  24-month projections
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-4 h-4 rounded-full bg-chart-3 mr-2"></span>
                  Basic export features
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">$0</div>
              <div className="text-sm text-muted-foreground">per month</div>
              <Button className="mt-4" disabled>
                Current Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Usage Statistics</span>
          </CardTitle>
          <CardDescription>
            Your activity and usage metrics this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">3</div>
              <div className="text-sm text-muted-foreground">Scenarios Created</div>
              <div className="text-xs text-muted-foreground mt-1">Unlimited on Free Plan</div>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-chart-3 mb-1">24</div>
              <div className="text-sm text-muted-foreground">Calculations Run</div>
              <div className="text-xs text-muted-foreground mt-1">This month</div>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-chart-5 mb-1">0</div>
              <div className="text-sm text-muted-foreground">Data Exports</div>
              <div className="text-xs text-muted-foreground mt-1">This month</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Monthly Activity</h4>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => (
                <div 
                  key={i} 
                  className="h-3 w-3 rounded-sm bg-muted"
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Activity heatmap - darker squares indicate more usage
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Billing Information</span>
          </CardTitle>
          <CardDescription>
            Payment methods and billing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Payment Method Required</h3>
            <p className="text-muted-foreground mb-4">
              You&apos;re currently on the free plan. No payment information is needed.
            </p>
            <Button variant="outline" disabled>
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Billing History</span>
          </CardTitle>
          <CardDescription>
            Your past invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Billing History</h3>
            <p className="text-muted-foreground">
              Since you&apos;re on the free plan, there&apos;s no billing history to display.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Experience</CardTitle>
          <CardDescription>
            Unlock advanced features with Red Sovereign&apos;s premium services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg glass-panel-hover">
              <h4 className="font-semibold mb-2">Strategy Sprint</h4>
              <p className="text-sm text-muted-foreground mb-3">
                1-on-1 consultation to turn your revenue models into actionable growth strategies
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">$2,500</span>
                <Button size="sm" disabled>
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="p-4 border border-border rounded-lg glass-panel-hover">
              <h4 className="font-semibold mb-2">Growth Consulting</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Ongoing support and expert guidance for scaling your B2B business
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Custom</span>
                <Button size="sm" disabled>
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm">
              <strong>Ready to accelerate?</strong> Book a Strategy Sprint when you have 3+ scenarios modeled to get personalized growth strategies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}