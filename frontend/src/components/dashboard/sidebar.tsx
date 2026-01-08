'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  Scissors,
  Settings,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent } from '@/components/ui/sheet';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Bookings',
    icon: Calendar,
    href: '/dashboard/bookings',
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/dashboard/customers',
  },
  {
    label: 'Services',
    icon: Scissors,
    href: '/dashboard/services',
  },
  {
    label: 'Staff',
    icon: UserCog,
    href: '/dashboard/staff',
  },
  {
    label: 'Billing',
    icon: CreditCard,
    href: '/dashboard/billing',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({ isMobile, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full min-h-screen bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14" onClick={handleLinkClick}>
          <Logo className="h-8 w-auto text-white" />
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={handleLinkClick}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-800 rounded-lg transition',
                pathname === route.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400',
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', pathname === route.href ? 'text-white' : 'text-gray-400')} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="hidden md:block">
      <SidebarContent />
    </div>
  );
}

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-72">
        <SidebarContent isMobile onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
}
