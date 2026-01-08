import { StarRating } from "@/components/ui/star-rating";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface RatingStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface RatingSummaryProps {
  stats: RatingStats;
}

export function RatingSummary({ stats }: RatingSummaryProps) {
  const { averageRating, totalReviews, distribution } = stats;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center text-center p-4 min-w-[150px]">
             <span className="text-5xl font-bold tracking-tighter text-gray-900">
               {averageRating ? averageRating.toFixed(1) : "0.0"}
             </span>
             <div className="mt-2 mb-1">
               <StarRating rating={averageRating} size={20} />
             </div>
             <span className="text-sm text-muted-foreground">
               {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
             </span>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star as keyof typeof distribution] || 0;
              let percentage = 0;
              if (totalReviews > 0) {
                 percentage = (count / totalReviews) * 100;
              }
              // Ensure valid number between 0 and 100
              if (isNaN(percentage) || !isFinite(percentage)) percentage = 0;
              
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-3 font-medium text-gray-700">{star}</span>
                  <Progress value={percentage} className="h-2.5" />
                  <span className="w-12 text-right text-gray-500 text-xs">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
