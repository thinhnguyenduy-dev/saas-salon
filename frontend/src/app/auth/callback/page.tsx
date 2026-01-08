"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessToken = searchParams.get("accessToken")

  useEffect(() => {
    if (accessToken) {
      signIn("credentials", {
        token: accessToken,
        redirect: false,
      }).then((result) => {
        if (result?.ok) {
          router.push("/dashboard") 
          router.refresh()
        } else {
          router.push("/login?error=OAuthFailed")
        }
      })
    } else {
       router.push("/login?error=NoToken")
    }
  }, [accessToken, router])

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Logging you in...</p>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  )
}
