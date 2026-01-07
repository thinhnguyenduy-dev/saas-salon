"use client"

import { useState } from "react"
import { Search, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (location) params.set("loc", location)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form 
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-center bg-white p-2 rounded-3xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 max-w-4xl w-full mx-auto relative z-20"
    >
      {/* Treatment Field */}
      <div className="flex-1 w-full relative group px-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input 
          className="pl-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-foreground font-medium h-12 text-base placeholder:text-gray-500 placeholder:font-normal" 
          placeholder="All treatments and venues" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <div className="hidden md:block w-px h-8 bg-gray-200 mx-2" />
      
      {/* Location Field */}
      <div className="flex-1 w-full relative group px-2">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input 
          className="pl-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-foreground font-medium h-12 text-base placeholder:text-gray-500 placeholder:font-normal" 
          placeholder="Current location" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-gray-200 mx-2" />

      {/* Date Field (Mock for layout) */}
      <div className="flex-1 w-full relative group px-2">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Button 
            variant="ghost" 
            type="button" 
            className="w-full justify-start pl-10 h-12 text-base font-normal text-gray-500 hover:bg-transparent hover:text-foreground"
        >
            Any time
        </Button>
      </div>

      <Button size="lg" className="w-full md:w-auto px-8 h-12 rounded-full font-bold text-base transition-all">
        Search
      </Button>
    </form>
  )
}
