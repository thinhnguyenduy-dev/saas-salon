"use client"

import { useBookingStore, Service } from "@/hooks/use-booking-store"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"

interface StepServicesProps {
  categories: any[]; // strict type would be ServiceCategory[] available from import
}

export function StepServices({ categories }: StepServicesProps) {
  const { services, addService, removeService } = useBookingStore()

  const isSelected = (id: string) => services.some(s => s.id === id)

  const toggleService = (item: any) => {
    if (isSelected(item.id)) {
      removeService(item.id)
    } else {
      addService({
          id: item.id,
          name: item.name,
          price: item.price,
          duration: item.duration
      })
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Select Services</h2>
        <p className="text-muted-foreground">Choose one or more services to book</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id}>
            <h3 className="font-bold text-lg mb-4">{category.name}</h3>
            <div className="bg-background border rounded-xl overflow-hidden divide-y">
              {category.items.map((item: any) => {
                const selected = isSelected(item.id)
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 flex justify-between items-start transition-colors cursor-pointer ${selected ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                    onClick={() => toggleService(item)}
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex justify-between items-center mb-1">
                          <h4 className={`font-semibold text-base ${selected ? 'text-primary' : ''}`}>{item.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.duration} min</p>
                      <p className="text-sm font-medium mt-1">${item.price}</p>
                    </div>
                    
                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${selected ? 'bg-primary border-primary text-primary-foreground' : 'border-input'}`}>
                      {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
