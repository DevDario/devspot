import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Place, PlaceType, Vibe, UseCase, PriceRange } from '@/types'

interface SubmitPlaceModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (place: Partial<Place>) => void
}

const VIBE_OPTIONS: Vibe[] = ['calm', 'retro', 'modern']
const USE_OPTIONS: UseCase[] = ['coding', 'cowork', 'meetings', 'hackathon', 'chill']

export function SubmitPlaceModal({ open, onClose, onSubmit }: SubmitPlaceModalProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const [name, setName] = useState('')
  const [type, setType] = useState<PlaceType>('café')
  const [hours, setHours] = useState('')
  const [vibe, setVibe] = useState<Vibe>('calm')
  const [useCases, setUseCases] = useState<UseCase[]>([])
  const [price, setPrice] = useState<PriceRange>(2)
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')

  if (!open) return null

  const toggleUse = (u: UseCase) => {
    setUseCases((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]))
  }

  const handleSubmit = () => {
    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    onSubmit({
      name,
      type,
      hours,
      vibe,
      use_cases: useCases,
      price_range: price,
      tags: tagList,
    })
    reset()
    onClose()
  }

  const reset = () => {
    setStep(0)
    setName('')
    setType('café')
    setHours('')
    setVibe('calm')
    setUseCases([])
    setPrice(2)
    setTags('')
    setNotes('')
  }

  const STEPS = [
    { title: t('submit.step1') },
    { title: t('submit.step2') },
    { title: t('submit.step3') },
  ]

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.82)] flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-[10px] w-[min(420px,92%)] p-5 relative">
        <div className="flex justify-between mb-4 items-start">
          <div>
            <div className="text-[10px] text-muted mb-[3px]">{t('submit.title')}</div>
            <div className="text-[15px] text-[#e0e0e0]">{STEPS[step].title}</div>
          </div>
          <button
            onClick={() => {
              reset()
              onClose()
            }}
            className="bg-none border-none text-muted text-[17px] leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-[5px] mb-[14px]">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-[2px] rounded-sm flex-1 transition-colors"
              style={{ background: i <= step ? '#888' : '#222' }}
            />
          ))}
        </div>

        <div className="mb-4">
          {step === 0 && (
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="fld-lbl">{t('submit.name')}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('submit.name_placeholder')} />
              </div>
              <div>
                <label className="fld-lbl">{t('submit.type')}</label>
                <select value={type} onChange={(e) => setType(e.target.value as PlaceType)}>
                  <option value="café">{t('place_type.café')}</option>
                  <option value="cowork">{t('place_type.cowork')}</option>
                  <option value="esplanada">{t('place_type.esplanada')}</option>
                  <option value="restaurant">{t('place_type.restaurant')}</option>
                  <option value="library">{t('place_type.library')}</option>
                  <option value="other">{t('place_type.other')}</option>
                </select>
              </div>
              <div>
                <label className="fld-lbl">{t('submit.hours')}</label>
                <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} placeholder={t('submit.hours_placeholder')} />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="fld-lbl">{t('submit.vibe')}</label>
                <div className="flex gap-1 mt-1.5">
                  {VIBE_OPTIONS.map((v) => (
                    <button
                      key={v}
                      className={`ds-pill ${vibe === v ? 'on-a' : ''}`}
                      onClick={() => setVibe(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="fld-lbl">{t('submit.use_cases')}</label>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {USE_OPTIONS.map((u) => (
                    <button
                      key={u}
                      className={`ds-pill ${useCases.includes(u) ? 'on-g' : ''}`}
                      onClick={() => toggleUse(u)}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="fld-lbl">{t('submit.price')}</label>
                <div className="flex gap-1 mt-1.5">
                  {([1, 2, 3] as PriceRange[]).map((p) => (
                    <button
                      key={p}
                      className={`ds-pill ${price === p ? 'on-s' : ''}`}
                      onClick={() => setPrice(p)}
                    >
                      {'$'.repeat(p)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="fld-lbl">{t('submit.tags')}</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('submit.tags_placeholder')} />
              </div>
              <div>
                <label className="fld-lbl">{t('submit.notes')}</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('submit.notes_placeholder')} />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-[7px]">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 bg-surf2 border border-border text-muted rounded-[5px] py-[9px] text-[11px] cursor-pointer"
            >
              {t('submit.back')}
            </button>
          )}
          <button
            onClick={() => {
              if (step < STEPS.length - 1) {
                setStep((s) => s + 1)
              } else {
                handleSubmit()
              }
            }}
            className="flex-[2] bg-[#333] border-none text-[#e0e0e0] rounded-[5px] py-[9px] text-[11px] cursor-pointer"
            style={{ background: step === STEPS.length - 1 ? '#555' : '#333' }}
          >
            {step < STEPS.length - 1 ? t('submit.next') : t('submit.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
