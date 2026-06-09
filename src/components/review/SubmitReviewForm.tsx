import { useState } from 'react'
import type { NoiseLevel } from '@/types'
import { InteractiveStars } from './StarRating'

interface SubmitReviewFormProps {
  onSubmit: (review: {
    rating: number
    wifi_quality: number | null
    noise_level: NoiseLevel | null
    power_outlets: boolean | null
    body: string
  }) => void
  onCancel: () => void
}

export function SubmitReviewForm({ onSubmit, onCancel }: SubmitReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [wifi, setWifi] = useState<number | null>(null)
  const [noise, setNoise] = useState<NoiseLevel | null>(null)
  const [power, setPower] = useState<boolean | null>(null)
  const [body, setBody] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) return
    onSubmit({ rating, wifi_quality: wifi, noise_level: noise, power_outlets: power, body })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="fld-lbl">Rating</label>
        <InteractiveStars rating={rating} onChange={setRating} />
      </div>
      <div>
        <label className="fld-lbl">Wi-Fi Quality</label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3].map((w) => (
            <button
              key={w}
              type="button"
              className={`ds-pill ${wifi === w ? 'on-g' : ''}`}
              onClick={() => setWifi(wifi === w ? null : w)}
            >
              {'📶'.repeat(w)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="fld-lbl">Noise Level</label>
        <div className="flex gap-1 mt-1">
          {(['quiet', 'moderate', 'loud'] as NoiseLevel[]).map((n) => (
            <button
              key={n}
              type="button"
              className={`ds-pill ${noise === n ? 'on-a' : ''}`}
              onClick={() => setNoise(noise === n ? null : n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="fld-lbl">Power Outlets</label>
        <div className="flex gap-1 mt-1">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              className={`ds-pill ${power === v ? 'on-s' : ''}`}
              onClick={() => setPower(power === v ? null : v)}
            >
              {v ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="fld-lbl">Notes (optional)</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 500))}
          placeholder="Share your experience..."
        />
      </div>
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-surf2 border border-border text-muted rounded-[5px] py-2 text-[11px] cursor-pointer"
        >
          cancel
        </button>
        <button
          type="submit"
          disabled={!rating}
          className="flex-[2] bg-[#555] border-none text-[#e0e0e0] rounded-[5px] py-2 text-[11px] cursor-pointer disabled:opacity-40"
        >
          submit review
        </button>
      </div>
    </form>
  )
}
