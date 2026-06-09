import { useTranslation } from 'react-i18next'
import type { Vibe, UseCase, PlaceType, Filters } from '@/types'
import { Pill } from '@/components/ui/Pill'

const VALUES = {
  vibes: ['all', 'calm', 'retro', 'modern'] as const,
  uses: ['all', 'coding', 'cowork', 'meetings', 'hackathon', 'chill'] as const,
  types: ['all', 'café', 'cowork', 'esplanada', 'restaurant', 'library'] as const,
}

interface FilterBarProps {
  filters: Filters
  onFilterChange: (f: Filters) => void
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-[14px] overflow-x-auto max-md:flex-nowrap max-md:pb-1 md:flex-wrap">
      <div className="flex gap-1 items-center">
        <span className="text-dim text-[10px] mr-1">{t('filters.vibe')}</span>
        {VALUES.vibes.map((value) => (
          <Pill
            key={value}
            label={value === 'all' ? t('filters.all') : value}
            active={filters.vibe === value}
            variant="a"
            onClick={() => onFilterChange({ ...filters, vibe: value as Vibe | 'all' })}
          />
        ))}
      </div>
      <div className="flex gap-1 items-center">
        <span className="text-dim text-[10px] mr-1">{t('filters.use')}</span>
        {VALUES.uses.map((value) => (
          <Pill
            key={value}
            label={value === 'all' ? t('filters.all') : value}
            active={filters.use === value}
            variant="g"
            onClick={() => onFilterChange({ ...filters, use: value as UseCase | 'all' })}
          />
        ))}
      </div>
      <div className="flex gap-1 items-center">
        <span className="text-dim text-[10px] mr-1">{t('filters.type')}</span>
        {VALUES.types.map((value) => (
          <Pill
            key={value}
            label={value === 'all' ? t('filters.all') : value}
            active={filters.type === value}
            variant="s"
            onClick={() => onFilterChange({ ...filters, type: value as PlaceType | 'all' })}
          />
        ))}
      </div>
    </div>
  )
}
