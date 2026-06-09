import { useEffect, useRef, useState } from 'react'
import {
  IconPlus,
  IconLanguage,
  IconMoon,
  IconSun,
  IconLayoutSidebarRight,
  IconMap,
  IconList,
  IconSearch,
  IconCoffee,
  IconBuilding,
  IconPlant,
  IconCode,
  IconUsers,
  IconDeviceGamepad,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/lib/hooks/useTheme'
import type { ViewMode, Vibe, UseCase, PlaceType, Filters } from '@/types'

interface CmdAction {
  id: string
  label: string
  icon: typeof IconSearch
  group: string
  run: () => void
}

interface CmdPaletteProps {
  open: boolean
  onClose: () => void
  onSubmitClick: () => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  filters: Filters
  onFilterChange: (f: Filters) => void
}

export function CmdPalette({
  open,
  onClose,
  onSubmitClick,
  view,
  onViewChange,
  filters,
  onFilterChange,
}: CmdPaletteProps) {
  const { t, i18n } = useTranslation()
  const { theme, toggle: toggleTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('pt') ? 'en' : 'pt')
  }

  const actions: CmdAction[] = [
    { id: 'submit', label: t('nav.submit'), icon: IconPlus, group: 'actions', run: () => { onSubmitClick() } },
    { id: 'lang', label: t('nav.subtitle') + ' — ' + (i18n.language.startsWith('pt') ? 'EN' : 'PT'), icon: IconLanguage, group: 'prefs', run: toggleLang },
    { id: 'theme', label: theme === 'dark' ? 'Light Mode' : 'Dark Mode', icon: theme === 'dark' ? IconSun : IconMoon, group: 'prefs', run: toggleTheme },

    { id: 'view-split', label: t('view.split'), icon: IconLayoutSidebarRight, group: 'view', run: () => onViewChange('split') },
    { id: 'view-map', label: t('view.map'), icon: IconMap, group: 'view', run: () => onViewChange('map') },
    { id: 'view-list', label: t('view.list'), icon: IconList, group: 'view', run: () => onViewChange('list') },

    { id: 'vibe-calm', label: 'vibe: calm', icon: IconCoffee, group: 'filters', run: () => onFilterChange({ ...filters, vibe: filters.vibe === 'calm' ? 'all' : 'calm' }) },
    { id: 'vibe-retro', label: 'vibe: retro', icon: IconPlant, group: 'filters', run: () => onFilterChange({ ...filters, vibe: filters.vibe === 'retro' ? 'all' : 'retro' }) },
    { id: 'vibe-modern', label: 'vibe: modern', icon: IconCode, group: 'filters', run: () => onFilterChange({ ...filters, vibe: filters.vibe === 'modern' ? 'all' : 'modern' }) },

    { id: 'use-coding', label: 'uso: coding', icon: IconCode, group: 'filters', run: () => onFilterChange({ ...filters, use: filters.use === 'coding' ? 'all' : 'coding' }) },
    { id: 'use-cowork', label: 'uso: cowork', icon: IconUsers, group: 'filters', run: () => onFilterChange({ ...filters, use: filters.use === 'cowork' ? 'all' : 'cowork' }) },
    { id: 'use-meetings', label: 'uso: meetings', icon: IconUsers, group: 'filters', run: () => onFilterChange({ ...filters, use: filters.use === 'meetings' ? 'all' : 'meetings' }) },
    { id: 'use-hackathon', label: 'uso: hackathon', icon: IconDeviceGamepad, group: 'filters', run: () => onFilterChange({ ...filters, use: filters.use === 'hackathon' ? 'all' : 'hackathon' }) },
    { id: 'use-chill', label: 'uso: chill', icon: IconCoffee, group: 'filters', run: () => onFilterChange({ ...filters, use: filters.use === 'chill' ? 'all' : 'chill' }) },

    { id: 'type-cafe', label: 'tipo: café', icon: IconCoffee, group: 'filters', run: () => onFilterChange({ ...filters, type: filters.type === 'café' ? 'all' : 'café' }) },
    { id: 'type-cowork', label: 'tipo: cowork', icon: IconBuilding, group: 'filters', run: () => onFilterChange({ ...filters, type: filters.type === 'cowork' ? 'all' : 'cowork' }) },
    { id: 'type-esplanada', label: 'tipo: esplanada', icon: IconPlant, group: 'filters', run: () => onFilterChange({ ...filters, type: filters.type === 'esplanada' ? 'all' : 'esplanada' }) },
  ]

  const q = query.toLowerCase()
  const filtered = actions.filter((a) => a.label.toLowerCase().includes(q))
  const groups = [...new Set(filtered.map((a) => a.group))]

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && filtered[selectedIdx]) {
        filtered[selectedIdx].run()
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, filtered, selectedIdx, onClose])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-[min(500px,92%)] bg-surf border border-border rounded-[10px] shadow-xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
          <IconSearch size={14} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="type a command..."
            className="border-none bg-transparent text-[12px] text-txt outline-none flex-1 placeholder:text-dim"
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-dim text-[11px]">no matching commands</div>
          ) : (
            groups.map((group) => (
              <div key={group}>
                <div className="text-[9px] text-dim uppercase tracking-wider px-2 pt-2 pb-1">{group}</div>
                {filtered
                  .filter((a) => a.group === group)
                  .map((a, i) => {
                    const globalIdx = filtered.indexOf(a)
                    const Icon = a.icon
                    return (
                      <button
                        key={a.id}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left text-[12px] rounded-[5px] transition-colors cursor-pointer ${
                          globalIdx === selectedIdx
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted hover:bg-accent/50 hover:text-accent-foreground'
                        }`}
                        onClick={() => { a.run(); onClose() }}
                        onMouseEnter={() => setSelectedIdx(globalIdx)}
                      >
                        <Icon size={14} className="shrink-0" />
                        <span>{a.label}</span>
                      </button>
                    )
                  })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
