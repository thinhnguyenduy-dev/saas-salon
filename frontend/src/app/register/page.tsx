"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import apiClient from "@/lib/api-client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<"CUSTOMER" | "OWNER">("CUSTOMER")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    try {
      await apiClient.post("/auth/register", {
        email,
        password,
        fullName,
        role: role // Send selected role
      })

      toast.success("Account created! Please login.")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        
        <div className="px-6 pb-2">
            <Tabs defaultValue="CUSTOMER" onValueChange={(val) => setRole(val as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="CUSTOMER">Book Salons</TabsTrigger>
                    <TabsTrigger value="OWNER">List My Salon</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        <form onSubmit={onSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
             <Button className="w-full" disabled={loading}>
              {loading ? "Creating account..." : `Create ${role === 'OWNER' ? 'Partner' : 'Customer'} Account`}
            </Button>
             <div className="text-sm text-center text-muted-foreground">
                Already have an account? <Link href="/login" className="underline">Sign in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
