import { IconCoffee, IconBuilding } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import type { Place } from '@/types'
import { StarRating } from '@/components/review/StarRating'
import { PriceBar } from '@/components/ui/PriceBar'
import { VerifiedBadge } from '@/components/ui/VerifiedBadge'
import { UseCaseBadge } from '@/components/ui/UseCaseBadge'

interface PlaceCardProps {
  place: Place
  selected: boolean
  onClick: (e: React.MouseEvent) => void
}

const TYPE_ICONS: Record<string, typeof IconCoffee> = {
  cowork: IconBuilding,
  café: IconCoffee,
  esplanada: IconCoffee,
  restaurant: IconCoffee,
  library: IconCoffee,
  other: IconCoffee,
}

const TYPE_COLORS: Record<string, string> = {
  café: '#b0b0b0',
  cowork: '#888',
  esplanada: '#666',
  restaurant: '#888',
  library: '#888',
  other: '#888',
}

export function PlaceCard({ place, selected, onClick }: PlaceCardProps) {
  const navigate = useNavigate()
  const Icon = TYPE_ICONS[place.type] || IconCoffee
  const color = TYPE_COLORS[place.type] || '#888'

  return (
    <div
      className={`ds-card px-4 py-[14px] border-b border-border ${
        selected ? 'border-l-2 border-[#888] bg-[rgba(255,255,255,0.02)]' : 'border-l-2 border-transparent'
      }`}
      onClick={(e) => {
        onClick(e)
        navigate(`/place/${place.id}`)
      }}
    >
      <div className="flex gap-2.5">
        <div className="w-9 h-9 bg-surf2 border border-border rounded-[7px] flex items-center justify-center flex-shrink-0">
          <Icon size={17} color={color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="text-[13px] text-[#d8d8d8]">{place.name}</span>
            {place.verified && <VerifiedBadge />}
          </div>
          <div className="text-[10px] text-[#555] mb-1.5">
            {place.type} · {place.hours}
          </div>
          <div className="mb-1.5">
            <PriceBar price={place.price_range} />
          </div>
          <div className="flex flex-wrap gap-[3px] mb-1.5">
            {place.use_cases.map((u) => (
              <UseCaseBadge key={u} useCase={u} />
            ))}
            {place.tags.slice(0, 2).map((t) => (
              <span key={t} className="ds-tag">{t}</span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div>
              <StarRating rating={4.5} />{' '}
              <span className="text-[#e8c84a] text-[10px]">4.5 (14)</span>
            </div>
            <span className="text-[10px] text-[#333]">@{place.submitted_by}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

