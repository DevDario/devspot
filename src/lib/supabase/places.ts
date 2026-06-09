import { supabase } from './client'
import type { Place, Review, User, PlaceType, Vibe, UseCase } from '@/types'

export async function fetchPlaces(): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type as PlaceType,
    lat: p.lat,
    lng: p.lng,
    address: p.address || '',
    hours: p.hours || '',
    price_range: (p.price_range as 1 | 2 | 3) || 2,
    vibe: p.vibe as Vibe,
    use_cases: (p.use_cases || []) as UseCase[],
    tags: p.tags || [],
    submitted_by: p.submitted_by || '',
    verified: p.verified || false,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }))
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name,
    type: data.type as PlaceType,
    lat: data.lat,
    lng: data.lng,
    address: data.address || '',
    hours: data.hours || '',
    price_range: (data.price_range as 1 | 2 | 3) || 2,
    vibe: data.vibe as Vibe,
    use_cases: (data.use_cases || []) as UseCase[],
    tags: data.tags || [],
    submitted_by: data.submitted_by || '',
    verified: data.verified || false,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export async function fetchReviewsForPlace(placeId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('place_id', placeId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((r) => ({
    id: r.id,
    place_id: r.place_id,
    user_id: r.user_id,
    rating: r.rating,
    wifi_quality: r.wifi_quality as 1 | 2 | 3 | null,
    noise_level: r.noise_level as 'quiet' | 'moderate' | 'loud' | null,
    power_outlets: r.power_outlets,
    body: r.body || '',
    photos: r.photos || [],
    created_at: r.created_at,
  }))
}

export async function createPlace(
  place: Partial<Place>,
  userId: string
): Promise<Place | null> {
  const { data, error } = await supabase
    .from('places')
    .insert({
      name: place.name,
      type: place.type,
      lat: place.lat,
      lng: place.lng,
      address: place.address,
      hours: place.hours,
      price_range: place.price_range,
      vibe: place.vibe,
      use_cases: place.use_cases,
      tags: place.tags,
      submitted_by: userId,
    })
    .select()
    .single()

  if (error) throw error
  return data as unknown as Place
}

export async function uploadPhoto(
  bucket: 'place-photos' | 'review-photos',
  file: File,
  path: string
): Promise<string | null> {
  const { error } = await supabase.storage.from(bucket).upload(path, file)
  if (error) throw error

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData?.publicUrl || null
}

export async function fetchPlacePhotos(placeId: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('place-photos')
    .list(`${placeId}/`)

  if (error) return []

  const { data: urlData } = supabase.storage.from('place-photos').getPublicUrl('')
  const base = urlData?.publicUrl?.replace(/\/$/, '') || ''

  return (data || [])
    .filter((f) => !f.id?.endsWith('/'))
    .map((f) => `${base}/${placeId}/${f.name}`)
}

export async function fetchProfileByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    username: data.username,
    avatar_url: data.avatar_url,
    bio: data.bio,
    role: data.role as User['role'],
    submissions_count: 0,
    reviews_count: 0,
    created_at: data.created_at,
  }
}

export async function fetchPlacesByUserId(userId: string): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('submitted_by', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type as PlaceType,
    lat: p.lat,
    lng: p.lng,
    address: p.address || '',
    hours: p.hours || '',
    price_range: (p.price_range as 1 | 2 | 3) || 2,
    vibe: p.vibe as Vibe,
    use_cases: (p.use_cases || []) as UseCase[],
    tags: p.tags || [],
    submitted_by: p.submitted_by || '',
    verified: p.verified || false,
    created_at: p.created_at,
    updated_at: p.updated_at,
  }))
}

export async function fetchReviewsByUserId(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map((r) => ({
    id: r.id,
    place_id: r.place_id,
    user_id: r.user_id,
    rating: r.rating,
    wifi_quality: r.wifi_quality as 1 | 2 | 3 | null,
    noise_level: r.noise_level as 'quiet' | 'moderate' | 'loud' | null,
    power_outlets: r.power_outlets,
    body: r.body || '',
    photos: r.photos || [],
    created_at: r.created_at,
  }))
}

export async function createReview(review: {
  place_id: string
  user_id: string
  rating: number
  wifi_quality: number | null
  noise_level: string | null
  power_outlets: boolean | null
  body: string
}): Promise<void> {
  const { error } = await supabase.from('reviews').insert({
    place_id: review.place_id,
    user_id: review.user_id,
    rating: review.rating,
    wifi_quality: review.wifi_quality,
    noise_level: review.noise_level,
    power_outlets: review.power_outlets,
    body: review.body,
  })
  if (error) throw error
}
