import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function LogoutOverlay() {
  const { t } = useTranslation()
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFading(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="bg-surf border border-border rounded-[10px] p-6 text-center shadow-lg">
        <p className="text-[14px] text-txt">{t('auth.signed_out')}</p>
      </div>
    </div>
  )
}
