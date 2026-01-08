'use client';

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
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { Logo } from "@/components/ui/logo";

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Bookings',
    icon: Calendar,
    href: '/dashboard/bookings',
    color: 'text-violet-500',
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/dashboard/customers',
    color: 'text-pink-700',
  },
  {
    label: 'Services',
    icon: Scissors,
    href: '/dashboard/services',
    color: 'text-orange-700',
  },
  {
    label: 'Staff',
    icon: UserCog,
    href: '/dashboard/staff',
    color: 'text-teal-500',
  },
  {
    label: 'Billing',
    icon: CreditCard,
    href: '/dashboard/billing',
    color: 'text-emerald-500',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <Logo className="h-8 w-auto text-primary" />
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
                className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                pathname === route.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground',
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center p-3 text-sm text-muted-foreground">
          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {session?.user?.email}
          </div>
          <button onClick={() => signOut()} className="ml-auto hover:text-red-500">
             <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
