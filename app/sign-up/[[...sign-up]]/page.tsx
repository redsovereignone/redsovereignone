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
            baseTheme: 'dark',
            variables: {
              colorPrimary: '#C71F37',
              colorBackground: '#1A1A1A',
              colorInputBackground: '#111111',
              colorInputText: '#F5F5F5',
              colorText: '#F5F5F5',
              colorTextSecondary: '#B8B9C3',
              colorDanger: '#EF4444',
              colorSuccess: '#10B981',
              colorNeutral: '#F5F5F5',
              borderRadius: '0.5rem',
            },
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-transparent shadow-none',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-foreground font-semibold',
              footerActionLink: 'text-primary hover:text-primary/80',
              formFieldLabel: 'text-foreground/80',
              formFieldInput: 'bg-background border-border text-foreground placeholder:text-muted-foreground',
              formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground',
              identityPreviewText: 'text-foreground',
              identityPreviewEditButtonIcon: 'text-muted-foreground',
              formHeaderTitle: 'text-foreground',
              formHeaderSubtitle: 'text-muted-foreground',
              footerActionText: 'text-muted-foreground',
              dividerLine: 'bg-border',
              dividerText: 'text-muted-foreground',
              socialButtonsBlockButton: 'bg-muted border-border hover:bg-muted/80 text-foreground',
              socialButtonsBlockButtonText: 'text-foreground font-medium',
              formFieldErrorText: 'text-destructive',
              formFieldSuccessText: 'text-success',
              otpCodeFieldInput: 'bg-background border-border text-foreground',
              formResendCodeLink: 'text-primary hover:text-primary/80',
              alert: 'bg-muted border-border',
              alertText: 'text-foreground',
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}