'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function ResetPasswordForm() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check if this is a recovery flow
      if (searchParams.get('type') !== 'recovery') {
        setError('Invalid password reset link')
        return
      }

      // Validate password
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match')
        return
      }

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: newPassword 
      })
      
      if (updateError) throw updateError
      
      setSuccess(true)
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/signin')
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {success ? (
          <div className="text-center p-4">
            <h3 className="text-lg font-medium text-green-600 mb-2">Password Updated Successfully!</h3>
            <p className="text-sm text-gray-500">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password"
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password"
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required
                placeholder="Confirm new password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
