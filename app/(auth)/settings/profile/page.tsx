import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'

export default async function ProfilePage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.fullName || 'User'
  const initials = getInitials(displayName)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your personal information and account details
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.imageUrl} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{displayName}</h3>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Edit className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name</label>
              <div className="input-field bg-muted/50 cursor-not-allowed">
                {user?.firstName || 'Not provided'}
              </div>
              <p className="form-helper">
                Managed through your Clerk account
              </p>
            </div>
            
            <div>
              <label className="form-label">Last Name</label>
              <div className="input-field bg-muted/50 cursor-not-allowed">
                {user?.lastName || 'Not provided'}
              </div>
              <p className="form-helper">
                Managed through your Clerk account
              </p>
            </div>
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <div className="input-field bg-muted/50 cursor-not-allowed">
              {user?.primaryEmailAddress?.emailAddress}
            </div>
            <p className="form-helper">
              Your primary email address used for notifications
            </p>
          </div>

          <div>
            <label className="form-label">User ID</label>
            <div className="input-field bg-muted/50 cursor-not-allowed font-mono text-sm">
              {user?.id}
            </div>
            <p className="form-helper">
              Your unique user identifier
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">
                Account created: {new Date(user?.createdAt || 0).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(user?.updatedAt || 0).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline">
              Manage in Clerk
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Add your company details for better revenue modeling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="form-label">Company Name</label>
            <input 
              className="input-field" 
              placeholder="Enter your company name"
              disabled
            />
            <p className="form-helper">
              Coming soon - customize company information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Industry</label>
              <input 
                className="input-field" 
                placeholder="e.g., SaaS, Consulting"
                disabled
              />
            </div>
            
            <div>
              <label className="form-label">Company Size</label>
              <input 
                className="input-field" 
                placeholder="e.g., 10-50 employees"
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button disabled>
              Save Company Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}