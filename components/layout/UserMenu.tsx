'use client'

import Link from 'next/link'
import { useClerk } from '@clerk/nextjs'
import { 
  User, 
  Settings, 
  CreditCard, 
  Download, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Palette
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface UserMenuProps {
  user: any // Clerk user object
}

export function UserMenu({ user }: UserMenuProps) {
  const { signOut } = useClerk()

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = user?.firstName || user?.fullName || 'User'
  const initials = getInitials(displayName)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-sm font-medium">
            {displayName}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/settings/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings/account" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings/billing" className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing & Usage
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings/preferences" className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4" />
            Preferences
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/export" className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/help" className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}