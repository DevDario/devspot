import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconArrowLeft } from '@tabler/icons-react'

export function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <h1 className="text-[48px] md:text-[64px] text-txt font-bold leading-none mb-4">
          404
        </h1>
        <p className="text-[13px] text-muted mb-1">
          {t('not_found.title')}
        </p>
        <p className="text-[11px] text-dim mb-8">
          {t('not_found.subtitle')}
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-[12px] text-txt bg-[#555] border-none rounded-[5px] px-4 py-2 cursor-pointer"
        >
          <IconArrowLeft size={14} />
          {t('not_found.back_home')}
        </button>
        <p className="text-[10px] text-dim mt-4 italic">
          {t('not_found.hint')}
        </p>
      </div>
    </div>
  )
}
