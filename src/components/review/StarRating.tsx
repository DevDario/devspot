const STAR_COLOR = '#e8c84a'
const STAR_EMPTY = '#2a2a2a'

export function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-[1px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            color: i <= Math.round(rating) ? STAR_COLOR : STAR_EMPTY,
            fontSize: size,
          }}
        >
          ★
        </span>
      ))}
    </span>
  )
}

export function InteractiveStars({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  return (
    <span className="inline-flex gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="bg-none border-none cursor-pointer p-0 text-[18px] leading-none transition-opacity hover:opacity-80"
          style={{ color: i <= rating ? STAR_COLOR : '#2a2a2a' }}
        >
          ★
        </button>
      ))}
    </span>
  )
}
