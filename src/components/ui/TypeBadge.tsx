import type { PlaceType } from '@/types'

export function TypeBadge({ type }: { type: PlaceType }) {
  return (
    <span className="ds-tag">{type}</span>
  )
}
