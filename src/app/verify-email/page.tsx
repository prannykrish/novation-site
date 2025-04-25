'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoaderCircle, Mail, AlertCircle, CheckCircle2, Home } from 'lucide-react'

export default function VerifyEmail() {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Get the user's email from session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setEmail(session.user.email)
      } else {
        // If no session, they probably navigated here directly
        // We could redirect to sign-in, but it's fine to stay on this page too
      }
    }
    getSession()
  }, [supabase])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleResendEmail = async () => {
    if (!email) return
    
    setLoading(true)
    setResendSuccess(false)
    setResendError(null)
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      
      if (error) throw error
      
      setResendSuccess(true)
      setCanResend(false)
      setCountdown(60)
    } catch (err: any) {
      console.error('Error resending verification email:', err)
      setResendError(err.message || 'Failed to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  const goToHome = () => {
    router.push('/')
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification email to{' '}
            <span className="font-medium">{email || 'your email address'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resendSuccess && (
            <Alert variant="default" className="border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Email sent!</AlertTitle>
              <AlertDescription>
                A new verification email has been sent to your inbox.
              </AlertDescription>
            </Alert>
          )}
          
          {resendError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{resendError}</AlertDescription>
            </Alert>
          )}
          
          <div className="rounded-md bg-muted p-4">
            <h3 className="font-medium mb-2">Next steps:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Check your email inbox for a message from us.</li>
              <li>Click the verification link in the email.</li>
              <li>If you don't see the email, check your spam folder.</li>
              <li>Once verified, you'll be able to sign in to your account.</li>
            </ol>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Didn't receive the email? Check your spam folder or click the button below to resend.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            onClick={handleResendEmail}
            className="w-full"
            disabled={loading || !canResend}
          >
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : !canResend ? (
              `Resend email (${countdown}s)`
            ) : (
              'Resend verification email'
            )}
          </Button>
          <Button variant="outline" onClick={goToHome} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Return to home page
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}