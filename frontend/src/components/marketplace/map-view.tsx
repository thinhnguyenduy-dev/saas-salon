"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export function MapView() {
  return (
    <div className="w-full h-full bg-slate-100 relative flex items-center justify-center overflow-hidden">
        {/* Placeholder Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "20px 20px"
        }}></div>
        
        <div className="text-center space-y-4 relative z-10 bg-white/80 backdrop-blur p-6 rounded-2xl shadow-sm border">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-8 h-8" />
            </div>
            <div>
                <h3 className="font-bold text-lg">Interactive Map</h3>
                <p className="text-sm text-muted-foreground">Map view integration coming soon.</p>
            </div>
            
        </div>

        {/* Fake Pins for Visuals */}
        <div className="absolute top-1/4 left-1/4">
            <div className="bg-white px-2 py-1 rounded-md shadow-md text-xs font-bold border hover:scale-110 transition-transform cursor-pointer">
                $250k
            </div>
        </div>
         <div className="absolute bottom-1/3 right-1/4">
            <div className="bg-foreground text-background px-2 py-1 rounded-md shadow-md text-xs font-bold border hover:scale-110 transition-transform cursor-pointer">
                $120k
            </div>
        </div>
    </div>
  )
}
