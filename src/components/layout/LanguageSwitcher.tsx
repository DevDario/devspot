import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language.startsWith('pt') ? 'en' : 'pt'
    i18n.changeLanguage(next)
  }

  const current = i18n.language.startsWith('pt') ? 'PT' : 'EN'

  return (
    <button
      onClick={toggleLang}
      className="text-[10px] text-dim border border-border rounded-[4px] px-2 py-1 cursor-pointer bg-transparent hover:text-muted transition-colors"
    >
      {current === 'PT' ? 'EN' : 'PT'}
    </button>
  )
}
