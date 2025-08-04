import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Trash2, Download, Key, Mail } from 'lucide-react'

// Mock function to get user scenarios count
async function getUserStats(userId: string) {
  // In a real app, this would query the database
  return {
    scenariosCount: 3,
    lastActivity: new Date(),
    accountStatus: 'active'
  }
}

export default async function AccountPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const stats = await getUserStats(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account security, data, and account status
        </p>
      </div>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>
            Your account status and key information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.scenariosCount}</div>
              <div className="text-sm text-muted-foreground">Revenue Scenarios</div>
            </div>
            
            <div className="text-center">
              <Badge variant="outline" className="badge-success">
                {stats.accountStatus.toUpperCase()}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Account Status</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium">
                {stats.lastActivity.toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">Last Activity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Password</div>
                <div className="text-sm text-muted-foreground">
                  Managed through Clerk authentication
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Email Verification</div>
                <div className="text-sm text-muted-foreground">
                  {user?.primaryEmailAddress?.verification?.status === 'verified' 
                    ? 'Your email is verified' 
                    : 'Email verification pending'
                  }
                </div>
              </div>
            </div>
            <Badge variant={user?.primaryEmailAddress?.verification?.status === 'verified' ? 'outline' : 'destructive'}>
              {user?.primaryEmailAddress?.verification?.status === 'verified' ? 'Verified' : 'Unverified'}
            </Badge>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <Shield className="h-4 w-4 inline mr-1" />
              Your account security is managed by Clerk, providing enterprise-grade authentication with features like MFA, session management, and secure password handling.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Control your data and account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">Export Your Data</div>
              <div className="text-sm text-muted-foreground">
                Download all your revenue scenarios and calculations
              </div>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium">Account Deletion</div>
              <div className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </div>
            </div>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
          
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              <strong>Warning:</strong> Account deletion is permanent and cannot be undone. All your scenarios, settings, and data will be permanently removed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Technical details about your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="font-mono text-sm">{user.id}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Account Created</span>
              <span className="text-sm">{new Date(user.createdAt || 0).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm">{new Date(user.updatedAt || 0).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Authentication Provider</span>
              <Badge variant="outline">Clerk</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}