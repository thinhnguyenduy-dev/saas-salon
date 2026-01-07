"use client"

import { Button } from "@/components/ui/button"
import { Calendar, SlidersHorizontal, ChevronDown } from "lucide-react"

export function FilterBar() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button variant="outline" size="sm" className="rounded-full h-9 border-dashed">
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button variant="outline" size="sm" className="rounded-full h-9">
        <Calendar className="w-4 h-4 mr-2" />
        Any Date
      </Button>
      <Button variant="outline" size="sm" className="rounded-full h-9">
        Treatment Type <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
      </Button>
      <Button variant="outline" size="sm" className="rounded-full h-9">
        Price Range <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
      </Button>
      <Button variant="outline" size="sm" className="rounded-full h-9">
        Gender <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
      </Button>
    </div>
  )
}
