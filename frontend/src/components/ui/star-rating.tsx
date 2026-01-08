import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  showText?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 16,
  className,
  showText = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= maxRating; i++) {
    const isFull = i <= fullStars;
    const isHalf = !isFull && i === fullStars + 1 && hasHalfStar;

    stars.push(
      <button
        key={i}
        type={interactive ? "button" : undefined}
        disabled={!interactive}
        onClick={() => interactive && onRatingChange?.(i)}
        className={cn(
          "transition-colors",
          interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
        )}
      >
        <Star
          size={size}
          className={cn(
            "text-yellow-400",
            isFull || isHalf ? "fill-current" : "text-gray-300",
            isHalf && "relative" // We'd need custom SVG for true half-star, using full star for now or overlay
          )}
        />
      </button>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">{stars}</div>
      {showText && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
