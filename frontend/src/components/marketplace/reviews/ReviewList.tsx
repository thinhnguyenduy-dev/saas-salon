"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { ReviewCard, Review } from "@/components/reviews/review-card"
import { Button } from "@/components/ui/button"

export function ReviewList({ shopId }: { shopId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchReviews = async (pageNum: number, append = false) => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/reviews/shop/${shopId}?page=${pageNum}&limit=5`);
            const responseData = res.data;
            const data = responseData.data || responseData; // Handle potential wrapper or direct response
            
            if (append) {
                setReviews(prev => [...prev, ...data.reviews]);
            } else {
                setReviews(data.reviews || []);
            }
            
            setHasMore((data.reviews || []).length === 5); // Simple check for now
        } catch (err) {
            console.error("Failed to fetch reviews", err);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(!shopId) return;
        fetchReviews(1);
    }, [shopId]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage, true);
    };

    if (loading && reviews.length === 0) return <div className="text-sm text-muted-foreground p-4">Loading reviews...</div>;

    if (reviews.length === 0) {
        return <div className="text-sm text-muted-foreground italic p-4">No reviews yet. Be the first to review!</div>;
    }

    return (
        <div className="space-y-6">
             <div className="space-y-4">
                 {reviews.map(review => (
                     <ReviewCard key={review.id} review={review} />
                 ))}
             </div>
             
             {hasMore && (
                 <div className="flex justify-center pt-2">
                     <Button variant="outline" onClick={loadMore} disabled={loading}>
                         {loading ? "Loading..." : "Load More Reviews"}
                     </Button>
                 </div>
             )}
        </div>
    )
}
