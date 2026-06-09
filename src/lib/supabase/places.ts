import { supabase } from './client'
import type { Database } from './database.types'
import type { Place, Review, User, PlaceType, Vibe, UseCase } from '@/types'

type PlacesRow = Database['public']['Tables']['places']['Row']
type PlacesInsert = Database['public']['Tables']['places']['Insert']
type ReviewsRow = Database['public']['Tables']['reviews']['Row']
type ReviewsInsert = Database['public']['Tables']['reviews']['Insert']
type ProfilesRow = Database['public']['Tables']['profiles']['Row']

export async function fetchPlaces(): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return ((data || []) as PlacesRow[]).map((p) => ({
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
    created_at: p.created_at || '',
    updated_at: p.updated_at || '',
  }))
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  const p = data as PlacesRow
  return {
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
    created_at: p.created_at || '',
    updated_at: p.updated_at || '',
  }
}

export async function fetchReviewsForPlace(placeId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('place_id', placeId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return ((data || []) as ReviewsRow[]).map((r) => ({
    id: r.id,
    place_id: r.place_id || '',
    user_id: r.user_id || '',
    rating: r.rating,
    wifi_quality: r.wifi_quality as 1 | 2 | 3 | null,
    noise_level: r.noise_level,
    power_outlets: r.power_outlets,
    body: r.body || '',
    photos: r.photos || [],
    created_at: r.created_at || '',
  }))
}

export async function createPlace(
  place: Partial<Place>,
  userId: string
): Promise<Place | null> {
  const insertData: PlacesInsert = {
    name: place.name ?? '',
    type: place.type as string,
    lat: place.lat as number,
    lng: place.lng as number,
    address: place.address,
    hours: place.hours,
    price_range: place.price_range,
    vibe: place.vibe ?? null,
    use_cases: place.use_cases ?? null,
    tags: place.tags ?? null,
    submitted_by: userId,
  }

  const { data, error } = await supabase
    .from('places')
    .insert(insertData as never)
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

  const p = data as ProfilesRow
  return {
    id: p.id,
    username: p.username,
    avatar_url: p.avatar_url,
    bio: p.bio,
    role: p.role as User['role'],
    submissions_count: 0,
    reviews_count: 0,
    created_at: p.created_at || '',
  }
}

export async function fetchPlacesByUserId(userId: string): Promise<Place[]> {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('submitted_by', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return ((data || []) as PlacesRow[]).map((p) => ({
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
    created_at: p.created_at || '',
    updated_at: p.updated_at || '',
  }))
}

export async function fetchReviewsByUserId(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return ((data || []) as ReviewsRow[]).map((r) => ({
    id: r.id,
    place_id: r.place_id || '',
    user_id: r.user_id || '',
    rating: r.rating,
    wifi_quality: r.wifi_quality as 1 | 2 | 3 | null,
    noise_level: r.noise_level,
    power_outlets: r.power_outlets,
    body: r.body || '',
    photos: r.photos || [],
    created_at: r.created_at || '',
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
  const insertData: ReviewsInsert = {
    place_id: review.place_id,
    user_id: review.user_id,
    rating: review.rating,
    wifi_quality: review.wifi_quality,
    noise_level: review.noise_level,
    power_outlets: review.power_outlets,
    body: review.body,
  }

  const { error } = await supabase.from('reviews').insert(insertData as never)
  if (error) throw error
}
