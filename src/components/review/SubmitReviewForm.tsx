import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconWifi, IconHeadphones, IconPlugConnected } from '@tabler/icons-react'
import type { NoiseLevel, Review } from '@/types'
import { InteractiveStars } from './StarRating'

interface SubmitReviewFormProps {
  initial?: Review
  onSubmit: (review: {
    rating: number
    wifi_quality: number | null
    noise_level: NoiseLevel | null
    power_outlets: boolean | null
    body: string
  }) => void
  onCancel: () => void
}

export function SubmitReviewForm({ initial, onSubmit, onCancel }: SubmitReviewFormProps) {
  const { t } = useTranslation()
  const [rating, setRating] = useState(initial?.rating || 0)
  const [wifi, setWifi] = useState<number | null>(initial?.wifi_quality || null)
  const [noise, setNoise] = useState<NoiseLevel | null>(initial?.noise_level || null)
  const [power, setPower] = useState<boolean | null>(initial?.power_outlets ?? null)
  const [body, setBody] = useState(initial?.body || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) return
    onSubmit({ rating, wifi_quality: wifi, noise_level: noise, power_outlets: power, body })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="fld-lbl">{t('review.rating')}</label>
        <InteractiveStars rating={rating} onChange={setRating} />
      </div>
      <div>
        <label className="fld-lbl">{t('review.wifi')}</label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3].map((w) => (
            <button
              key={w}
              type="button"
              className={`ds-pill ${wifi === w ? 'on-g' : ''}`}
              onClick={() => setWifi(wifi === w ? null : w)}
            >
              <IconWifi size={12} /> {w}/3
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="fld-lbl">{t('review.noise')}</label>
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
        <label className="fld-lbl">{t('review.power')}</label>
        <div className="flex gap-1 mt-1">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              className={`ds-pill ${power === v ? 'on-s' : ''}`}
              onClick={() => setPower(power === v ? null : v)}
            >
              <IconPlugConnected size={12} /> {v ? t('review.yes') : t('review.no_power')}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="fld-lbl">{t('review.body')}</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 500))}
          placeholder={t('review.body_placeholder')}
        />
      </div>
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-surf2 border border-border text-muted rounded-[5px] py-2 text-[11px] cursor-pointer"
        >
          {t('review.cancel')}
        </button>
        <button
          type="submit"
          disabled={!rating}
          className="flex-[2] bg-[#555] border-none text-[#e0e0e0] rounded-[5px] py-2 text-[11px] cursor-pointer disabled:opacity-40"
        >
          {initial ? t('review.update') : t('review.submit')}
        </button>
      </div>
    </form>
  )
}
