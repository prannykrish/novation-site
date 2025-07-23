// 'use client'
// import { useState, useEffect } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Eye, EyeOff } from "lucide-react"

// export default function ResetPasswordForm() {
//   const supabase = createClientComponentClient()
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [validRecovery, setValidRecovery] = useState(false)

//   // Check if this is a valid recovery session
//   useEffect(() => {
//     const checkSession = async () => {
//       // First check if we have the recovery type in URL params
//       const isRecovery = searchParams.get('type') === 'recovery'
      
//       if (!isRecovery) {
//         setError('Invalid password reset link. Please request a new one.')
//         return
//       }
      
//       // Verify the user has an active session
//       const { data } = await supabase.auth.getSession()
      
//       if (!data.session?.user) {
//         setError('Your password reset link has expired. Please request a new one.')
//         return
//       }
      
//       setValidRecovery(true)
//     }
    
//     checkSession()
//   }, [searchParams, supabase.auth])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       // Validate recovery state
//       if (!validRecovery) {
//         setError('Invalid password reset session')
//         return
//       }

//       // Validate password
//       if (newPassword.length < 6) {
//         setError('Password must be at least 6 characters')
//         return
//       }

//       // Check if passwords match
//       if (newPassword !== confirmPassword) {
//         setError('Passwords do not match')
//         return
//       }

//       // Update the user's password
//       const { error: updateError } = await supabase.auth.updateUser({ 
//         password: newPassword 
//       })
      
//       if (updateError) throw updateError
      
//       setSuccess(true)
//       // Redirect after 3 seconds
//       setTimeout(() => {
//         router.push('/dashboard')
//       }, 3000)
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Card>
//       <CardContent className="pt-6">
//         {success ? (
//           <div className="text-center p-4">
//             <h3 className="text-lg font-medium text-green-600 mb-2">Password Updated Successfully!</h3>
//             <p className="text-sm text-gray-500">Redirecting you to dashboard...</p>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}
            
//             <div className="space-y-2">
//               <Label htmlFor="new-password">New Password</Label>
//               <div className="relative">
//                 <Input 
//                   id="new-password"
//                   type={showPassword ? "text" : "password"} 
//                   value={newPassword} 
//                   onChange={e => setNewPassword(e.target.value)} 
//                   required
//                   placeholder="Enter new password"
//                   disabled={!validRecovery}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   <span className="sr-only">Toggle password visibility</span>
//                 </button>
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="confirm-password">Confirm Password</Label>
//               <div className="relative">
//                 <Input 
//                   id="confirm-password"
//                   type={showConfirmPassword ? "text" : "password"} 
//                   value={confirmPassword} 
//                   onChange={e => setConfirmPassword(e.target.value)} 
//                   required
//                   placeholder="Confirm new password"
//                   disabled={!validRecovery}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
//                 >
//                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   <span className="sr-only">Toggle confirm password visibility</span>
//                 </button>
//               </div>
//             </div>
            
//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={loading || !validRecovery}
//             >
//               {loading ? 'Updating...' : 'Reset Password'}
//             </Button>
//           </form>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
