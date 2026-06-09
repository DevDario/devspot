import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ViewMode, Filters, PlaceWithRating } from '@/types'
import type { PlaceFormData } from '@/lib/schemas'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/layout/Header'
import { FilterBar } from '@/components/filters/FilterBar'
import { PlaceCard } from '@/components/place/PlaceCard'
import { DevSpotMap } from '@/components/map/DevSpotMap'
import { SubmitPlaceModal } from '@/components/place/SubmitPlaceModal'
import { CmdPalette } from '@/components/cmd/CmdPalette'
import { filterPlaces } from '@/lib/utils/filters'
import { fetchPlacesWithRatings, createPlace, uploadPhoto } from '@/lib/supabase/places'
import { useAuth } from '@/lib/supabase/auth'
import { useTheme } from '@/lib/hooks/useTheme'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  IconMapOff,
  IconSearch,
  IconPlus,
  IconTerminal2,
} from '@tabler/icons-react'
import { Loader2 } from 'lucide-react'

const DEFAULT_FILTERS: Filters = { vibe: 'all', use: 'all', type: 'all' }

export function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [view, setView] = useState<ViewMode>('split')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<PlaceWithRating | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showCmd, setShowCmd] = useState(false)

  const { data: places = [], isLoading, error } = useQuery({
    queryKey: ['places'],
    queryFn: fetchPlacesWithRatings,
    staleTime: 15_000,
  })

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

  const createMutation = useMutation({
    mutationFn: async ({ data: form, photos }: { data: PlaceFormData; photos: File[] }) => {
      if (!user) throw new Error('not authenticated')
      const lat = form.useLocation ? (form.lat ?? -8.84) : (form.lat ?? -8.84)
      const lng = form.useLocation ? (form.lng ?? 13.21) : (form.lng ?? 13.21)
      const created = await createPlace({
        name: form.name,
        type: form.type,
        lat,
        lng,
        address: form.address,
        hours: form.hours,
        price_range: form.price_range,
        vibe: form.vibe,
        use_cases: form.use_cases,
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        notes: form.notes,
        submitted_by: user.id,
        verified: false,
        created_at: '',
        updated_at: '',
        id: '',
      }, user.id)
      if (created && photos.length > 0) {
        await Promise.all(
          photos.map((f, i) =>
            uploadPhoto('place-photos', f, `${created.id}/${i}-${f.name}`)
          )
        )
      }
      return created
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })

  const filtered = filterPlaces(places, filters as any, searchQuery) as PlaceWithRating[]

  const handleSubmit = useCallback(
    async (form: PlaceFormData, photoFiles: File[]) => {
      await createMutation.mutateAsync({ data: form, photos: photoFiles })
    },
    [createMutation]
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
        user={user}
      />
      <div className="px-[14px] md:px-[18px] py-2.5 border-b border-border bg-surf">
        <FilterBar filters={filters} onFilterChange={setFilters} />
      </div>
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
        {(view === 'split' || view === 'list') && (
          <div
            className={`overflow-y-auto border-r border-border flex-shrink-0 ${view === 'list' ? 'w-full' : 'max-md:w-full md:w-[330px]'}`}
            onClick={() => setSelectedPlace(null)}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="size-5 animate-spin text-muted" />
              </div>
            ) : error ? (
              <div className="p-9 text-center">
                <IconTerminal2 size={28} className="block mx-auto mb-2 text-muted" />
                <p className="text-[11px] text-muted mb-3">{error.message}</p>
                <button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['places'] })}
                  className="text-[11px] text-txt border border-border rounded-[4px] px-3 py-1 bg-surf2 cursor-pointer"
                >
                  {t('place.retry')}
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-9 text-center">
                <IconMapOff size={32} className="block mx-auto mb-3 text-dim" />
                <p className="text-[12px] text-muted mb-1">{t('place.no_results')}</p>
                <p className="text-[10px] text-dim mb-4">{t('place.no_results_hint')}</p>
                <button
                  onClick={openSubmit}
                  className="inline-flex items-center gap-1.5 text-[11px] text-txt border border-border rounded-[4px] px-3 py-1.5 bg-surf2 cursor-pointer"
                >
                  <IconPlus size={12} />
                  {t('place.add_first')}
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
            places={filtered as any}
            selectedPlace={selectedPlace as any}
            onSelectPlace={(p: any) => setSelectedPlace(p)}
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
