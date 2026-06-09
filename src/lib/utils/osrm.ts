export interface RouteData {
  coordinates: [number, number][]
  duration: number
  distance: number
}

export async function fetchRoute(
  from: [number, number],
  to: [number, number]
): Promise<RouteData | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson&alternatives=true&annotations=true`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!data.routes?.length) return null

    const best = data.routes[0]
    return {
      coordinates: best.geometry.coordinates,
      duration: best.duration,
      distance: best.distance,
    }
  } catch {
    return null
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}
