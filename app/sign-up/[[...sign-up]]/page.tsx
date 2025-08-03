import { SignUp } from '@clerk/nextjs'

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
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-transparent shadow-none',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              footerActionLink: 'text-primary hover:text-primary/80',
              formFieldInput: 'bg-background border-border',
              dividerLine: 'bg-border',
              dividerText: 'text-muted-foreground',
              socialButtonsBlockButton: 'bg-muted border-border hover:bg-muted/80',
              socialButtonsBlockButtonText: 'text-foreground',
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}