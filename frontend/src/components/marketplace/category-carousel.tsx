"use client"

import { Scissors, Sparkles, Smile, Sun, Droplet, Crown } from "lucide-react"
import Link from "next/link"

const categories = [
  { name: "Hair", icon: Scissors, color: "bg-purple-100 text-purple-600" },
  { name: "Nails", icon: Sparkles, color: "bg-pink-100 text-pink-600" },
  { name: "Facials", icon: Smile, color: "bg-blue-100 text-blue-600" },
  { name: "Massage", icon: Sun, color: "bg-orange-100 text-orange-600" },
  { name: "Waxing", icon: Droplet, color: "bg-yellow-100 text-yellow-600" },
  { name: "Makeup", icon: Crown, color: "bg-red-100 text-red-600" },
]

export function CategoryCarousel() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide py-4">
      {categories.map((cat) => (
        <Link 
          key={cat.name} 
          href={`/search?category=${cat.name}`}
          className="flex flex-col items-center gap-3 min-w-[100px] group cursor-pointer"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
            <cat.icon className="w-8 h-8" />
          </div>
          <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
