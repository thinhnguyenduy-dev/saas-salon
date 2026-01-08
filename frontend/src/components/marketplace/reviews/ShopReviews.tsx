"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { ReviewList } from "./ReviewList"
import { ReviewForm } from "./ReviewForm"
import { RatingSummary } from "@/components/reviews/rating-summary"

interface ShopReviewsProps {
    shopId: string;
}

export function ShopReviews({ shopId }: ShopReviewsProps) {
    const [stats, setStats] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (!shopId) return;
        apiClient.get(`/reviews/shop/${shopId}/stats`)
            .then(res => {
                const data = res.data.data || res.data;
                setStats(data);
            })
            .catch(console.error);
    }, [shopId, refreshTrigger]);

    const handleReviewSubmitted = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews</h2>
            </div>

            {stats && (
                <div className="mb-8">
                    <RatingSummary stats={stats} />
                </div>
            )}
            
            <div className="grid gap-8">
                <ReviewForm shopId={shopId} onSubmitted={handleReviewSubmitted} />
                <ReviewList shopId={shopId} key={refreshTrigger} />
            </div>
        </div>
    );
}
