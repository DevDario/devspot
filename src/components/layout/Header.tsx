import { IconKeyboard, IconLayoutSidebarRight, IconMap, IconList, IconCommand } from '@tabler/icons-react'
import type { ViewMode } from '@/types'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'

interface HeaderProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  onSubmitClick: () => void
  onSearchChange: (q: string) => void
  searchQuery: string
  resultCount: number
  onCmdOpen: () => void
}

const VIEW_ICONS: Record<string, typeof IconLayoutSidebarRight> = {
  split: IconLayoutSidebarRight,
  map: IconMap,
  list: IconList,
}

export function Header({ view, onViewChange, onSubmitClick, onSearchChange, searchQuery, resultCount, onCmdOpen }: HeaderProps) {
  const { t } = useTranslation()
  return (
    <div className="px-[14px] md:px-[18px] py-2.5 md:py-3 border-b border-border bg-surf flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] md:w-[30px] md:h-[30px] bg-[#222] border border-[#333] rounded-[6px] flex items-center justify-center">
            <IconKeyboard size={13} className="text-[#ccc] md:size-[15px]" />
          </div>
          <div>
            <div className="text-[14px] md:text-[15px] text-txt leading-tight">{t('nav.title')}</div>
            <div className="text-[10px] text-dim hidden md:block">{t('nav.subtitle')}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-1.5">
          <button
            onClick={onCmdOpen}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] text-dim border border-border rounded-[4px] bg-transparent cursor-pointer hover:text-muted transition-colors"
            title="Command palette"
          >
            <IconCommand size={12} />
            <span className="hidden sm:inline">K</span>
          </button>
          <div className="flex gap-[3px]">
            {(['split', 'map', 'list'] as const).map((mode) => {
              const Icon = VIEW_ICONS[mode]
              return (
                <button
                  key={mode}
                  onClick={() => onViewChange(mode)}
                  className={`px-[9px] py-[5px] text-[12px] rounded-[4px] border transition-colors cursor-pointer ${
                    view === mode
                      ? 'bg-[rgba(255,255,255,0.08)] border-[#555] text-[#ccc]'
                      : 'bg-transparent border-[rgba(255,255,255,0.08)] text-[#555]'
                  }`}
                  title={t(`view.${mode}`)}
                >
                  <Icon size={14} />
                </button>
              )
            })}
          </div>
          <LanguageSwitcher />
          <button
            onClick={onSubmitClick}
            className="bg-[#ddd] text-[#000] border-none rounded-[5px] px-3 py-[6px] text-[11px] cursor-pointer font-primary"
          >
            {t('nav.submit')}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-[9px] top-1/2 -translate-y-1/2 text-muted">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder={t('nav.search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="!pl-[28px]"
          />
        </div>
        <span className="text-dim text-[11px] whitespace-nowrap">{resultCount} {t('profile.places')}</span>
      </div>
    </div>
  )
}
