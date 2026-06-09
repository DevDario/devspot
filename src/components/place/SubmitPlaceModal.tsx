import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconX, IconPhoto, IconMapPin, IconSearch } from '@tabler/icons-react'
import type { PlaceType, Vibe, UseCase, PriceRange } from '@/types'
import { placeSchema, type PlaceFormData } from '@/lib/schemas'

interface SubmitPlaceModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (place: PlaceFormData, photos: File[]) => Promise<void>
}

const VIBE_OPTIONS: Vibe[] = ['calm', 'retro', 'modern']
const USE_OPTIONS: UseCase[] = ['coding', 'cowork', 'meetings', 'hackathon', 'chill']

let nominatimTimer: ReturnType<typeof setTimeout> | null = null

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
  const [photos, setPhotos] = useState<File[]>([])
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState<string | null>(null)
  const [useLocation, setUseLocation] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<{ display: string; lat: number; lng: number }[]>([])
  const [showAddresses, setShowAddresses] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const getLocation = () => {
    if (!navigator.geolocation) { setLocError(t('map.error_location')); return }
    setLocating(true)
    setLocError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setLocating(false) },
      () => { setLocError(t('map.error_location')); setLocating(false) },
      { enableHighAccuracy: true },
    )
  }

  const toggleLocation = () => {
    if (useLocation) {
      setUseLocation(false)
      setLat(null)
      setLng(null)
      setLocError(null)
    } else {
      setUseLocation(true)
      getLocation()
    }
  }

  const toggleUse = (u: UseCase) => {
    setUseCases((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]))
  }

  const searchAddress = (q: string) => {
    setAddress(q)
    if (nominatimTimer) clearTimeout(nominatimTimer)
    if (q.length < 4) { setAddresses([]); setShowAddresses(false); return }
    nominatimTimer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=ao`,
          { headers: { 'User-Agent': 'DevSpot/1.0' } }
        )
        const data = await res.json()
        setAddresses(
          (data as { display_name: string; lat: string; lon: string }[]).map((d) => ({
            display: d.display_name,
            lat: parseFloat(d.lat),
            lng: parseFloat(d.lon),
          }))
        )
        setShowAddresses(true)
      } catch { setAddresses([]) }
    }, 500)
  }

  const selectAddress = (addr: { display: string; lat: number; lng: number }) => {
    setAddress(addr.display)
    setLat(addr.lat)
    setLng(addr.lng)
    setShowAddresses(false)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setErrors({})

    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean)

    const formData: PlaceFormData = {
      name,
      type,
      hours,
      vibe,
      use_cases: useCases,
      price_range: price,
      tags: tagList.join(','),
      notes,
      address,
      lat: useLocation ? lat : (addresses.length > 0 ? lat : null),
      lng: useLocation ? lng : (addresses.length > 0 ? lng : null),
      useLocation,
    }

    const result = placeSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        const msgKey = issue.message
        fieldErrors[key] = t(`submit.${msgKey}` as any)
      }
      if (!useLocation && !address.trim()) {
        fieldErrors.address = t('submit.required_address')
      }
      setErrors(fieldErrors)
      setSubmitting(false)
      return
    }

    if (!useLocation && !address.trim()) {
      setErrors({ address: t('submit.required_address') })
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, photos)
      reset()
      onClose()
    } catch {
      setErrors({ submit: t('submit.error') })
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep(0); setName(''); setType('café'); setHours(''); setVibe('calm')
    setUseCases([]); setPrice(2); setTags(''); setNotes(''); setPhotos([])
    setLat(null); setLng(null); setLocError(null); setUseLocation(false)
    setErrors({}); setAddress(''); setAddresses([]); setShowAddresses(false)
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(Array.from(e.target.files))
  }

  const STEPS = [
    { title: t('submit.step1') },
    { title: t('submit.step2') },
    { title: t('submit.step3') },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surf border border-border rounded-[10px] w-[min(420px,92%)] max-sm:w-full max-sm:rounded-none max-sm:h-full max-sm:overflow-y-auto p-5 relative">
        <div className="flex justify-between mb-4 items-start">
          <div>
            <div className="text-[10px] text-muted mb-[3px]">{t('submit.title')}</div>
            <div className="text-[15px] text-txt">{STEPS[step].title}</div>
          </div>
          <button onClick={() => { reset(); onClose() }} className="bg-none border-none text-muted cursor-pointer">
            <IconX size={16} />
          </button>
        </div>

        <div className="flex gap-[5px] mb-[14px]">
          {STEPS.map((_, i) => (
            <div key={i} className="h-[2px] rounded-sm flex-1 transition-colors" style={{ background: i <= step ? '#888' : '#333' }} />
          ))}
        </div>

        <div className="mb-4">
          {step === 0 && (
            <div className="flex flex-col gap-2.5">
              <div>
                <label className="fld-lbl">{t('submit.name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('submit.name_placeholder')}
                />
                {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>}
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
              <div>
                <label className="fld-lbl">{t('submit.address')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => searchAddress(e.target.value)}
                    placeholder={t('submit.address_placeholder')}
                    className="!pl-[28px]"
                    disabled={useLocation}
                  />
                  <IconSearch size={13} className="absolute left-[9px] top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                </div>
                {showAddresses && addresses.length > 0 && (
                  <div className="mt-1 bg-surf2 border border-border rounded-[5px] max-h-[140px] overflow-y-auto">
                    {addresses.map((a, i) => (
                      <button
                        key={i}
                        className="w-full text-left text-[10px] text-muted px-2 py-1.5 hover:bg-[rgba(255,255,255,0.05)] border-b border-border last:border-none cursor-pointer"
                        onClick={() => selectAddress(a)}
                      >
                        {a.display}
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleLocation}
                    disabled={locating}
                    className={`text-[10px] cursor-pointer rounded-[3px] px-2.5 py-1 transition-colors disabled:opacity-40 flex items-center gap-1 ${
                      useLocation
                        ? 'bg-[rgba(220,220,220,0.08)] border border-[#aaa] text-[#ddd]'
                        : 'bg-transparent border border-border text-dim'
                    }`}
                  >
                    <IconMapPin size={12} />
                    {useLocation ? t('submit.location_on') : t('submit.location_off')}
                  </button>
                  {useLocation && locating && (
                    <span className="text-[10px] text-muted">{t('submit.getting_location')}</span>
                  )}
                  {useLocation && !locating && lat !== null && lng !== null && (
                    <span className="text-[10px] text-dim">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                  )}
                </div>
                {locError && <p className="text-[10px] text-red-400 mt-1">{locError}</p>}
                {errors.address && <p className="text-[10px] text-red-400 mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="fld-lbl">{t('submit.notes')}</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('submit.notes_placeholder')} />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="fld-lbl">{t('submit.vibe')}</label>
                <div className="flex gap-1 mt-1.5">
                  {VIBE_OPTIONS.map((v) => (
                    <button key={v} className={`ds-pill ${vibe === v ? 'on-a' : ''}`} onClick={() => setVibe(v)}>{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="fld-lbl">{t('submit.use_cases')}</label>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {USE_OPTIONS.map((u) => (
                    <button key={u} className={`ds-pill ${useCases.includes(u) ? 'on-g' : ''}`} onClick={() => toggleUse(u)}>{u}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="fld-lbl">{t('submit.price')}</label>
                <div className="flex gap-1 mt-1.5">
                  {([1, 2, 3] as PriceRange[]).map((p) => (
                    <button key={p} className={`ds-pill ${price === p ? 'on-s' : ''}`} onClick={() => setPrice(p)}>{'$'.repeat(p)}</button>
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
                <label className="fld-lbl">PHOTOS</label>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 text-[11px] text-muted border border-border rounded-[5px] px-3 py-2 bg-surf2 cursor-pointer w-full hover:text-txt transition-colors"
                >
                  <IconPhoto size={14} />
                  {photos.length ? `${photos.length} ${t('submit.photos_selected')}` : t('submit.photo_btn')}
                </button>
              </div>
              {errors.submit && <p className="text-[10px] text-red-400 mt-1">{errors.submit}</p>}
            </div>
          )}
        </div>

        <div className="flex gap-[7px]">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="flex-1 bg-surf2 border border-border text-muted rounded-[5px] py-[9px] text-[11px] cursor-pointer">
              {t('submit.back')}
            </button>
          )}
          <button
            onClick={() => { if (step < STEPS.length - 1) { setStep((s) => s + 1) } else { handleSubmit() } }}
            disabled={submitting}
            className="flex-[2] bg-[#555] border-none text-txt rounded-[5px] py-[9px] text-[11px] cursor-pointer disabled:opacity-40"
            style={{ background: step === STEPS.length - 1 ? '#777' : '#555' }}
          >
            {submitting ? t('submit.uploading') : step < STEPS.length - 1 ? t('submit.next') : t('submit.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
