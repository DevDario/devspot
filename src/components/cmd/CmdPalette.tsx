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
import type { ViewMode, PlaceType, Filters } from '@/types'

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

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('pt') ? 'en' : 'pt')
    onClose()
  }

  const vibeLabel = (v: string) => `${t('filters.vibe')} ${t(`place_type.${v}`, v)}`
  const useLabel = (u: string) => `${t('filters.use')} ${u}`
  const typeLabel = (pt: PlaceType) => `${t('filters.type')} ${t(`place_type.${pt}`, pt)}`

  const actions: CmdAction[] = [
    { id: 'submit', label: t('nav.submit'), icon: IconPlus, group: t('cmd.actions'), run: () => { onSubmitClick(); onClose() } },
    { id: 'lang', label: t('cmd.lang_switch'), icon: IconLanguage, group: t('cmd.prefs'), run: toggleLang },
    { id: 'theme', label: theme === 'dark' ? t('cmd.theme_light') : t('cmd.theme_dark'), icon: theme === 'dark' ? IconSun : IconMoon, group: t('cmd.prefs'), run: () => { toggleTheme(); onClose() } },

    { id: 'view-split', label: t('view.split'), icon: IconLayoutSidebarRight, group: t('cmd.view'), run: () => { onViewChange('split'); onClose() } },
    { id: 'view-map', label: t('view.map'), icon: IconMap, group: t('cmd.view'), run: () => { onViewChange('map'); onClose() } },
    { id: 'view-list', label: t('view.list'), icon: IconList, group: t('cmd.view'), run: () => { onViewChange('list'); onClose() } },

    { id: 'vibe-calm', label: vibeLabel('calm'), icon: IconCoffee, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, vibe: filters.vibe === 'calm' ? 'all' : 'calm' }); onClose() } },
    { id: 'vibe-retro', label: vibeLabel('retro'), icon: IconPlant, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, vibe: filters.vibe === 'retro' ? 'all' : 'retro' }); onClose() } },
    { id: 'vibe-modern', label: vibeLabel('modern'), icon: IconCode, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, vibe: filters.vibe === 'modern' ? 'all' : 'modern' }); onClose() } },

    { id: 'use-coding', label: useLabel('coding'), icon: IconCode, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, use: filters.use === 'coding' ? 'all' : 'coding' }); onClose() } },
    { id: 'use-cowork', label: useLabel('cowork'), icon: IconUsers, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, use: filters.use === 'cowork' ? 'all' : 'cowork' }); onClose() } },
    { id: 'use-meetings', label: useLabel('meetings'), icon: IconUsers, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, use: filters.use === 'meetings' ? 'all' : 'meetings' }); onClose() } },
    { id: 'use-hackathon', label: useLabel('hackathon'), icon: IconDeviceGamepad, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, use: filters.use === 'hackathon' ? 'all' : 'hackathon' }); onClose() } },
    { id: 'use-chill', label: useLabel('chill'), icon: IconCoffee, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, use: filters.use === 'chill' ? 'all' : 'chill' }); onClose() } },

    { id: 'type-cafe', label: typeLabel('café'), icon: IconCoffee, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, type: filters.type === 'café' ? 'all' : 'café' }); onClose() } },
    { id: 'type-cowork', label: typeLabel('cowork'), icon: IconBuilding, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, type: filters.type === 'cowork' ? 'all' : 'cowork' }); onClose() } },
    { id: 'type-esplanada', label: typeLabel('esplanada'), icon: IconPlant, group: t('cmd.filters'), run: () => { onFilterChange({ ...filters, type: filters.type === 'esplanada' ? 'all' : 'esplanada' }); onClose() } },
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
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, filtered, selectedIdx, onClose])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center pt-[15vh] pointer-events-none">
        <div
          className="pointer-events-auto w-[92%] max-w-[500px] bg-surf border border-border rounded-[10px] shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
            <IconSearch size={14} className="text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('cmd.placeholder')}
              className="border-none bg-transparent text-[12px] text-txt outline-none flex-1 placeholder:text-dim"
            />
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="text-center py-6 text-dim text-[11px]">{t('cmd.no_results')}</div>
            ) : (
              groups.map((group) => (
                <div key={group}>
                  <div className="text-[9px] text-dim uppercase tracking-wider px-2 pt-2 pb-1">{group}</div>
                  {filtered
                    .filter((a) => a.group === group)
                    .map((a) => {
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
                          onClick={() => { a.run() }}
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
    </div>
  )
}
