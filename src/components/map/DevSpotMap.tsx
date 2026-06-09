import { useMemo } from 'react'
import { IconBuilding, IconCoffee } from '@tabler/icons-react'
import type { Place } from '@/types'
import { toPercent } from '@/lib/utils/geo'

interface DevSpotMapProps {
  places: Place[]
  selectedPlace: Place | null
  onSelectPlace: (place: Place | null) => void
}

const TYPE_COLORS: Record<string, string> = {
  café: '#b0b0b0',
  cowork: '#888',
  esplanada: '#666',
  restaurant: '#888',
  library: '#888',
  other: '#888',
}

const TYPE_ICONS: Record<string, typeof IconBuilding | typeof IconCoffee> = {
  cowork: IconBuilding,
  café: IconCoffee,
  esplanada: IconCoffee,
  restaurant: IconCoffee,
  library: IconCoffee,
  other: IconCoffee,
}

export function DevSpotMap({ places, selectedPlace, onSelectPlace }: DevSpotMapProps) {
  const svgLines = useMemo(
    () => (
      <svg viewBox="0 0 700 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-[0.06]">
        <line x1="0" y1="160" x2="700" y2="160" stroke="#fff" strokeWidth="1.5" />
        <line x1="0" y1="340" x2="700" y2="340" stroke="#fff" strokeWidth="1" />
        <line x1="160" y1="0" x2="160" y2="500" stroke="#fff" strokeWidth="1.5" />
        <line x1="500" y1="0" x2="500" y2="500" stroke="#fff" strokeWidth="1" />
        <line x1="60" y1="60" x2="640" y2="440" stroke="#fff" strokeWidth="0.5" />
        <circle cx="350" cy="250" r="100" stroke="#fff" fill="none" strokeWidth="0.5" />
      </svg>
    ),
    []
  )

  return (
    <div className="flex-1 relative overflow-hidden map-bg">
      {svgLines}
      <div className="absolute top-2.5 left-3 text-dim text-[10px] flex items-center gap-1 z-10">
        <IconMapPin size={11} />
        Luanda, Angola
      </div>
      {places.map((place) => {
        const { x, y } = toPercent(place.lng, place.lat)
        const isSel = selectedPlace?.id === place.id
        const Icon = TYPE_ICONS[place.type] || IconCoffee
        const sz = isSel ? 36 : 26
        const col = isSel ? '#ccc' : '#555'

        return (
          <div
            key={place.id}
            className="absolute cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: isSel ? 10 : 5 }}
            onClick={(e) => {
              e.stopPropagation()
              onSelectPlace(isSel ? null : place)
            }}
          >
            <div
              className="flex items-center justify-center rounded-full transition-all"
              style={{
                width: sz,
                height: sz,
                background: isSel ? '#222' : '#1a1a1a',
                border: isSel ? '2px solid #aaa' : '1px solid #444',
              }}
            >
              <Icon size={isSel ? 14 : 11} color={col} />
            </div>
            {isSel && (
              <div className="absolute -top-[22px] left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#333] rounded-[4px] px-[7px] py-[2px] whitespace-nowrap text-[10px] text-[#bbb]">
                {place.name}
              </div>
            )}
          </div>
        )
      })}
      <div className="absolute bottom-3 right-3 bg-[rgba(0,0,0,0.7)] border border-[#222] rounded-[6px] px-3 py-2 text-[10px] text-[#555]">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 mb-1 last:mb-0">
            <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: color }} />
            {type}
          </div>
        ))}
      </div>
      {selectedPlace && (
        <div className="absolute bottom-3 left-3 bg-[#141414] border border-[#2a2a2a] rounded-[8px] p-3 w-[220px] z-10">
          <div className="flex justify-between mb-[7px]">
            {(() => {
              const Icon = TYPE_ICONS[selectedPlace.type] || IconCoffee
              return <Icon size={20} color="#888" />
            })()}
            <button
              onClick={() => onSelectPlace(null)}
              className="bg-none border-none text-[#444] text-[15px] leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="text-[13px] text-[#d0d0d0] mb-0.5">{selectedPlace.name}</div>
          <div className="text-[10px] text-[#555] mb-[7px]">{selectedPlace.type} · {selectedPlace.hours}</div>
          <div className="flex flex-wrap gap-[3px]">
            {selectedPlace.tags.slice(0, 3).map((t) => (
              <span key={t} className="ds-tag">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function IconMapPin({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
