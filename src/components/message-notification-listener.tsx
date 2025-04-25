'use client'

import { useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'
import { messageService } from '@/lib/database'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function MessageNotificationListener() {
  const router = useRouter()
  
  useEffect(() => {
    // Get current user ID
    const setupListener = async () => {
      const supabase = getSupabase()
      
      try {
        // Get user session
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          console.log('No active session for notifications')
          return
        }
        
        const userId = session.user.id
        
        // Create channel for real-time message notifications
        const channel = supabase
          .channel('message-notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `recipient_id=eq.${userId}`
            },
            async (payload) => {
              // Get the message sender info
              const { from: userIds } = payload.new || {}
              const senderId = payload.new.sender_id
              
              try {
                // Play notification sound
                const audio = new Audio('/notification.mp3')
                await audio.play().catch(e => {
                  console.log('Audio play prevented by browser policy', e)
                })
                
                // Get unread count
                const unreadCount = await messageService.getUnreadMessagesCount()
                
                // Show toast notification
                toast.success('New message received', {
                  description: 'Click to view in messages',
                  action: {
                    label: 'View',
                    onClick: () => router.push(`/dashboard/messages?user=${senderId}`)
                  },
                  duration: 5000
                })
                
                // Update the document title to show unread count
                if (unreadCount > 0) {
                  document.title = `(${unreadCount}) Shadcnmaxxing`
                }
                
                // Request permission for browser notifications if needed
                if (Notification.permission === 'granted') {
                  const notification = new Notification('New Message', {
                    body: 'You have received a new message',
                    icon: '/logo.png'
                  })
                  
                  notification.onclick = () => {
                    window.focus()
                    router.push(`/dashboard/messages?user=${senderId}`)
                  }
                } else if (Notification.permission !== 'denied') {
                  Notification.requestPermission()
                }
              } catch (error) {
                console.error('Error handling message notification:', error)
              }
            }
          )
          .subscribe()
          
        console.log('Message notification listener setup complete')
          
        // Clean up on unmount
        return () => {
          supabase.removeChannel(channel)
        }
      } catch (error) {
        console.error('Error setting up message notification listener:', error)
      }
    }
    
    setupListener()
  }, [router])
  
  // This is a headless component that doesn't render anything
  return null
}