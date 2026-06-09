import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconKeyboard, IconLayoutSidebarRight, IconMap, IconList,
  IconCommand, IconSun, IconMoon, IconUser, IconMenu2, IconX,
} from '@tabler/icons-react'
import type { ViewMode } from '@/types'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/lib/hooks/useTheme'
import type { User } from '@supabase/supabase-js'

interface HeaderProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  onSubmitClick: () => void
  onSearchChange: (q: string) => void
  searchQuery: string
  resultCount: number
  onCmdOpen: () => void
  user: User | null
}

const VIEW_ICONS: Record<string, typeof IconLayoutSidebarRight> = {
  split: IconLayoutSidebarRight,
  map: IconMap,
  list: IconList,
}

export function Header({ view, onViewChange, onSubmitClick, onSearchChange, searchQuery, resultCount, onCmdOpen, user }: HeaderProps) {
  const { t } = useTranslation()
  const { theme, toggle: toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const desktopActions = (
    <div className="flex items-center gap-1 md:gap-1.5">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-1 px-2 py-1.5 text-[10px] text-dim border border-border rounded-[4px] bg-transparent cursor-pointer hover:text-muted transition-colors"
        title={theme === 'dark' ? t('nav.theme_light') : t('nav.theme_dark')}
      >
        {theme === 'dark' ? <IconSun size={12} /> : <IconMoon size={12} />}
      </button>
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
      {user ? (
        <button
          onClick={() => navigate(`/profile/${user.user_metadata?.username || ''}`)}
          className="flex items-center gap-1 px-2 py-1.5 text-[10px] text-dim border border-border rounded-[4px] bg-transparent cursor-pointer hover:text-muted transition-colors"
          title={t('nav.profile')}
        >
          <IconUser size={12} />
        </button>
      ) : (
        <button
          onClick={() => navigate('/signin')}
          className="text-[10px] text-dim border border-border rounded-[4px] px-2 py-1.5 bg-transparent cursor-pointer hover:text-muted transition-colors"
        >
          {t('auth.sign_in')}
        </button>
      )}
      <button
        onClick={onSubmitClick}
        className="bg-[#ddd] text-[#000] border-none rounded-[5px] px-3 py-[6px] text-[11px] cursor-pointer font-primary"
      >
        {t('nav.submit')}
      </button>
    </div>
  )

  const mobileMenu = (
    <div className="flex items-center gap-1 md:hidden">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-1 px-2 py-1.5 text-dim bg-transparent border border-border rounded-[4px] cursor-pointer"
      >
        {menuOpen ? <IconX size={14} /> : <IconMenu2 size={14} />}
      </button>
    </div>
  )

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
        <div className="hidden md:flex">{desktopActions}</div>
        {mobileMenu}
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surf2 border border-border rounded-[8px] p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-2.5 py-2 text-[11px] text-dim border border-border rounded-[4px] bg-transparent cursor-pointer hover:text-muted transition-colors flex-1 justify-center"
            >
              {theme === 'dark' ? <IconSun size={13} /> : <IconMoon size={13} />}
            </button>
            <button
              onClick={onCmdOpen}
              className="flex items-center gap-1 px-2.5 py-2 text-[11px] text-dim border border-border rounded-[4px] bg-transparent cursor-pointer hover:text-muted transition-colors flex-1 justify-center"
            >
              <IconCommand size={13} /> K
            </button>
            <LanguageSwitcher />
          </div>
          <div className="flex gap-[3px]">
            {(['split', 'map', 'list'] as const).map((mode) => {
              const Icon = VIEW_ICONS[mode]
              return (
                <button
                  key={mode}
                  onClick={() => { onViewChange(mode); setMenuOpen(false) }}
                  className={`flex-1 px-[9px] py-[7px] text-[12px] rounded-[4px] border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    view === mode
                      ? 'bg-[rgba(255,255,255,0.08)] border-[#555] text-[#ccc]'
                      : 'bg-transparent border-[rgba(255,255,255,0.08)] text-[#555]'
                  }`}
                >
                  <Icon size={13} /> {t(`view.${mode}`)}
                </button>
              )
            })}
          </div>
          <div className="flex gap-2">
            {user ? (
              <button
                onClick={() => { navigate(`/profile/${user.user_metadata?.username || ''}`); setMenuOpen(false) }}
                className="flex items-center gap-1.5 px-2.5 py-2 text-[11px] text-dim border border-border rounded-[4px] bg-transparent cursor-pointer hover:text-muted transition-colors flex-1 justify-center"
              >
                <IconUser size={13} /> {t('nav.profile')}
              </button>
            ) : (
              <button
                onClick={() => { navigate('/signin'); setMenuOpen(false) }}
                className="flex items-center gap-1.5 px-2.5 py-2 text-[11px] text-dim border border-border rounded-[4px] bg-transparent cursor-pointer hover:text-muted transition-colors flex-1 justify-center"
              >
                <IconUser size={13} /> {t('auth.sign_in')}
              </button>
            )}
          </div>
          <button
            onClick={() => { onSubmitClick(); setMenuOpen(false) }}
            className="bg-[#ddd] text-[#000] border-none rounded-[5px] py-[9px] text-[12px] cursor-pointer w-full"
          >
            {t('nav.submit')}
          </button>
        </div>
      )}

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
