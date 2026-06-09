import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { IconKeyboard } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/supabase/auth'

export function SignInPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const err = await signIn(email, password)
    if (err) {
      setError(err)
    } else {
      navigate('/')
    }
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
          <h1 className="text-[16px] text-txt mb-1">{t('auth.sign_in_title')}</h1>
          <p className="text-[11px] text-muted mb-5">{t('auth.sign_in_desc')}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="fld-lbl">{t('auth.email')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dev@example.com" required />
            </div>
            <div>
              <label className="fld-lbl">{t('auth.password')}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && <p className="text-[11px] text-red-400">{error}</p>}

            <button type="submit" className="bg-[#ddd] text-[#000] border-none rounded-[5px] py-[9px] text-[12px] cursor-pointer mt-1">
              {t('auth.sign_in')}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-[10px] text-dim">{t('auth.or')}</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full bg-surf2 border border-border text-muted rounded-[5px] py-[9px] text-[11px] cursor-pointer flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            {t('auth.google')}
          </button>

          <p className="text-[11px] text-dim text-center mt-4">
            {t('auth.no_account')}{' '}
            <Link to="/signup" className="text-[#bbb] underline">{t('auth.sign_up')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path fill="#888" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#888" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#888" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#888" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
