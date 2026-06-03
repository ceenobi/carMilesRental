import { Star, StarHalf } from "lucide-react";

export const getRating = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0 && rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          strokeWidth={1}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <StarHalf
          key={i}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          strokeWidth={1}
        />,
      );
    } else {
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 text-gray-300"
          strokeWidth={1}
        />,
      );
    }
  }
  return stars;
};