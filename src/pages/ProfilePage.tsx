import { useParams, useNavigate, Link } from 'react-router-dom'
import { IconArrowLeft, IconKeyboard } from '@tabler/icons-react'
import { useAuth } from '@/lib/supabase/auth'

export function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-muted text-[12px] cursor-pointer bg-none border-none"
          >
            <IconArrowLeft size={14} /> back
          </button>
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-[24px] h-[24px] bg-[#222] border border-[#333] rounded-[5px] flex items-center justify-center">
              <IconKeyboard size={12} className="text-[#ccc]" />
            </div>
            <span className="text-[12px] text-dim">DevSpot</span>
          </Link>
        </div>

        <div className="bg-surf border border-border rounded-[10px] p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-surf2 border border-border flex items-center justify-center">
              <span className="text-[20px] text-dim">{(username || '?')[0].toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-[18px] text-txt">@{username}</h1>
              <p className="text-[11px] text-muted">Member since June 2026</p>
            </div>
          </div>
          <p className="text-[12px] text-muted mb-4">
            No bio yet.
          </p>
          <div className="flex gap-4 text-[11px]">
            <div className="bg-surf2 border border-border rounded-[6px] px-3 py-2 text-center">
              <div className="text-txt font-bold">0</div>
              <div className="text-dim">places</div>
            </div>
            <div className="bg-surf2 border border-border rounded-[6px] px-3 py-2 text-center">
              <div className="text-txt font-bold">0</div>
              <div className="text-dim">reviews</div>
            </div>
          </div>
        </div>

        <div className="bg-surf border border-border rounded-[10px] p-5">
          <h2 className="text-[14px] text-txt mb-3">Submitted Places</h2>
          <p className="text-[11px] text-muted text-center py-4">No places submitted yet.</p>
        </div>
      </div>
    </div>
  )
}
