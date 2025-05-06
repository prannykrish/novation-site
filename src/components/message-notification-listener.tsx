'use client'

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { messageService } from '@/lib/database'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { RealtimeChannel } from '@supabase/supabase-js'

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
  
  // Track if we're currently on the messages page
  const isOnMessagesPage = pathname?.startsWith('/dashboard/messages')
  
  useEffect(() => {
    // Reset document title when not viewing messages
    if (!isOnMessagesPage) {
      document.title = 'Shadcnmaxxing'
    }
  }, [isOnMessagesPage])
  
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
        
        // Create channel for real-time message notifications
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
              const messageId = payload.new.id
              
              try {
                // Get current URL parameters to check if we're already viewing this conversation
                const url = new URL(window.location.href)
                const conversationUserId = url.searchParams.get('user')
                
                // Skip notifications if we're already in the conversation with this sender
                if (isOnMessagesPage && conversationUserId === senderId) {
                  // Auto-mark as read since we're in the conversation
                  await messageService.markAsRead(messageId)
                  return
                }
                
                // Play notification sound
                const audio = new Audio('/notification.mp3')
                audio.volume = 0.5
                await audio.play().catch(e => {
                  console.log('Audio play prevented by browser policy', e)
                })
                
                // Get unread count
                const unreadCount = await messageService.getUnreadMessagesCount()
                
                // Update the document title to show unread count
                if (unreadCount > 0) {
                  document.title = `(${unreadCount}) Messages | Shadcnmaxxing`
                }
                
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
                  onDismiss: () => {
                    // Optional: mark as read when toast is dismissed
                  }
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
          
        // Listen for messages being marked as read
        const readChannel: RealtimeChannel = supabase
          .channel('read-status-updates')
          .on(
            'postgres_changes' as any,
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'messages',
              filter: `recipient_id=eq.${userId} AND is_read=eq.true`
            },
            async () => {
              // Update the unread count in the document title
              try {
                const unreadCount = await messageService.getUnreadMessagesCount()
                if (unreadCount > 0) {
                  document.title = `(${unreadCount}) Messages | Shadcnmaxxing`
                } else {
                  document.title = 'Shadcnmaxxing'
                }
              } catch (error) {
                console.error('Error updating unread count:', error)
              }
            }
          )
          .subscribe()
          
        console.log('Global message notification listener setup complete')
        
        // Request notification permission on component mount
        if ('Notification' in window && Notification.permission !== 'denied') {
          Notification.requestPermission()
        }
          
        // Clean up on unmount
        return () => {
          supabase.removeChannel(channel)
          supabase.removeChannel(readChannel)
        }
      } catch (error) {
        console.error('Error setting up message notification listener:', error)
      }
    }
    
    setupListener()
  }, [router, isOnMessagesPage])
  
  // Check for unread messages on initial load
  useEffect(() => {
    if (!currentUserId) return
    
    const checkUnreadMessages = async () => {
      try {
        const unreadCount = await messageService.getUnreadMessagesCount()
        if (unreadCount > 0 && !isOnMessagesPage) {
          document.title = `(${unreadCount}) Messages | Shadcnmaxxing`
        }
      } catch (error) {
        console.error('Error checking unread messages:', error)
      }
    }
    
    checkUnreadMessages()
  }, [currentUserId, isOnMessagesPage])
  
  // This is a headless component that doesn't render anything
  return null
}