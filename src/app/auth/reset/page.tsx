'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ResetPasswordPage() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (searchParams.get('type') !== 'recovery') return
      await supabase.auth.updateUser({ password: newPassword })
      router.push('/signin')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>New Password</label>
      <input 
        type="password" 
        value={newPassword} 
        onChange={e => setNewPassword(e.target.value)} 
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Reset Password</button>
    </form>
  )
}