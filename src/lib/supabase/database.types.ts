export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      places: {
        Row: {
          id: string
          name: string
          type: 'café' | 'cowork' | 'esplanada' | 'restaurant' | 'library' | 'other'
          lat: number
          lng: number
          address: string | null
          hours: string | null
          price_range: number | null
          vibe: 'calm' | 'retro' | 'modern' | null
          use_cases: string[] | null
          tags: string[] | null
          submitted_by: string | null
          verified: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          lat: number
          lng: number
          address?: string | null
          hours?: string | null
          price_range?: number | null
          vibe?: string | null
          use_cases?: string[] | null
          tags?: string[] | null
          submitted_by?: string | null
          verified?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          lat?: number
          lng?: number
          address?: string | null
          hours?: string | null
          price_range?: number | null
          vibe?: string | null
          use_cases?: string[] | null
          tags?: string[] | null
          submitted_by?: string | null
          verified?: boolean | null
        }
      }
      reviews: {
        Row: {
          id: string
          place_id: string | null
          user_id: string | null
          rating: number
          wifi_quality: number | null
          noise_level: 'quiet' | 'moderate' | 'loud' | null
          power_outlets: boolean | null
          body: string | null
          photos: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          place_id?: string | null
          user_id?: string | null
          rating: number
          wifi_quality?: number | null
          noise_level?: string | null
          power_outlets?: boolean | null
          body?: string | null
          photos?: string[] | null
        }
        Update: {
          id?: string
          place_id?: string | null
          user_id?: string | null
          rating?: number
          wifi_quality?: number | null
          noise_level?: string | null
          power_outlets?: boolean | null
          body?: string | null
          photos?: string[] | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          bio: string | null
          role: 'user' | 'moderator' | 'admin'
          created_at: string | null
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          role?: string | null
        }
      }
    }
  }
}
