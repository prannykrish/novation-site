'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle, X, Eye, EyeOff } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Signing in with', email, password)
      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    setError(null)

    try {
      console.log('Reset password for:', resetEmail)
      setResetEmailSent(true)
    } catch (err: any) {
      console.error('Password reset error:', err)
      setError(err.message || 'Reset failed')
    } finally {
      setResetLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      console.log('Google sign-in triggered')
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 bg-[#2e0b13] border-2 border-[#D4AF37]">
        <CardContent className="grid p-0 md:grid-cols-2">
          {showResetForm ? (
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#D4AF37]">
                  Reset Password
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#D4AF37] hover:bg-[#3a0818]"
                  onClick={() => {
                    setShowResetForm(false)
                    setResetEmailSent(false)
                    setError(null)
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              {resetEmailSent ? (
                <div className="bg-[#3a0818] border border-[#D4AF37] text-[#D4AF37] p-4 rounded-md space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Check your email
                  </h3>
                  <p className="text-sm">
                    We've sent a password reset link to{' '}
                    <strong className="text-white">{resetEmail}</strong>.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    onClick={() => {
                      setShowResetForm(false)
                      setResetEmailSent(false)
                    }}
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handlePasswordReset}
                  className="space-y-4"
                >
                  {error && (
                    <div className="bg-red-800 text-red-300 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  <p className="text-[#D4AF37] text-sm">
                    Enter your email and we'll send a reset link.
                  </p>
                  <div className="grid gap-3">
                    <Label
                      htmlFor="reset-email"
                      className="text-[#D4AF37]"
                    >
                      Email
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={resetEmail}
                      onChange={(e) =>
                        setResetEmail(e.target.value)
                      }
                      className="bg-[#3a0818] text-white placeholder-[#D4AF37]/60 border border-[#D4AF37]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#D4AF37] text-[#2e0b13] hover:bg-[#c49e32]"
                    disabled={resetLoading}
                  >
                    {resetLoading
                      ? 'Sending...'
                      : 'Send Reset Link'}
                  </Button>
                </form>
              )}
            </div>
          ) : (
            <form
              className="p-6 md:p-8"
              onSubmit={handleSignIn}
            >
              <div className="flex flex-col gap-6">
                {error && (
                  <div className="bg-red-800 text-red-300 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-[#D4AF37]">
                    Welcome back
                  </h1>
                  <p className="text-[#D4AF37]/80 text-balance">
                    Login to your Novation account
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="email"
                    className="text-[#D4AF37]"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="bg-[#3a0818] text-white placeholder-[#D4AF37]/60 border border-[#D4AF37]"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label
                      htmlFor="password"
                      className="text-[#D4AF37]"
                    >
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetForm(true)
                        setResetEmail(email)
                        setError(null)
                      }}
                      className="ml-auto text-sm underline-offset-2 hover:underline text-[#D4AF37]"
                    >
                      Forgot your password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={
                        showPassword ? 'text' : 'password'
                      }
                      required
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="bg-[#3a0818] text-white border border-[#D4AF37] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-[#D4AF37]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        Toggle password visibility
                      </span>
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-[#2e0b13] hover:bg-[#c49e32]"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
                <div className="relative text-center text-sm">
                  <span className="bg-[#2e0b13] px-2 text-[#D4AF37]">
                    Or continue with Google
                  </span>
                  <div className="absolute inset-x-0 top-1/2 border-t border-[#D4AF37]/40" />
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-1/2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    onClick={handleGoogleSignIn}
                  >
                    {/* Google icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">
                      Sign in with Google
                    </span>
                  </Button>
                </div>
                <div className="text-center text-sm text-[#D4AF37]">
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    className="underline underline-offset-4 text-[#D4AF37]"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          )}

          <div className="bg-[#3a0818] relative hidden md:block">
            <img
              src="/images/plantred.jpg"
              alt="Decorative plant"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-[#D4AF37]/70">
        By clicking continue, you agree to our{' '}
        <a href="#" className="underline underline-offset-2">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  )
}
