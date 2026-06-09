import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Place, ViewMode, Filters, PlaceType, Vibe, UseCase } from '@/types'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/filters/FilterBar'
import { PlaceCard } from '@/components/place/PlaceCard'
import { DevSpotMap } from '@/components/map/DevSpotMap'
import { SubmitPlaceModal } from '@/components/place/SubmitPlaceModal'
import { CmdPalette } from '@/components/cmd/CmdPalette'
import { filterPlaces } from '@/lib/utils/filters'
import { fetchPlaces, createPlace, uploadPhoto } from '@/lib/supabase/places'
import { useAuth } from '@/lib/supabase/auth'
import { useTheme } from '@/lib/hooks/useTheme'
import {
  IconMapOff,
  IconSearch,
  IconPlus,
  IconLogin,
  IconTerminal2,
} from '@tabler/icons-react'
import { Loader2 } from 'lucide-react'

const DEFAULT_FILTERS: Filters = { vibe: 'all', use: 'all', type: 'all' }

export function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>('split')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showCmd, setShowCmd] = useState(false)

  useEffect(() => {
    fetchPlaces()
      .then(setPlaces)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCmd((p) => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filtered = filterPlaces(places, filters, searchQuery)

  const handleSubmit = useCallback(
    async (partial: Partial<Place>, photoFiles: File[]) => {
      if (!user) return
      const lat = -8.84 + Math.random() * 0.06
      const lng = 13.21 + Math.random() * 0.05
      const created = await createPlace({ ...partial, lat, lng }, user.id)
      if (created && photoFiles.length > 0) {
        await Promise.all(
          photoFiles.map((f, i) =>
            uploadPhoto('place-photos', f, `${created.id}/${i}-${f.name}`)
          )
        )
      }
      const updated = await fetchPlaces()
      setPlaces(updated)
    },
    [user]
  )

  const openSubmit = () => {
    if (!user) {
      navigate('/signin')
      return
    }
    setShowModal(true)
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        view={view}
        onViewChange={setView}
        onSubmitClick={openSubmit}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        resultCount={filtered.length}
        onCmdOpen={() => setShowCmd(true)}
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
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="size-5 animate-spin text-muted" />
              </div>
            ) : loadError ? (
              <div className="p-9 text-center">
                <IconTerminal2 size={28} className="mx-auto mb-2 text-muted" />
                <p className="text-[11px] text-muted mb-3">{loadError}</p>
                <button
                  onClick={() => { setLoading(true); setLoadError(null); fetchPlaces().then(setPlaces).catch((e) => setLoadError(e.message)).finally(() => setLoading(false)) }}
                  className="text-[11px] text-txt border border-border rounded-[4px] px-3 py-1 bg-surf2 cursor-pointer"
                >
                  retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-9 text-center">
                <IconMapOff size={32} className="mx-auto mb-3 text-dim" />
                <p className="text-[12px] text-muted mb-1">{t('place.no_results')}</p>
                <p className="text-[10px] text-dim mb-4">try adjusting filters or search</p>
                <button
                  onClick={openSubmit}
                  className="inline-flex items-center gap-1.5 text-[11px] text-txt border border-border rounded-[4px] px-3 py-1.5 bg-surf2 cursor-pointer"
                >
                  <IconPlus size={12} />
                  add the first spot
                </button>
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
            theme={theme}
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
      <CmdPalette
        open={showCmd}
        onClose={() => setShowCmd(false)}
        onSubmitClick={openSubmit}
        view={view}
        onViewChange={setView}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  )
}
