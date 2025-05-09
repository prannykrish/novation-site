'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { messageService } from '@/lib/database'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useNotifications } from '@/context/NotificationContext'

// Define proper message payload type
type RealtimeMessagePayload = {
  new: {
    id: string;
    sender_id: string;
    recipient_id: string;
    is_read: boolean;
    subject: string;
    content: string;
  };
  old: Record<string, any> | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
}

export function MessageNotificationListener() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // Get notification context
  const { refreshUnreadCount } = useNotifications()
  
  // Track if we're currently on the messages page
  const isOnMessagesPage = pathname?.startsWith('/dashboard/messages')
  
  useEffect(() => {
    // Get current user ID and set up notification listeners
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
        setCurrentUserId(userId)
        
        // Create channel for real-time message notifications (only for INSERT)
        const channel: RealtimeChannel = supabase
          .channel('global-message-notifications')
          .on(
            'postgres_changes' as any,
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `recipient_id=eq.${userId}`
            },
            async (payload: RealtimeMessagePayload) => {
              const senderId = payload.new.sender_id
              
              try {
                // Get current URL parameters to check if we're already viewing this conversation
                const url = new URL(window.location.href)
                const conversationUserId = url.searchParams.get('user')
                
                // Skip notifications if we're already in the conversation with this sender
                if (isOnMessagesPage && conversationUserId === senderId) {
                  return
                }
                
                // Play notification sound
                const audio = new Audio('/notification.mp3')
                audio.volume = 0.5
                await audio.play().catch(e => {
                  console.log('Audio play prevented by browser policy', e)
                })
                
                // Refresh unread count via NotificationContext
                refreshUnreadCount()
                
                // Get sender information for a better notification
                let senderName = 'Someone'
                try {
                  // Try to fetch the user details for a better notification message
                  const { data } = await supabase
                    .from('users')
                    .select('name, email')
                    .eq('id', senderId)
                    .single()
                    
                  if (data) {
                    senderName = data.name || data.email || 'Someone'
                  }
                } catch (userError) {
                  console.log('Error getting user details for notification:', userError)
                }
                
                // Show toast notification
                toast.success(`New message from ${senderName}`, {
                  description: payload.new.subject || 'Click to view the message',
                  action: {
                    label: 'View',
                    onClick: () => router.push(`/dashboard/messages?user=${senderId}`)
                  },
                  duration: 8000, // Show for longer
                })
                
                // Show browser notification if permitted
                if (Notification.permission === 'granted' && document.visibilityState !== 'visible') {
                  const notification = new Notification(`New Message from ${senderName}`, {
                    body: payload.new.subject || 'You have received a new message',
                    icon: '/images/logo.png'
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
          .subscribe(status => {
            if (status !== 'SUBSCRIBED') {
              console.error('Failed to subscribe to message notifications:', status)
            } else {
              console.log('Successfully subscribed to message notifications')
            }
          })
          
        console.log('Message notification listener setup complete')
        
        // Request notification permission on component mount
        if ('Notification' in window && Notification.permission !== 'denied') {
          Notification.requestPermission()
        }
          
        // Clean up on unmount
        return () => {
          supabase.removeChannel(channel)
        }
      } catch (error) {
        console.error('Error setting up message notification listener:', error)
      }
    }
    
    setupListener()
  }, [router, isOnMessagesPage, pathname, refreshUnreadCount])
  
  // This is a headless component that doesn't render anything
  return null
}