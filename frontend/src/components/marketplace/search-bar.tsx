"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

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
      className="flex flex-col md:flex-row items-center gap-2 bg-background p-2 rounded-xl shadow-lg border max-w-3xl w-full mx-auto"
    >
      <div className="flex-1 w-full relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
        <Input 
          className="pl-10 border-0 shadow-none focus-visible:ring-0 text-base h-12" 
          placeholder="Treatment (e.g. Haircut) or Venue name..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <div className="hidden md:block w-px h-8 bg-border mx-2" />
      
      <div className="flex-1 w-full relative group">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
        <Input 
          className="pl-10 border-0 shadow-none focus-visible:ring-0 text-base h-12" 
          placeholder="Current Location" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <Button size="lg" className="w-full md:w-auto px-8 h-12 text-base font-semibold rounded-lg">
        Search
      </Button>
    </form>
  )
}
