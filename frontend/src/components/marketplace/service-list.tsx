"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ServiceItem {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  description?: string;
  categoryId?: string;
}

export interface ServiceCategory {
  id: string; // valid if we have categories, else we can group by arbitrary key
  name: string;
  items: ServiceItem[];
}

interface ServiceListProps {
  categories: ServiceCategory[];
}

export function ServiceList({ categories }: ServiceListProps) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.id} id={category.id} className="scroll-mt-20">
          <h3 className="font-bold text-xl mb-4">{category.name}</h3>
          <div className="bg-background border rounded-xl overflow-hidden divide-y">
            {category.items.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-start hover:bg-muted/30 transition-colors group cursor-pointer">
                <div className="flex-1 pr-4">
                  <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-base">{item.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.duration} mins</p>
                   {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                  <p className="text-sm font-medium mt-1">${item.price}</p>
                </div>
                
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
