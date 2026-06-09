import { useParams, useNavigate, Link } from 'react-router-dom'
import { IconArrowLeft, IconKeyboard, IconTerminal2 } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/supabase/auth'
import { fetchProfileByUsername, fetchPlacesByUserId, fetchReviewsByUserId } from '@/lib/supabase/places'
import type { User, Place, Review } from '@/types'
import { PlaceCard } from '@/components/place/PlaceCard'
import { Loader2 } from 'lucide-react'

export function ProfilePage() {
  const { t } = useTranslation()
  const { username } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile, setProfile] = useState<User | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) { setLoading(false); return }
    setLoading(true)
    fetchProfileByUsername(username)
      .then(async (p) => {
        if (!p) { setError('User not found'); setLoading(false); return }
        setProfile(p)
        const [pl, rv] = await Promise.all([
          fetchPlacesByUserId(p.id),
          fetchReviewsByUserId(p.id),
        ])
        setPlaces(pl)
        setReviews(rv)
        setLoading(false)
      })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <IconTerminal2 size={32} className="mx-auto mb-3 text-dim" />
          <p className="text-[12px] text-muted mb-3">{error || 'User not found'}</p>
          <button onClick={() => navigate('/')} className="text-[11px] text-txt border border-border rounded-[4px] px-3 py-1.5 bg-surf2 cursor-pointer">
            back to map
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-muted text-[12px] cursor-pointer bg-none border-none"
          >
            <IconArrowLeft size={14} /> {t('submit.back')}
          </button>
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-[24px] h-[24px] bg-[#222] border border-[#333] rounded-[5px] flex items-center justify-center">
              <IconKeyboard size={12} className="text-[#ccc]" />
            </div>
            <span className="text-[12px] text-dim">{t('nav.title')}</span>
          </Link>
        </div>

        <div className="bg-surf border border-border rounded-[10px] p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-surf2 border border-border flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <span className="text-[20px] text-dim">{profile.username[0].toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-[18px] text-txt">@{profile.username}</h1>
              <p className="text-[11px] text-muted">{t('profile.member_since')} {new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-[12px] text-muted mb-4">
            {profile.bio || t('profile.no_bio')}
          </p>
          <div className="flex gap-4 text-[11px]">
            <div className="bg-surf2 border border-border rounded-[6px] px-3 py-2 text-center">
              <div className="text-txt font-bold">{places.length}</div>
              <div className="text-dim">{t('profile.places')}</div>
            </div>
            <div className="bg-surf2 border border-border rounded-[6px] px-3 py-2 text-center">
              <div className="text-txt font-bold">{reviews.length}</div>
              <div className="text-dim">{t('profile.reviews')}</div>
            </div>
          </div>
        </div>

        <div className="bg-surf border border-border rounded-[10px] p-5">
          <h2 className="text-[14px] text-txt mb-3">{t('profile.submitted_places')}</h2>
          {places.length === 0 ? (
            <p className="text-[11px] text-muted text-center py-4">{t('profile.no_places')}</p>
          ) : (
            <div className="flex flex-col">
              {places.map((p) => (
                <PlaceCard
                  key={p.id}
                  place={p}
                  selected={false}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
