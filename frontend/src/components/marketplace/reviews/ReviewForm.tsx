"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/ui/star-rating"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api-client"

export function ReviewForm({ shopId, onSubmitted }: { shopId: string, onSubmitted?: () => void }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: "Rating required",
                description: "Please select a star rating",
                variant: "destructive"
            });
            return;
        }
        
        setSubmitting(true);
        try {
            await apiClient.post('/reviews', {
                shopId,
                rating,
                comment,
            });
            
            setRating(0);
            setComment("");
            toast({
                title: "Review submitted",
                description: "Thank you for your feedback!",
            });
            
            if (onSubmitted) onSubmitted();
        } catch (e: any) {
            console.error(e);
            
            const isUnauthorized = e.response?.status === 401;
            
            toast({
                title: isUnauthorized ? "Login required" : "Submission failed",
                description: isUnauthorized 
                    ? "You must be logged in to post a review." 
                    : "Please try again later.",
                variant: "destructive",
                action: isUnauthorized ? (
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
                        Login
                    </Button>
                ) : undefined
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-4 border p-6 rounded-xl bg-muted/30">
            <div className="space-y-1">
                <h3 className="font-bold text-lg">Write a Review</h3>
                <p className="text-sm text-muted-foreground">Share your experience with others</p>
            </div>
            
            <div className="py-2">
                <StarRating 
                    rating={rating} 
                    interactive={true} 
                    onRatingChange={setRating} 
                    size={28}
                    className="gap-2"
                />
            </div>
            
            <Textarea 
                placeholder="Tell us about your experience..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] bg-white"
            />
            
            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
                    {submitting ? "Submitting..." : "Post Review"}
                </Button>
            </div>
        </div>
    )
}
