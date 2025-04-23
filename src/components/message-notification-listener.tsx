"use client";

import { useEffect, useRef, useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { messageService } from '@/lib/database';

export function MessageNotificationListener() {
  const [previousCount, setPreviousCount] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const initialLoadRef = useRef<boolean>(true);
  
  // Listen for real-time message changes using Supabase subscription
  useEffect(() => {
    // Initialize previous unread count
    const initializeCount = async () => {
      try {
        const count = await messageService.getUnreadMessagesCount();
        setPreviousCount(count);
        initialLoadRef.current = false;
      } catch (error) {
        console.error('Error initializing message count:', error);
      }
    };

    initializeCount();
    
    // Set up Supabase subscription for new messages
    const supabase = getSupabase();
    
    // Subscribe to the messages table for inserts
    const subscription = supabase
      .channel('message-notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, 
        async (payload) => {
          // Check if the message is for the current user
          try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) return;
            
            // If this message is for the current user
            if (payload.new && payload.new.recipient_id === user.id) {
              // Get the new count of unread messages
              const newCount = await messageService.getUnreadMessagesCount();
              
              // If there are more unread messages than before, play the sound
              if (newCount > previousCount && !initialLoadRef.current) {
                // Play notification sound
                if (audioRef.current) {
                  audioRef.current.play().catch(error => 
                    console.error("Error playing notification sound:", error)
                  );
                }
              }
              
              // Update the previous count
              setPreviousCount(newCount);
            }
          } catch (error) {
            console.error('Error in message notification handler:', error);
          }
        }
      )
      .subscribe();
    
    // Cleanup function to remove subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [previousCount]);
  
  return (
    <audio
      ref={audioRef}
      src="/notification.mp3"
      preload="auto"
      style={{ display: 'none' }}
    />
  );
}