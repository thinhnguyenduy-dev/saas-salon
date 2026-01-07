"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { Star, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    customer?: {
        fullName: string;
    }
}

export function ReviewList({ shopId }: { shopId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!shopId) return;
        apiClient.get(`/reviews/shop/${shopId}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error("Failed to fetch reviews", err))
            .finally(() => setLoading(false));
    }, [shopId]);

    if (loading) return <div className="text-sm text-muted-foreground">Loading reviews...</div>;

    if (reviews.length === 0) {
        return <div className="text-sm text-muted-foreground italic">No reviews yet.</div>;
    }

    return (
        <div className="space-y-4">
             {reviews.map(review => (
                 <Card key={review.id}>
                     <CardContent className="p-4 space-y-2">
                         <div className="flex justify-between items-start">
                             <div className="flex items-center gap-2">
                                 <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                     <User className="h-4 w-4" />
                                 </div>
                                 <div>
                                     <p className="font-bold text-sm">{review.customer?.fullName || 'Guest'}</p>
                                     <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
                                 </div>
                             </div>
                             <div className="flex">
                                 {Array.from({ length: 5 }).map((_, i) => (
                                     <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                 ))}
                             </div>
                         </div>
                         <p className="text-sm mt-2">{review.comment}</p>
                     </CardContent>
                 </Card>
             ))}
        </div>
    )
}
