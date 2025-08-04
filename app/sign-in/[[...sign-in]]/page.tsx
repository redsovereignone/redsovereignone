import { SignIn } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-theme'

export default function SignInPage() {
  return (
    <div className="command-center min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gradient">
          Welcome Back
        </h1>
        <SignIn 
          appearance={clerkAppearance}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}