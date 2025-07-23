// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { toast } from 'sonner'
// import { useNotifications } from '@/context/NotificationContext'

// // This component used to handle real-time notifications using Supabase
// // but now it is stubbed/disabled for migration

// export function MessageNotificationListener() {
//   const router = useRouter()
//   const pathname = usePathname()
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null)

//   const { refreshUnreadCount } = useNotifications()

//   const isOnMessagesPage = pathname?.startsWith('/dashboard/messages')

//   useEffect(() => {
//     // TODO: Replace this logic with your new real-time system
//     console.warn('Supabase has been removed. MessageNotificationListener is inactive.')

//     // Cleanup logic if needed
//     return () => {}
//   }, [router, isOnMessagesPage, pathname, refreshUnreadCount])

//   return null
// }
