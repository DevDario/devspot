import { useState } from 'react'
import type { Place, ViewMode, Filters, PlaceType, Vibe, UseCase } from '@/types'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/filters/FilterBar'
import { PlaceCard } from '@/components/place/PlaceCard'
import { DevSpotMap } from '@/components/map/DevSpotMap'
import { SubmitPlaceModal } from '@/components/place/SubmitPlaceModal'
import { filterPlaces } from '@/lib/utils/filters'
import { IconMapOff } from '@tabler/icons-react'

const MOCK_PLACES: Place[] = [
  { id: '1', name: 'Café Marginal', type: 'café', vibe: 'calm', price_range: 2, hours: '07–22', lat: -8.838, lng: 13.234, address: '', use_cases: ['coding', 'meetings'], tags: ['wifi', 'outlets'], verified: true, submitted_by: 'dev_kafu', created_at: '', updated_at: '' },
  { id: '2', name: 'The Hub Luanda', type: 'cowork', vibe: 'modern', price_range: 3, hours: '08–20', lat: -8.842, lng: 13.238, address: '', use_cases: ['hackathon', 'cowork'], tags: ['wifi', 'AC', 'rooms'], verified: true, submitted_by: 'nzari.dev', created_at: '', updated_at: '' },
  { id: '3', name: 'Esplanada Boa Vista', type: 'esplanada', vibe: 'retro', price_range: 1, hours: '09–18', lat: -8.836, lng: 13.232, address: '', use_cases: ['coding', 'chill'], tags: ['quiet', 'retro'], verified: false, submitted_by: 'mwamba_0x', created_at: '', updated_at: '' },
  { id: '4', name: 'Novaspace Talatona', type: 'cowork', vibe: 'modern', price_range: 3, hours: '08–21', lat: -8.910, lng: 13.190, address: '', use_cases: ['hackathon', 'cowork', 'meetings'], tags: ['projector', 'AC'], verified: true, submitted_by: 'devdario', created_at: '', updated_at: '' },
  { id: '5', name: 'Café do Kinaxixi', type: 'café', vibe: 'retro', price_range: 1, hours: '06–17', lat: -8.830, lng: 13.240, address: '', use_cases: ['chill', 'coding'], tags: ['affordable', 'quiet'], verified: false, submitted_by: 'frontend_kai', created_at: '', updated_at: '' },
]

const DEFAULT_FILTERS: Filters = { vibe: 'all', use: 'all', type: 'all' }

export function Home() {
  const { t } = useTranslation()
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES)
  const [view, setView] = useState<ViewMode>('split')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filtered = filterPlaces(places, filters, searchQuery)

  const handleSubmit = (partial: Partial<Place>) => {
    const newPlace: Place = {
      id: Date.now().toString(),
      name: partial.name || 'Novo Lugar',
      type: (partial.type as PlaceType) || 'café',
      vibe: (partial.vibe as Vibe) || 'calm',
      price_range: (partial.price_range as 1 | 2 | 3) || 2,
      hours: partial.hours || '—',
      lat: -8.84 + Math.random() * 0.06,
      lng: 13.21 + Math.random() * 0.05,
      address: '',
      use_cases: (partial.use_cases as UseCase[]) || [],
      tags: partial.tags || [],
      verified: false,
      submitted_by: 'you',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setPlaces((prev) => [newPlace, ...prev])
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        view={view}
        onViewChange={setView}
        onSubmitClick={() => setShowModal(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        resultCount={filtered.length}
      />
      <div className="px-[18px] py-2.5 border-b border-border bg-surf">
        <FilterBar filters={filters} onFilterChange={setFilters} />
      </div>
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
        {(view === 'split' || view === 'list') && (
          <div
            className="overflow-y-auto border-r border-border flex-shrink-0"
            style={{ width: view === 'list' ? '100%' : '330px' }}
            onClick={() => setSelectedPlace(null)}
          >
            {filtered.length === 0 ? (
              <div className="p-9 text-center text-[#333] text-[12px]">
                <IconMapOff size={28} className="mx-auto mb-2" />
                {t('place.no_results')}
              </div>
            ) : (
              filtered.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  selected={selectedPlace?.id === place.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPlace(selectedPlace?.id === place.id ? null : place)
                  }}
                />
              ))
            )}
          </div>
        )}
        {view !== 'list' && (
          <DevSpotMap
            places={filtered}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
          />
        )}
      </div>
      <SubmitPlaceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
