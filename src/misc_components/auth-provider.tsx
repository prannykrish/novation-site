// src/components/auth-provider.tsx
'use client'

import { createContext, useContext, useState } from 'react'

type AuthContextType = {
  user: null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Since Supabase is removed, default to user=null and loading=false
  const [user] = useState<null>(null)
  const [loading] = useState(false)

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
