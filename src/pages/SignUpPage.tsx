import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { IconKeyboard, IconCircleCheck } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/supabase/auth'

export function SignUpPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const err = await signUp(email, password)
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-surf border border-border rounded-[10px] p-6 max-w-sm w-full text-center">
          <IconCircleCheck size={28} className="mx-auto mb-2 text-[#5bc8a0]" />
          <h1 className="text-[16px] text-txt mb-2">{t('auth.check_email')}</h1>
          <p className="text-[11px] text-muted mb-4">
            {t('auth.check_email_desc')} <strong className="text-txt">{email}</strong>
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="bg-[#ddd] text-[#000] border-none rounded-[5px] px-4 py-2 text-[12px] cursor-pointer"
          >
            {t('auth.go_to_signin')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-[36px] h-[36px] bg-[#222] border border-[#333] rounded-[8px] flex items-center justify-center">
            <IconKeyboard size={18} className="text-[#ccc]" />
          </div>
          <div>
            <div className="text-[18px] text-[#e8e8e8] leading-tight">{t('nav.title')}</div>
            <div className="text-[10px] text-dim">{t('nav.subtitle')}</div>
          </div>
        </div>

        <div className="bg-surf border border-border rounded-[10px] p-6">
          <h1 className="text-[16px] text-txt mb-1">{t('auth.sign_up_title')}</h1>
          <p className="text-[11px] text-muted mb-5">{t('auth.sign_up_desc')}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="fld-lbl">{t('auth.email')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dev@example.com" required />
            </div>
            <div>
              <label className="fld-lbl">{t('auth.password')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>

            {error && <p className="text-[11px] text-red-400">{error}</p>}

            <button type="submit" className="bg-[#ddd] text-[#000] border-none rounded-[5px] py-[9px] text-[12px] cursor-pointer mt-1">
              {t('auth.sign_up')}
            </button>
          </form>

          <p className="text-[11px] text-dim text-center mt-4">
            {t('auth.has_account')}{' '}
            <Link to="/signin" className="text-[#bbb] underline">{t('auth.sign_in')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
