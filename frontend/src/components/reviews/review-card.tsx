import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  isVerified: boolean;
  customer?: {
    fullName: string;
    profileImage?: string;
  };
  response?: string;
  responseDate?: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="border-none shadow-sm bg-white mb-4">
      <CardHeader className="flex flex-row items-start gap-4 p-4 pb-0">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={review.customer?.profileImage} />
          <AvatarFallback>
            {review.customer?.fullName?.substring(0, 2).toUpperCase() || "CN"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">
                {review.customer?.fullName || "Anonymous Customer"}
              </h4>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
            {review.isVerified && (
              <Badge variant="secondary" className="text-xs gap-1 h-5 px-1.5 font-normal text-green-700 bg-green-50 border-green-200">
                <CheckCircle2 size={10} />
                Verified
              </Badge>
            )}
          </div>
          <div className="mt-1">
            <StarRating rating={review.rating} size={14} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        {review.comment && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {review.comment}
          </p>
        )}
        
        {review.response && (
          <div className="mt-4 bg-muted/50 p-3 rounded-md text-sm">
             <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs text-primary">Response from Owner</span>
                <span className="text-xs text-muted-foreground">
                    {review.responseDate && new Date(review.responseDate).toLocaleDateString()}
                </span>
             </div>
             <p className="text-gray-600 italic">"{review.response}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
