import type { Place } from '@/types'
import { StarRating } from '@/components/review/StarRating'

interface PlaceStatsProps {
  place: Place
}

export function PlaceStats({ place }: PlaceStatsProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted">Rating</span>
        <StarRating rating={4.5} />
        <span className="text-[#e8c84a] text-[10px]">4.5</span>
      </div>
    </div>
  )
}
