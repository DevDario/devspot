import { useCallback, useMemo, useRef, useState } from 'react'
import { IconBuilding, IconCoffee, IconRoute } from '@tabler/icons-react'
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapRoute,
} from '@/components/ui/map'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { Place } from '@/types'
import { useUserLocation } from '@/lib/hooks/useUserLocation'
import { fetchRoute, formatDuration, formatDistance } from '@/lib/utils/osrm'
import type { RouteData } from '@/lib/utils/osrm'
import { useTranslation } from 'react-i18next'

const LUANDA_CENTER: [number, number] = [13.234, -8.838]

interface DevSpotMapProps {
  places: Place[]
  selectedPlace: Place | null
  onSelectPlace: (place: Place | null) => void
  theme?: 'dark' | 'light'
}

const TYPE_ICONS: Record<string, typeof IconCoffee | typeof IconBuilding> = {
  cowork: IconBuilding,
  café: IconCoffee,
  esplanada: IconCoffee,
  restaurant: IconCoffee,
  library: IconCoffee,
  other: IconCoffee,
}

const MARKER_COLORS: Record<string, string> = {
  café: '#b0b0b0',
  cowork: '#888',
  esplanada: '#666',
}

function getMarkerColor(type: string): string {
  return MARKER_COLORS[type] || '#888'
}

function getMarkerIcon(type: string) {
  return TYPE_ICONS[type] || IconCoffee
}

export function DevSpotMap({ places, selectedPlace, onSelectPlace, theme = 'dark' }: DevSpotMapProps) {
  const { t } = useTranslation()
  const userLoc = useUserLocation()
  const [route, setRoute] = useState<RouteData | null>(null)
  const [routing, setRouting] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const mapRef = useRef<React.ComponentRef<typeof Map>>(null)

  const handleRouteClick = useCallback(async () => {
    if (!selectedPlace) return
    setRoute(null)
    setRouteError(null)

    if (!userLoc.latitude || !userLoc.longitude) {
      userLoc.requestLocation()
      return
    }

    setRouting(true)
    const from: [number, number] = [userLoc.longitude, userLoc.latitude]
    const to: [number, number] = [selectedPlace.lng, selectedPlace.lat]
    const result = await fetchRoute(from, to)
    setRouting(false)

    if (result) {
      setRoute(result)
      const map = mapRef.current
      if (map && typeof map.fitBounds === 'function') {
        const coords = result.coordinates
        const minLng = Math.min(...coords.map((c) => c[0]), to[0])
        const maxLng = Math.max(...coords.map((c) => c[0]), to[0])
        const minLat = Math.min(...coords.map((c) => c[1]), to[1])
        const maxLat = Math.max(...coords.map((c) => c[1]), to[1])
        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ] as [[number, number], [number, number]],
          { padding: 80, duration: 1000 }
        )
      }
    } else {
      setRouteError(t('map.error_route'))
    }
  }, [selectedPlace, userLoc, t])

  const hasUserLocation = userLoc.latitude !== null && userLoc.longitude !== null

  const center = useMemo((): [number, number] => {
    if (selectedPlace) return [selectedPlace.lng, selectedPlace.lat]
    if (hasUserLocation) return [userLoc.longitude!, userLoc.latitude!]
    return LUANDA_CENTER
  }, [selectedPlace, userLoc, hasUserLocation])

  return (
    <div className="flex-1 relative">
      <Map
        ref={mapRef as never}
        theme={theme}
        center={center}
        zoom={hasUserLocation ? 13 : 11}
        className="h-full w-full"
      >
        <MapControls showZoom showCompass showLocate showFullscreen />

        {places.map((place) => {
          const Icon = getMarkerIcon(place.type)
          const color = getMarkerColor(place.type)
          const isSel = selectedPlace?.id === place.id

          return (
            <MapMarker
              key={place.id}
              longitude={place.lng}
              latitude={place.lat}
              onClick={() => onSelectPlace(isSel ? null : place)}
            >
              <MarkerContent>
                <div
                  className={`flex items-center justify-center rounded-full border-2 transition-all cursor-pointer`}
                  style={{
                    width: isSel ? 36 : 26,
                    height: isSel ? 36 : 26,
                    background: isSel ? '#222' : '#1a1a1a',
                    borderColor: isSel ? '#aaa' : '#444',
                  }}
                >
                  <Icon size={isSel ? 14 : 11} color={color} />
                </div>
              </MarkerContent>
              <MarkerTooltip>{place.name}</MarkerTooltip>
            </MapMarker>
          )
        })}

        {hasUserLocation && (
          <MapMarker
            longitude={userLoc.longitude!}
            latitude={userLoc.latitude!}
          >
            <MarkerContent>
              <div className="size-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse" />
            </MarkerContent>
            <MarkerTooltip>{t('map.locate')}</MarkerTooltip>
          </MapMarker>
        )}

        {route && route.coordinates.length >= 2 && (
          <MapRoute
            coordinates={route.coordinates}
            color="#6366f1"
            width={4}
            opacity={0.85}
          />
        )}
      </Map>

      {selectedPlace && (
        <div className="absolute bottom-4 left-3 z-10 flex flex-col gap-2 max-w-[240px]">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-3">
            <div className="text-[13px] text-[#d0d0d0] mb-0.5">{selectedPlace.name}</div>
            <div className="text-[10px] text-[#555] mb-2">
              {selectedPlace.type} · {selectedPlace.hours}
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedPlace.tags.slice(0, 3).map((t) => (
                <span key={t} className="ds-tag">{t}</span>
              ))}
            </div>
            <Button
              size="sm"
              onClick={handleRouteClick}
              disabled={routing}
              className="w-full gap-1.5 text-[11px] h-7"
            >
              {routing ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <IconRoute size={12} />
              )}
              {routing ? t('map.routing') : t('map.route_to')}
            </Button>
          </div>

          {route && (
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-2.5 text-[11px] text-[#bbb]">
              <div className="flex gap-3">
                <span>{formatDistance(route.distance)}</span>
                <span>{formatDuration(route.duration)}</span>
              </div>
            </div>
          )}

          {routeError && (
            <div className="bg-[#141414] border border-red-800 rounded-[8px] p-2 text-[10px] text-red-400">
              {routeError}
            </div>
          )}

          {!hasUserLocation && selectedPlace && !routing && !route && (
            <p className="text-[10px] text-dim ml-1">
              {t('map.from_location')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
