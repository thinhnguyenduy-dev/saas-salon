import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopCardProps {
  id: string;
  name: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  address: string;
  category?: string;
  slug: string;
}

export function ShopCard({ id, name, image, rating, reviewCount, address, category, slug }: ShopCardProps) {
  return (
    <Link href={`/salon/${slug}`} className="group block space-y-3">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
         {image ? (
            <img 
                src={image} 
                alt={name} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
         ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-muted-foreground">
                No Image
            </div>
         )}
         {/* Rating Badge - Bottom Left */}
         <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-bold shadow-sm">
             <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
             {rating}
             <span className="font-normal text-muted-foreground">({reviewCount})</span>
         </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="font-bold text-lg leading-none text-gray-900 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-gray-500 truncate">{address}</p>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{category}</p>
      </div>
    </Link>
  )
}
