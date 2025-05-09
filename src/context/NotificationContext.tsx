'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { messageService } from '@/lib/database'
import { messageEvents, MESSAGE_EVENTS } from '@/lib/events'

// Define the context type
type NotificationContextType = {
  unreadCount: number
  refreshUnreadCount: () => Promise<void>
  markMessageAsRead: (messageId: string | string[]) => Promise<boolean>
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshUnreadCount: async () => {},
  markMessageAsRead: async () => false
})

// Create a provider component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)

  // Function to refresh unread count from database
  const refreshUnreadCount = async () => {
    try {
      console.log('[NotificationContext] Refreshing unread count from DB')
      const count = await messageService.getUnreadMessagesCount()
      console.log('[NotificationContext] DB returned count:', count)
      setUnreadCount(count)
    } catch (error) {
      console.error('[NotificationContext] Error refreshing unread count:', error)
    }
  }

  // Function to mark messages as read
  const markMessageAsRead = async (messageId: string | string[]) => {
    try {
      console.log('[NotificationContext] Marking message(s) as read:', messageId)
      const success = await messageService.markAsRead(messageId)
      
      if (success) {
        console.log('[NotificationContext] Successfully marked as read, refreshing count')
        // Immediately decrement the unread count for better UX
        if (Array.isArray(messageId)) {
          setUnreadCount(prevCount => Math.max(0, prevCount - messageId.length))
        } else {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1))
        }
        
        // Then refresh from DB to ensure accuracy
        setTimeout(refreshUnreadCount, 300)
      }
      
      return success
    } catch (error) {
      console.error('[NotificationContext] Error marking as read:', error)
      return false
    }
  }

  // Effect to listen for message events
  useEffect(() => {
    console.log('[NotificationContext] Setting up message event listeners')
    
    // Listen for unread count changes (from our events system)
    const handleUnreadCountChanged = (count: number) => {
      console.log('[NotificationContext] Received UNREAD_COUNT_CHANGED event with count:', count)
      setUnreadCount(count)
    }
    
    // Listen for message read events
    const handleMessageRead = () => {
      console.log('[NotificationContext] Message read event received, refreshing count')
      refreshUnreadCount()
    }
    
    // Listen for new message events
    const handleNewMessage = () => {
      console.log('[NotificationContext] New message event received, refreshing count')
      refreshUnreadCount()
    }
    
    // Set up listeners
    messageEvents.on(MESSAGE_EVENTS.UNREAD_COUNT_CHANGED, handleUnreadCountChanged)
    messageEvents.on(MESSAGE_EVENTS.MESSAGE_READ, handleMessageRead)
    messageEvents.on(MESSAGE_EVENTS.NEW_MESSAGE, handleNewMessage)
    
    // Initial fetch
    refreshUnreadCount()

    // Setup interval to periodically refresh the count
    const intervalId = setInterval(() => {
      console.log('[NotificationContext] Periodic refresh triggered')
      refreshUnreadCount()
    }, 30000) // Refresh every 30 seconds
    
    // Setup window focus event
    const handleFocus = () => {
      console.log('[NotificationContext] Window focused, refreshing count')
      refreshUnreadCount()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Clean up on unmount
    return () => {
      messageEvents.off(MESSAGE_EVENTS.UNREAD_COUNT_CHANGED, handleUnreadCountChanged)
      messageEvents.off(MESSAGE_EVENTS.MESSAGE_READ, handleMessageRead)
      messageEvents.off(MESSAGE_EVENTS.NEW_MESSAGE, handleNewMessage)
      clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  // Provide the context value
  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount, markMessageAsRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

// Create a hook for using the context
export function useNotifications() {
  return useContext(NotificationContext)
} 