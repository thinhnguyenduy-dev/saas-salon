"use client"

import { useBookingStore } from "@/hooks/use-booking-store"
import { Button } from "@/components/ui/button"
import { ChevronLeft, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Steps will be imported here
import { StepServices } from "@/components/marketplace/booking/step-services"
import { StepStaff } from "@/components/marketplace/booking/step-staff"
import { StepTime } from "@/components/marketplace/booking/step-time"
import { StepCheckout } from "@/components/marketplace/booking/step-checkout"
import { useEffect } from "react"
import { ServiceCategory } from "@/components/marketplace/service-list";

interface ShopData {
    id: string;
    name: string;
    services: any[];
    staff: any[];
}

export default function BookingWizard({ shop }: { shop: ShopData }) {
    // We can transform services to categories here
    const categoriesMap = new Map<string, ServiceCategory>();
    shop.services.forEach((s: any) => {
        const catName = s.category?.name || 'Other';
        const catId = s.category?.id || 'other';
        if (!categoriesMap.has(catId)) {
            categoriesMap.set(catId, { id: catId, name: catName, items: [] });
        }
        categoriesMap.get(catId)?.items.push({
            id: s.id,
            name: s.name,
            duration: s.duration,
            price: Number(s.price),
            description: s.description,
            categoryId: catId
        });
    });
    const categories = Array.from(categoriesMap.values());
  const router = useRouter()
  const { step, setStep, services, reset } = useBookingStore()

  const handleBack = () => {
    if (step === 1) {
      reset()
      router.back()
    } else {
      setStep(step - 1)
    }
  }

  const handleClose = () => {
    reset()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-50 sticky top-0">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex flex-col items-center">
          <span className="font-bold text-sm">{shop.name}</span>
          <div className="flex gap-1 mt-1">
             {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} 
                />
             ))}
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-6">
        {step === 1 && <StepServices categories={categories} />}
        {step === 2 && <StepStaff staffList={shop.staff} />}
        {step === 3 && <StepTime shopId={shop.id} />}
        {step === 4 && <StepCheckout shop={shop} />}
      </main>

      {/* Footer / Summary (Visible if services selected) */}
      {services.length > 0 && step < 4 && (
        <div className="border-t p-4 bg-background sticky bottom-0 safe-area-bottom shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
           <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{services.length} services selected</p>
                <p className="font-bold text-lg">${services.reduce((acc, s) => acc + s.price, 0)}</p>
              </div>
              <Button size="lg" onClick={() => setStep(step + 1)}>
                Continue
              </Button>
           </div>
        </div>
      )}
    </div>
  )
}
