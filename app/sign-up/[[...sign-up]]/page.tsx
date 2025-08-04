import { SignUp } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-theme'

export default function SignUpPage() {
  return (
    <div className="command-center min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gradient">
          Create Your Account
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Start modeling your revenue growth today
        </p>
        <SignUp 
          appearance={clerkAppearance}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}