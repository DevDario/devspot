import { IconKeyboard, IconLayoutSidebarRight, IconMap, IconList } from '@tabler/icons-react'
import type { ViewMode } from '@/types'

interface HeaderProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  onSubmitClick: () => void
  onSearchChange: (q: string) => void
  searchQuery: string
  resultCount: number
}

const VIEWS: { mode: ViewMode; icon: typeof IconLayoutSidebarRight; label: string }[] = [
  { mode: 'split', icon: IconLayoutSidebarRight, label: 'split' },
  { mode: 'map', icon: IconMap, label: 'map' },
  { mode: 'list', icon: IconList, label: 'list' },
]

export function Header({ view, onViewChange, onSubmitClick, onSearchChange, searchQuery, resultCount }: HeaderProps) {
  return (
    <div className="px-[18px] py-3 border-b border-border bg-surf flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-[#222] border border-[#333] rounded-[6px] flex items-center justify-center">
            <IconKeyboard size={15} className="text-[#ccc]" />
          </div>
          <div>
            <div className="text-[15px] text-[#e8e8e8] leading-tight">DevSpot</div>
            <div className="text-[10px] text-dim">// places devs actually go to</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-[3px]">
            {VIEWS.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => onViewChange(mode)}
                className={`px-[9px] py-[5px] text-[12px] rounded-[4px] border transition-colors cursor-pointer ${
                  view === mode
                    ? 'bg-[rgba(255,255,255,0.08)] border-[#555] text-[#ccc]'
                    : 'bg-transparent border-[rgba(255,255,255,0.08)] text-[#555]'
                }`}
                title={label}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
          <button
            onClick={onSubmitClick}
            className="bg-[#ddd] text-[#000] border-none rounded-[5px] px-3 py-[6px] text-[11px] cursor-pointer font-primary"
          >
            + submit
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-[9px] top-1/2 -translate-y-1/2 text-muted" size={13} />
          <input
            type="text"
            placeholder="search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="!pl-[28px]"
          />
        </div>
        <span className="text-dim text-[11px] whitespace-nowrap">{resultCount} lugares</span>
      </div>
    </div>
  )
}

function IconSearch({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
