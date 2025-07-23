import React, { Suspense } from 'react'
import { Metadata } from 'next'
//import ResetPasswordForm from './reset-password-form'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
}

// Loading fallback component
function ResetFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
      <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
      <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>
        <Suspense fallback={<ResetFormSkeleton />}>
          {/* <ResetPasswordForm /> */}
        </Suspense>
      </div>
    </div>
  )
}