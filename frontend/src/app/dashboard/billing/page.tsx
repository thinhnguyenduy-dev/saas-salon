"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"

export default function DashboardBillingPage() {
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [shop, setShop] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
      try {
           const [shopRes, plansRes] = await Promise.all([
               apiClient.get('/shops/my-shop'),
               apiClient.get('/billing/plans')
           ]);
           // API uses TransformInterceptor, so response structure is { success: true, data: ... }
           // Axios returns this in res.data
           setShop(shopRes.data.data?.shop);
           setPlans(plansRes.data.data || []);
      } catch (error) {
          console.error("Failed to fetch billing data", error)
      } finally {
          setLoading(false)
      }
  }

  const handleUpgrade = async (priceId: string) => {
    if (!priceId) {
        alert("Configuration Error: Price ID is missing.");
        return;
    }
    setProcessing(true);
    try {
        const res = await apiClient.post('/billing/checkout', { priceId });
        // Handle wrapped response
        const checkoutUrl = res.data.data?.url || res.data?.url; 
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        } else {
             console.error("No checkout URL returned", res.data);
             alert("Failed to start upgrade. Please check console.");
        }
    } catch (error) {
        console.error("Upgrade failed", error);
        alert("Failed to start upgrade process.");
    } finally {
        setProcessing(false);
    }
  }

  const handlePortal = async () => {
      setProcessing(true);
      try {
          const res = await apiClient.post('/billing/portal');
          const portalUrl = res.data.data?.url || res.data?.url;
           if (portalUrl) {
            window.location.href = portalUrl;
        }
      } catch (error) {
          console.error("Portal failed", error);
          alert("Failed to open billing portal.");
      } finally {
          setProcessing(false);
      }
  }

  if (loading) return <div className="p-8">Loading Billing...</div>

  const currentPlan = shop?.subscriptionPlan || 'FREE';
  const isPro = currentPlan === 'PRO';

  // Find Pro Plan to display dynamic price/features if desired, or just iterate
  const safePlans = Array.isArray(plans) ? plans : [];
  const proPlan = safePlans.find(p => p.id === 'pro');
  const freePlan = safePlans.find(p => p.id === 'free');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {safePlans.length === 0 && (
            <div className="col-span-3 text-center p-8 text-muted-foreground">
                No subscription plans available. Please contact support.
            </div>
        )}
        {safePlans.map((plan) => {
             const isActive = currentPlan.toLowerCase() === plan.id;
             // Simple logic: If current is free, show upgrade on Pro. If current is Pro, show Manage on Pro.
             const showUpgrade = !isPro && plan.id === 'pro';
             const showManage = isPro && plan.id === 'pro';
             const isFreeCard = plan.id === 'free';
             
             return (
                <Card key={plan.id} className={isActive ? "border-primary" : ""}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {plan.name}
                            {isActive && <Badge variant="default">Current</Badge>}
                        </CardTitle>
                        <CardDescription>{plan.id === 'pro' ? 'For growing businesses' : 'Get started for free'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                        <div className="mt-4 space-y-2">
                            {plan.features.map((feat: string, i: number) => (
                                <div key={i} className="flex items-center text-sm"><Check className="mr-2 h-4 w-4 text-primary" /> {feat}</div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        {showUpgrade && (
                            <Button className="w-full" onClick={() => handleUpgrade(plan.priceId)} disabled={processing}>
                                {processing ? <Loader2 className="animate-spin h-4 w-4" /> : 'Upgrade to Pro'}
                            </Button>
                        )}
                        {showManage && (
                            <Button className="w-full" variant="outline" onClick={handlePortal} disabled={processing}>
                                {processing ? <Loader2 className="animate-spin h-4 w-4" /> : 'Manage Subscription'}
                            </Button>
                        )}
                        {isFreeCard && !isActive && (
                             <Button className="w-full" variant="ghost" disabled>
                                Free Plan
                            </Button>
                        )}
                         {isFreeCard && isActive && (
                             <Button className="w-full" variant="secondary" disabled>
                                Active
                            </Button>
                        )}
                    </CardFooter>
                </Card>
             );
        })}
      </div>
    </div>
  )
}
