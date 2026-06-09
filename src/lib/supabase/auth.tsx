import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './client'

interface AuthContext {
  user: User | null
  profileUsername: string | null
  loading: boolean
  showLogoutMessage: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  profileUsername: null,
  loading: true,
  showLogoutMessage: false,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  signInWithGoogle: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profileUsername, setProfileUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutMessage, setShowLogoutMessage] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setProfileUsername(null)
      return
    }
    supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfileUsername(data?.username ?? null)
      })
  }, [user])

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error?.message ?? null
  }

  const signUp = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({ email, password })
    return error?.message ?? null
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setShowLogoutMessage(true)
    setTimeout(() => setShowLogoutMessage(false), 2500)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <AuthCtx.Provider value={{ user, profileUsername, loading, showLogoutMessage, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
