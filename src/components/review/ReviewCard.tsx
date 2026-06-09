import type { Review } from '@/types'
import { StarRating } from './StarRating'
import { WifiBar } from './WifiBar'
import { NoiseLevel } from './NoiseLevel'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-surf2 border border-border rounded-[6px] p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <StarRating rating={review.rating} />
        <span className="text-[10px] text-dim">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted mb-2">
        {review.wifi_quality && (
          <span className="flex items-center gap-1">
            Wi-Fi: <WifiBar level={review.wifi_quality} />
          </span>
        )}
        {review.noise_level && <NoiseLevel level={review.noise_level} />}
        {review.power_outlets !== null && (
          <span>Power: {review.power_outlets ? '✅' : '❌'}</span>
        )}
      </div>
      {review.body && (
        <p className="text-[12px] text-txt leading-relaxed">{review.body}</p>
      )}
    </div>
  )
}
