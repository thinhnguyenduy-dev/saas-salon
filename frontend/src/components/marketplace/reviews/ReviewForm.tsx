"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import apiClient from "@/lib/api-client"

export function ReviewForm({ shopId, onSubmitted }: { shopId: string, onSubmitted?: () => void }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await apiClient.post('/reviews', {
                shopId,
                rating,
                comment,
                customerId: null, // Anonymous for now, or link if logged in
            });
            setRating(0);
            setComment("");
            if (onSubmitted) onSubmitted();
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
            <h3 className="font-bold">Write a Review</h3>
            <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} onClick={() => setRating(i + 1)} type="button">
                        <Star className={`h-6 w-6 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                ))}
            </div>
            <Textarea 
                placeholder="Share your experience..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
                {submitting ? "Submitting..." : "Post Review"}
            </Button>
        </div>
    )
}
