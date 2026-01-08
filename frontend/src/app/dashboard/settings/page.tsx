"use client"

import Link from 'next/link'
import { Clock, User, Bell, Shield } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const settingsPages = [
  {
    title: 'Business Hours',
    description: 'Set your weekly schedule and break times',
    icon: Clock,
    href: '/dashboard/settings/business-hours',
  },
  {
    title: 'Profile',
    description: 'Manage your shop profile and information',
    icon: User,
    href: '/dashboard/settings/profile',
  },
  {
    title: 'Notifications',
    description: 'Configure notification preferences',
    icon: Bell,
    href: '/dashboard/settings/notifications',
  },
  {
    title: 'Security',
    description: 'Password and security settings',
    icon: Shield,
    href: '/dashboard/settings/security',
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your shop settings and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsPages.map((page) => (
          <Link key={page.href} href={page.href}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <page.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <CardDescription className="mt-1.5">
                      {page.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
