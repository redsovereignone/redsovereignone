import { dark } from '@clerk/themes';

export const clerkAppearance = {
  baseTheme: dark,
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
};

export const userButtonAppearance = {
  baseTheme: dark,
  elements: {
    avatarBox: 'w-10 h-10',
    userButtonPopoverCard: 'bg-muted border border-border',
    userButtonPopoverText: 'text-foreground',
    userButtonPopoverFooter: 'hidden',
  },
};