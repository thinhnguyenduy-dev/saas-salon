'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut, Menu } from 'lucide-react';
import { NotificationBell } from './notification-bell';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 md:px-8 justify-between">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1 md:flex-none" />
        
        <div className="flex items-center gap-2 md:gap-4">
          <NotificationBell />
          
          <div className="flex items-center gap-2 md:gap-3 border-l pl-2 md:pl-4">
            <div className="text-sm hidden sm:block">
              <div className="font-medium">{session?.user?.name || 'User'}</div>
              <div className="text-muted-foreground text-xs hidden md:block">{session?.user?.email}</div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => signOut()}
              className="hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
