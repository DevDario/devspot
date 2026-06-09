import type { Vibe, UseCase, PlaceType, Filters } from '@/types'
import { Pill } from '@/components/ui/Pill'

const VIBES: { label: string; value: Vibe | 'all' }[] = [
  { label: 'all', value: 'all' },
  { label: 'calm', value: 'calm' },
  { label: 'retro', value: 'retro' },
  { label: 'modern', value: 'modern' },
]

const USES: { label: string; value: UseCase | 'all' }[] = [
  { label: 'all', value: 'all' },
  { label: 'coding', value: 'coding' },
  { label: 'cowork', value: 'cowork' },
  { label: 'meetings', value: 'meetings' },
  { label: 'hackathon', value: 'hackathon' },
  { label: 'chill', value: 'chill' },
]

const TYPES: { label: string; value: PlaceType | 'all' }[] = [
  { label: 'all', value: 'all' },
  { label: 'café', value: 'café' },
  { label: 'cowork', value: 'cowork' },
  { label: 'esplanada', value: 'esplanada' },
  { label: 'restaurant', value: 'restaurant' },
  { label: 'library', value: 'library' },
]

interface FilterBarProps {
  filters: Filters
  onFilterChange: (f: Filters) => void
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-[14px] flex-wrap">
      <div className="flex gap-1 items-center">
        <span className="text-dim text-[10px] mr-1">vibe:</span>
        {VIBES.map(({ label, value }) => (
          <Pill
            key={value}
            label={label}
            active={filters.vibe === value}
            variant="a"
            onClick={() => onFilterChange({ ...filters, vibe: value as Vibe | 'all' })}
          />
        ))}
      </div>
      <div className="flex gap-1 items-center">
        <span className="text-dim text-[10px] mr-1">uso:</span>
        {USES.map(({ label, value }) => (
          <Pill
            key={value}
            label={label}
            active={filters.use === value}
            variant="g"
            onClick={() => onFilterChange({ ...filters, use: value as UseCase | 'all' })}
          />
        ))}
      </div>
      <div className="flex gap-1 items-center">
        <span className="text-dim text-[10px] mr-1">tipo:</span>
        {TYPES.map(({ label, value }) => (
          <Pill
            key={value}
            label={label}
            active={filters.type === value}
            variant="s"
            onClick={() => onFilterChange({ ...filters, type: value as PlaceType | 'all' })}
          />
        ))}
      </div>
    </div>
  )
}
