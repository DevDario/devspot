import { z } from 'zod'

export const placeSchema = z.object({
  name: z.string().min(1, 'required_name'),
  type: z.enum(['café', 'cowork', 'esplanada', 'restaurant', 'library', 'other']),
  hours: z.string().optional().default(''),
  vibe: z.enum(['calm', 'retro', 'modern']),
  use_cases: z.array(z.enum(['coding', 'cowork', 'meetings', 'hackathon', 'chill'])),
  price_range: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  tags: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  address: z.string().optional().default(''),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  useLocation: z.boolean().default(false),
})

export type PlaceFormData = z.infer<typeof placeSchema>

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  wifi_quality: z.union([z.literal(1), z.literal(2), z.literal(3), z.null(), z.undefined()]).optional().default(null),
  noise_level: z.enum(['quiet', 'moderate', 'loud']).nullable().optional().default(null),
  power_outlets: z.boolean().nullable().optional().default(null),
  body: z.string().optional().default(''),
})

export type ReviewFormData = z.infer<typeof reviewSchema>
