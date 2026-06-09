import type { PriceRange } from '@/types'

const LABELS = ['', '$ budget', '$$ mid', '$$$ premium']

export function PriceBar({ price }: { price: PriceRange }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="inline-block w-[9px] h-[3px] rounded-sm"
          style={{ background: i <= price ? '#aaa' : '#222', marginRight: i < 3 ? '2px' : 0 }}
        />
      ))}
      <span className="text-[10px] text-[#555] ml-1">{LABELS[price]}</span>
    </div>
  )
}
