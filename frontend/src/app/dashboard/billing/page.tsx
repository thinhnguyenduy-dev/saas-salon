"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Check } from "lucide-react"

export default function DashboardBillingPage() {
  const [loading, setLoading] = useState(true)
  const [shop, setShop] = useState<any>(null)

  useEffect(() => {
    fetchMyShop()
  }, [])

  const fetchMyShop = async () => {
      try {
           const res = await apiClient.get('/shops/my-shop');
           setShop(res.data)
      } catch (error) {
          console.error("Failed to fetch shop", error)
      } finally {
          setLoading(false)
      }
  }

  if (loading) return <div className="p-8">Loading Billing...</div>

  const plan = shop?.subscriptionPlan || 'FREE';

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Plan Card */}
        <Card className={plan === 'PRO' ? "border-primary" : ""}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Current Plan
                    <Badge variant={plan === 'FREE' ? "secondary" : "default"}>{plan}</Badge>
                </CardTitle>
                <CardDescription>You are currently on the {plan} tier.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{plan === 'FREE' ? '$0' : '$29'}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm"><Check className="mr-2 h-4 w-4 text-primary" /> Basic Features</div>
                    {plan !== 'FREE' && <div className="flex items-center text-sm"><Check className="mr-2 h-4 w-4 text-primary" /> Advanced Analytics</div>}
                </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full" disabled={plan === 'PRO'}>
                    {plan === 'PRO' ? 'Active' : 'Upgrade to Pro'}
                 </Button>
            </CardFooter>
        </Card>

        {/* Payment Method Card - Placeholder */}
        <Card>
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment details</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4 border p-4 rounded-md">
                    <CreditCard className="h-6 w-6" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">No payment method added</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">Add Payment Method</Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  )
}
