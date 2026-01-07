"use client"

import { Button } from "@/components/ui/button"
import { Calendar, SlidersHorizontal, ChevronDown, ArrowDownAZ, ArrowUpAZ } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || 'recommended'
  const currentPrice = searchParams.get('price')

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Sort Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={currentSort !== 'recommended' ? 'secondary' : 'outline'} size="sm" className="rounded-full h-9">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Sort: {currentSort === 'price_asc' ? 'Price: Low to High' : currentSort === 'price_desc' ? 'Price: High to Low' : 'Recommended'}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => updateParam('sort', 'recommended')}>Recommended</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateParam('sort', 'price_asc')}>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateParam('sort', 'price_desc')}>Price: High to Low</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      <Button variant="outline" size="sm" className="rounded-full h-9">
        <Calendar className="w-4 h-4 mr-2" />
        Any Date
      </Button>

      {/* Price Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
             <Button variant={currentPrice ? 'secondary' : 'outline'} size="sm" className="rounded-full h-9">
                Price {currentPrice ? `: ${currentPrice}` : ''} <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onClick={() => updateParam('price', null)}>Any Price</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateParam('price', 'cheap')}>$ (Cheap)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateParam('price', 'moderate')}>$$ (Moderate)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateParam('price', 'expensive')}>$$$ (Expensive)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" className="rounded-full h-9">
        Gender <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
      </Button>
    </div>
  )
}
