import { useParams, useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconBuilding, IconCoffee } from '@tabler/icons-react'
import type { Place } from '@/types'
import { StarRating } from '@/components/review/StarRating'
import { PriceBar } from '@/components/ui/PriceBar'
import { VerifiedBadge } from '@/components/ui/VerifiedBadge'
import { UseCaseBadge } from '@/components/ui/UseCaseBadge'

const MOCK_PLACE: Place = {
  id: '1',
  name: 'Café Marginal',
  type: 'café',
  vibe: 'calm',
  price_range: 2,
  hours: '07–22',
  lat: -8.838,
  lng: 13.234,
  address: 'Rua Marginal, Luanda',
  use_cases: ['coding', 'meetings'],
  tags: ['wifi', 'outlets', 'AC'],
  verified: true,
  submitted_by: 'dev_kafu',
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-06-01T10:00:00Z',
}

export function PlaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const place = MOCK_PLACE

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted text-[12px] mb-4 cursor-pointer bg-none border-none"
        >
          <IconArrowLeft size={14} /> back
        </button>

        <div className="bg-surf border border-border rounded-[10px] p-5 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-surf2 border border-border rounded-[8px] flex items-center justify-center flex-shrink-0">
              {place.type === 'cowork' ? (
                <IconBuilding size={20} color="#888" />
              ) : (
                <IconCoffee size={20} color="#b0b0b0" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-[18px] text-txt">{place.name}</h1>
                {place.verified && <VerifiedBadge />}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted flex-wrap">
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
              <span className="text-[10px] text-muted">Rating</span>
              <StarRating rating={4.5} />
              <span className="text-[#e8c84a] text-[11px]">4.5 (14)</span>
            </div>
          </div>

          <div className="mb-3">
            <span className="text-[10px] text-muted block mb-1.5">Tags</span>
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
            <span>Submitted by @{place.submitted_by}</span>
          </div>
        </div>

        <div className="bg-surf border border-border rounded-[10px] p-5 mb-4">
          <h2 className="text-[14px] text-txt mb-3">Location</h2>
          <div className="map-bg h-[180px] rounded-[6px] border border-border flex items-center justify-center">
            <span className="text-dim text-[11px]">Map preview — {place.address}</span>
          </div>
        </div>

        <div className="bg-surf border border-border rounded-[10px] p-5 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[14px] text-txt">Reviews</h2>
            <button className="bg-[#333] border-none text-[#ddd] rounded-[5px] px-3 py-1.5 text-[11px] cursor-pointer">
              + write review
            </button>
          </div>
          <div className="text-center py-8 text-muted text-[11px]">
            No reviews yet. Be the first to review this place!
          </div>
        </div>
      </div>
    </div>
  )
}
