import { useParams, useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconBuilding, IconCoffee, IconRoute, IconTerminal2 } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useState, useCallback } from 'react'
import type { Review } from '@/types'
import { StarRating } from '@/components/review/StarRating'
import { PriceBar } from '@/components/ui/PriceBar'
import { VerifiedBadge } from '@/components/ui/VerifiedBadge'
import { UseCaseBadge } from '@/components/ui/UseCaseBadge'
import { Map, MapMarker, MarkerContent, MarkerTooltip, MapRoute, MapControls } from '@/components/ui/map'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { fetchRoute, formatDuration, formatDistance } from '@/lib/utils/osrm'
import type { RouteData } from '@/lib/utils/osrm'
import { fetchPlaceById, fetchReviewsForPlace, fetchPlacePhotos, createReview } from '@/lib/supabase/places'
import { useTheme } from '@/lib/hooks/useTheme'
import { useAuth } from '@/lib/supabase/auth'
import { SubmitReviewForm } from '@/components/review/SubmitReviewForm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function PlaceDetailPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [route, setRoute] = useState<RouteData | null>(null)
  const [routing, setRouting] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { user } = useAuth()

  const { data: place, isLoading: placeLoading, error: placeError } = useQuery({
    queryKey: ['place', id],
    queryFn: () => fetchPlaceById(id!),
    enabled: !!id,
  })

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => fetchReviewsForPlace(id!),
    enabled: !!id,
  })

  const { data: photos = [] } = useQuery({
    queryKey: ['photos', id],
    queryFn: () => fetchPlacePhotos(id!),
    enabled: !!id,
  })

  const reviewMutation = useMutation({
    mutationFn: async (review: {
      rating: number
      wifi_quality: number | null
      noise_level: string | null
      power_outlets: boolean | null
      body: string
    }) => {
      if (!user || !id) throw new Error('not authenticated')
      await createReview({ ...review, place_id: id, user_id: user.id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] })
      setShowReviewForm(false)
    },
  })

  const handleRoute = useCallback(async () => {
    if (!place) return
    setRoute(null); setRouteError(null)
    if (!navigator.geolocation) { setRouteError(t('map.error_location')); return }
    setRouting(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const from: [number, number] = [pos.coords.longitude, pos.coords.latitude]
        const to: [number, number] = [place.lng, place.lat]
        const result = await fetchRoute(from, to)
        setRouting(false)
        if (result) { setRoute(result) } else { setRouteError(t('map.error_route')) }
      },
      () => { setRouting(false); setRouteError(t('map.error_location')) },
      { enableHighAccuracy: true }
    )
  }, [place, t])

  const handleSubmitReview = useCallback(async (review: {
    rating: number
    wifi_quality: number | null
    noise_level: string | null
    power_outlets: boolean | null
    body: string
  }) => {
    await reviewMutation.mutateAsync(review)
  }, [reviewMutation])

  if (placeLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted" />
      </div>
    )
  }

  if (placeError || !place) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <IconTerminal2 size={32} className="block mx-auto mb-3 text-dim" />
          <p className="text-[12px] text-muted mb-3">{t('place.not_found')}</p>
          <button onClick={() => navigate('/')} className="text-[11px] text-txt border border-border rounded-[4px] px-3 py-1.5 bg-surf2 cursor-pointer">
            {t('place.back_to_map')}
          </button>
        </div>
      </div>
    )
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 0

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-3 md:px-4 py-3 md:py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted text-[12px] mb-3 md:mb-4 cursor-pointer bg-none border-none"
        >
          <IconArrowLeft size={14} /> {t('submit.back')}
        </button>

        <div className="bg-surf border border-border rounded-[10px] p-4 md:p-5 mb-3 md:mb-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-surf2 border border-border rounded-[8px] flex items-center justify-center flex-shrink-0">
              {place.type === 'cowork' ? (
                <IconBuilding size={20} color="#888" />
              ) : (
                <IconCoffee size={20} color="#b0b0b0" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[16px] md:text-[18px] text-txt truncate">{place.name}</h1>
                {place.verified && <VerifiedBadge />}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted flex-wrap">
                <span>{place.type}</span>
                <span>·</span>
                <span>{place.hours}</span>
                <span>·</span>
                <PriceBar price={place.price_range} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3 bg-surf2 rounded-[6px] p-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted">{t('place.reviews')}</span>
              <StarRating rating={avgRating} />
              <span className="text-star text-[11px]">{avgRating.toFixed(1)} ({reviews.length})</span>
            </div>
          </div>

          <div className="mb-3">
            <span className="text-[10px] text-muted block mb-1.5">{t('place.tags')}</span>
            <div className="flex flex-wrap gap-1.5">
              {place.use_cases.map((u) => (
                <UseCaseBadge key={u} useCase={u} />
              ))}
              {place.tags.map((t) => (
                <span key={t} className="ds-tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-dim">
            <span>{t('place.submitted_by')} @{place.submitted_by}</span>
          </div>
        </div>

        <div className="bg-surf border border-border rounded-[10px] p-4 md:p-5 mb-3 md:mb-4">
          <h2 className="text-[14px] text-txt mb-3">{t('place.location')}</h2>
          <div className="h-[140px] md:h-[180px] rounded-[6px] border border-border overflow-hidden">
            <Map theme={theme} center={[place.lng, place.lat]} zoom={15} className="h-full w-full">
              <MapControls showZoom showCompass />
              <MapMarker longitude={place.lng} latitude={place.lat}>
                <MarkerContent>
                  <div className="flex items-center justify-center size-6 rounded-full border-2 border-[#aaa] bg-[#222]">
                    {place.type === 'cowork' ? (
                      <IconBuilding size={11} color="#888" />
                    ) : (
                      <IconCoffee size={11} color="#b0b0b0" />
                    )}
                  </div>
                </MarkerContent>
                <MarkerTooltip>{place.name}</MarkerTooltip>
              </MapMarker>
              {route && route.coordinates.length >= 2 && (
                <MapRoute coordinates={route.coordinates} color="#6366f1" width={4} opacity={0.85} />
              )}
            </Map>
          </div>
          <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-1.5">
            <span className="text-[10px] text-dim truncate">{place.address}</span>
            <div className="flex items-center gap-2">
              {route && (
                <span className="text-[10px] text-muted">
                  {formatDistance(route.distance)} · {formatDuration(route.duration)}
                </span>
              )}
              <Button size="sm" onClick={handleRoute} disabled={routing} className="text-[10px] h-6 gap-1">
                {routing ? <Loader2 className="size-2.5 animate-spin" /> : <IconRoute size={10} />}
                {routing ? t('map.routing') : t('map.route_to')}
              </Button>
            </div>
          </div>
          {routeError && <p className="text-[10px] text-red-400 mt-1">{routeError}</p>}
        </div>

        {photos.length > 0 && (
          <div className="bg-surf border border-border rounded-[10px] p-4 md:p-5 mb-3 md:mb-4">
            <h2 className="text-[14px] text-txt mb-3">{t('place.photos')}</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
              {photos.map((url, i) => (
                <img key={i} src={url} alt={`${place.name} photo ${i + 1}`} className="h-20 md:h-24 w-20 md:w-24 rounded-[6px] object-cover border border-border flex-shrink-0" />
              ))}
            </div>
          </div>
        )}

        <div className="bg-surf border border-border rounded-[10px] p-4 md:p-5 mb-3 md:mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[14px] text-txt">{t('place.reviews')}</h2>
            <button
              onClick={() => setShowReviewForm((p) => !p)}
              className="bg-[#555] border-none text-txt rounded-[5px] px-2.5 md:px-3 py-1.5 text-[11px] cursor-pointer"
            >
              {t('place.write_review')}
            </button>
          </div>
          {showReviewForm && (
            <div className="mb-4">
              <SubmitReviewForm
                onSubmit={handleSubmitReview}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}
          {!showReviewForm && reviews.length === 0 ? (
            <div className="text-center py-8 text-muted text-[11px]">
              {t('place.no_reviews')}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-surf2 border border-border rounded-[6px] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={r.rating} />
                    <span className="text-[10px] text-dim">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.body && <p className="text-[11px] text-muted">{r.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
