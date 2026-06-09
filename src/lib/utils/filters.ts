import type { Place, Filters } from '@/types'

export function filterPlaces(places: Place[], filters: Filters, query: string): Place[] {
  return places.filter((p) => {
    if (query) {
      const q = query.toLowerCase()
      const nameMatch = p.name.toLowerCase().includes(q)
      const tagMatch = p.tags.some((t) => t.toLowerCase().includes(q))
      if (!nameMatch && !tagMatch) return false
    }
    if (filters.vibe !== 'all' && p.vibe !== filters.vibe) return false
    if (filters.use !== 'all' && !p.use_cases.includes(filters.use)) return false
    if (filters.type !== 'all' && p.type !== filters.type) return false
    return true
  })
}
