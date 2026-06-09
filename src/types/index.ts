export type PlaceType = 'café' | 'cowork' | 'esplanada' | 'restaurant' | 'library' | 'other'

export type Vibe = 'calm' | 'retro' | 'modern'

export type UseCase = 'coding' | 'cowork' | 'meetings' | 'hackathon' | 'chill'

export type NoiseLevel = 'quiet' | 'moderate' | 'loud'

export type PriceRange = 1 | 2 | 3

export type UserRole = 'user' | 'moderator' | 'admin'

export type ViewMode = 'split' | 'map' | 'list'

export interface Place {
  id: string
  name: string
  type: PlaceType
  lat: number
  lng: number
  address: string
  hours: string
  price_range: PriceRange
  vibe: Vibe
  use_cases: UseCase[]
  tags: string[]
  notes?: string
  submitted_by: string
  verified: boolean
  created_at: string
  updated_at: string
}

export interface PlaceWithRating extends Place {
  avgRating: number
  reviewCount: number
}

export interface Review {
  id: string
  place_id: string
  user_id: string
  rating: number
  wifi_quality: 1 | 2 | 3 | null
  noise_level: NoiseLevel | null
  power_outlets: boolean | null
  body: string
  photos: string[]
  created_at: string
}

export interface User {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  role: UserRole
  submissions_count: number
  reviews_count: number
  created_at: string
}

export interface Filters {
  vibe: Vibe | 'all'
  use: UseCase | 'all'
  type: PlaceType | 'all'
}
