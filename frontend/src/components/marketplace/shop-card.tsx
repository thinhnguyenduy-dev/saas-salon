import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  address: string;
  category: string;
  slug: string;
}

export function ShopCard({ id, name, image, rating, reviewCount, address, category, slug }: ShopCardProps) {
  return (
    <Link href={`/salon/${slug}`} className="group block bg-background border rounded-xl overflow-hidden hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="w-full sm:w-40 h-40 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
             {/* Placeholder for actual image */}
             <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-muted-foreground text-xs">
               {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : "No Image"}
             </div>
             <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
               <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
               {rating}
             </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                 <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{category}</p>
                 <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {address}
            </p>

            <div className="flex items-center gap-2 mt-3 text-sm">
               <span className="font-semibold">{rating} Excellent</span>
               <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3">
             <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Next slot</span>
                <span className="text-sm font-medium text-green-600">Today, 2:00 PM</span>
             </div>
             <Button size="sm" variant="secondary">Book</Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
