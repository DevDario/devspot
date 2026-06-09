import { useState } from 'react'
import type { Place, PlaceType, Vibe, UseCase, PriceRange } from '@/types'

interface SubmitPlaceModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (place: Partial<Place>) => void
}

const STEPS = [
  { title: '// the_place' },
  { title: '// vibe_check' },
  { title: '// dev_notes' },
]

const VIBE_OPTIONS: Vibe[] = ['calm', 'retro', 'modern']
const USE_OPTIONS: UseCase[] = ['coding', 'cowork', 'meetings', 'hackathon', 'chill']

export function SubmitPlaceModal({ open, onClose, onSubmit }: SubmitPlaceModalProps) {
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
            <div className="text-[10px] text-muted mb-[3px]">submit_place.exe</div>
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
                <label className="fld-lbl">NOME</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Café Central" />
              </div>
              <div>
                <label className="fld-lbl">TIPO</label>
                <select value={type} onChange={(e) => setType(e.target.value as PlaceType)}>
                  <option value="café">café</option>
                  <option value="cowork">cowork</option>
                  <option value="esplanada">esplanada</option>
                  <option value="restaurant">restaurant</option>
                  <option value="library">library</option>
                  <option value="other">outro</option>
                </select>
              </div>
              <div>
                <label className="fld-lbl">HORÁRIO</label>
                <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="08:00–22:00" />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="fld-lbl">AMBIENTE</label>
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
                <label className="fld-lbl">IDEAL PARA</label>
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
                <label className="fld-lbl">PREÇO</label>
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
                <label className="fld-lbl">TAGS (vírgula)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="wifi, AC, tomadas..." />
              </div>
              <div>
                <label className="fld-lbl">NOTAS</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Conta aos devs o que precisam saber..." />
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
              ← back
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
            {step < STEPS.length - 1 ? 'next →' : 'submit ↗'}
          </button>
        </div>
      </div>
    </div>
  )
}
