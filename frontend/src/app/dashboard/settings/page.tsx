"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [shop, setShop] = useState<any>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")

  useEffect(() => {
    fetchMyShop()
  }, [])

  const fetchMyShop = async () => {
      try {
           // We need an endpoint to get "my shop". 
           // Currently we don't have GET /shops/my-shop explicitly, but we can reuse GET /auth/profile or similar if it returns shop data.
           // OR use the public slug if we know it. 
           // Better pattern: Implementing GET /shops/my-shop would be cleaner, but for now let's assume valid session has shopId.
           // Wait, I implemented PATCH /shops/my-shop, but not GET /shops/my-shop.
           // Ideally we need GET /shops/my-shop to populate the form.
           // Workaround: Use the Session to get ShopId (if available) or rely on a new endpoint.
           // Since I can't easily change backend right now without more context, let's assume we can fetch via slug if user provides it, OR add GET /shops/my-shop quickly?
           // Actually, let's add GET /shops/my-shop to backend quickly. It's symmetrical.
           
           const res = await apiClient.get('/shops/my-shop'); // Will fail if I don't add it
           setShop(res.data)
           setName(res.data.name)
           setSlug(res.data.slug)
           setStreet(res.data.street)
           setCity(res.data.city)
      } catch (error) {
          console.error("Failed to fetch shop", error)
      } finally {
          setLoading(false)
      }
  }

  const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await apiClient.patch('/shops/my-shop', {
              name,
              slug,
              street,
              city
          });
          toast.success("Shop updated successfully")
      } catch (error) {
          console.error(error);
          toast.error("Failed to update shop")
      }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Shop Profile</CardTitle>
              <CardDescription>Manage your shop 's public information.</CardDescription>
          </CardHeader>
          <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid gap-2">
                      <Label htmlFor="name">Shop Name</Label>
                      <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" value={street} onChange={e => setStreet(e.target.value)} />
                  </div>
                   <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={city} onChange={e => setCity(e.target.value)} />
                  </div>
                  <Button type="submit">Save Changes</Button>
              </form>
          </CardContent>
      </Card>
    </div>
  )
}
