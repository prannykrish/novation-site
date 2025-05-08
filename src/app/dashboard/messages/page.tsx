'use client'

import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { messageService, userService } from '@/lib/database'
import { Message, DatabaseUser, MessageAttachment } from '@/types/database'
import { getSupabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Send, User as UserIcon, Plus, ArrowLeft, Paperclip, X, FileIcon, Eye, ChevronsUpDown, Check } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { FilePreview } from '@/components/file-preview'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from "@/lib/supabase"; // adjust as needed

// Import Combobox components
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Define a proper type for the message payload
type RealtimeMessagePayload = {
  new: {
    id: string;
    sender_id: string;
    recipient_id: string;
    is_read: boolean;
    subject: string;
    content: string;
    created_at: string;
  };
  old: Record<string, any> | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
};

// Add types for the hook
function useRealtimeMessages(
  conversationId: string | null | undefined,
  setMessages: Dispatch<SetStateAction<Message[]>> // Use Message[] or your specific message type
) {
  useEffect(() => {
     if (!conversationId) return;

    const channel = supabase
      .channel('messages-hook-' + conversationId) 
      .on(
        'postgres_changes' as any, 
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}` // Adjust filter if needed
        },
        (payload: RealtimeMessagePayload) => { 
          if (payload.eventType === 'INSERT') {
            // Add type to prev
            setMessages((prev: Message[]) => { 
               const newMessage = mapPayloadToMessage(payload.new) as Message; 
               if (prev.some(msg => msg.id === newMessage.id)) return prev;
               return [...prev, newMessage]; 
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, setMessages]);
}

// Map function (can remain the same)
const mapPayloadToMessage = (row: RealtimeMessagePayload['new'] | RealtimeMessagePayload['old']): Partial<Message> | null => {
    // ... (keep existing mapping logic) ...
  if (!row) return null;
  return {
    id: row.id,
    subject: row.subject,
    content: row.content,
    senderId: row.sender_id,
    recipientId: row.recipient_id,
    createdAt: row.created_at,
    isRead: row.is_read,
  };
};

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<DatabaseUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)

  // For conversation view
  const [selectedConversationUser, setSelectedConversationUser] = useState<DatabaseUser | null>(null)
  const [conversationMessages, setConversationMessages] = useState<Message[]>([])
  const [replyContent, setReplyContent] = useState('')
  const [replyAttachments, setReplyAttachments] = useState<MessageAttachment[]>([])
  const [uploadingAttachment, setUploadingAttachment] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // For new message composition
  const [showNewMessageForm, setShowNewMessageForm] = useState(false)
  const [newMessage, setNewMessage] = useState({
    recipientId: '',
    subject: '',
    content: '',
    attachments: [] as MessageAttachment[]
  })
  const [recipientPopoverOpen, setRecipientPopoverOpen] = useState(false) // State for Combobox popover

  // Custom filter function for recipient Combobox
  const recipientFilter = (value: string, search: string): number => {
    const user = users.find(u => u.id === value);
    if (!user) return 0;

    const searchTerm = search.toLowerCase();
    const name = user.name || "";
    const email = user.email || "";

    if (name.toLowerCase().includes(searchTerm) ||
        email.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)) {
      return 1; // Show item
    }
    return 0; // Hide item
  };

  // Refs for file input elements and message container
  const replyFileInputRef = useRef<HTMLInputElement>(null)
  const newMessageFileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // Ref to hold the latest selected conversation user for the subscription callback
  const selectedConversationUserRef = useRef<DatabaseUser | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'inbox'

  // Attachment preview state
  const [previewFile, setPreviewFile] = useState<MessageAttachment | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Scroll to bottom of messages when conversation updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (conversationMessages.length > 0) {
      scrollToBottom()
    }
  }, [conversationMessages])

  // NEW: Effect to keep selectedConversationUserRef updated
  useEffect(() => {
    selectedConversationUserRef.current = selectedConversationUser;
    console.log('[Ref Update Effect] selectedConversationUserRef updated to:', selectedConversationUser?.id);
  }, [selectedConversationUser]);

  // Setup realtime subscription (Modified callback)
  const setupRealtimeSubscription = (userId: string) => {
    if (!userId) return () => {}; 

    console.log('[setupRealtimeSubscription] Setting up for userId:', userId);
    const supabase = getSupabase();

    const messagesChannel = supabase
      .channel('public:messages') 
      .on(
        'postgres_changes' as any, 
        {
          event: '*', 
          schema: 'public',
          table: 'messages'
        },
        (payload: RealtimeMessagePayload) => { 
          console.log('[Realtime] Received payload:', payload.eventType, payload.new?.id);
          
          const newMessageData = mapPayloadToMessage(payload.new);
          const oldMessageData = mapPayloadToMessage(payload.old);
          const relevantRecord = payload.eventType === 'DELETE' ? oldMessageData : newMessageData;

          const isRelevant = relevantRecord && userId &&
                             (relevantRecord.senderId === userId || relevantRecord.recipientId === userId);

          if (isRelevant) {
            console.log('[Realtime] Relevant message update detected.');

            // --- Direct State Update Logic --- 
            if (payload.eventType === 'INSERT' && newMessageData) {
              const fullNewMessage = newMessageData as Message;
              console.log('[Realtime INSERT] Adding message to states:', fullNewMessage.id);
              setMessages(prevMessages => {
                 // ... (update main messages list) ...
                if (prevMessages.some(msg => msg.id === fullNewMessage.id)) return prevMessages;
                return [...prevMessages, fullNewMessage].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
              });

              // --- Use REF here --- 
              const currentSelectedUser = selectedConversationUserRef.current; // Read from ref
              console.log('[Realtime INSERT] Checking against ref.current user:', currentSelectedUser?.id);
              if (currentSelectedUser && 
                  (fullNewMessage.senderId === currentSelectedUser.id || fullNewMessage.recipientId === currentSelectedUser.id)) {
                 console.log('[Realtime INSERT] Updating active conversationMessages state via ref check');
                 setConversationMessages(prevConvMessages => {
                   if (prevConvMessages.some(msg => msg.id === fullNewMessage.id)) return prevConvMessages;
                   return [...prevConvMessages, fullNewMessage].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                 });

                 // NEW: Mark as read if incoming from selected user and I am the recipient (userId is currentUser.id)
                 if (fullNewMessage.senderId === currentSelectedUser.id && fullNewMessage.recipientId === userId && !fullNewMessage.isRead) {
                    console.log('[Realtime INSERT] Active chat: Marking incoming message as read:', fullNewMessage.id);
                    messageService.markAsRead([fullNewMessage.id]).then(success => {
                        if (success) {
                            console.log('[Realtime INSERT] Active chat: Successfully marked as read on server. Updating local states.');
                            // Update messages in the main list
                            setMessages(prevMessages =>
                                prevMessages.map(msg =>
                                    msg.id === fullNewMessage.id ? { ...msg, isRead: true } : msg
                                )
                            );
                            // Update messages in the conversation list
                            setConversationMessages(prevConvMessages =>
                                prevConvMessages.map(msg =>
                                    msg.id === fullNewMessage.id ? { ...msg, isRead: true } : msg
                                )
                            );
                        } else {
                            console.warn('[Realtime INSERT] Active chat: Failed to mark message as read on server:', fullNewMessage.id);
                        }
                    }).catch(error => {
                        console.error('[Realtime INSERT] Active chat: Error marking message as read:', error);
                    });
                 }
              }
               // Play sound logic (use ref here too for consistency)
               if (fullNewMessage.recipientId === userId && 
                   (!currentSelectedUser || currentSelectedUser.id !== fullNewMessage.senderId)) {
                  // ... (play sound) ...
                 console.log('[Realtime] Playing notification sound.');
                 (async () => { 
                   try {
                     const audio = new Audio('/notification.mp3');
                     audio.volume = 0.5;
                     await audio.play().catch(e => console.log('Audio play prevented:', e));
                   } catch (e) {
                     console.error('Error playing notification sound:', e);
                   }
                 })();
               }
            } else if (payload.eventType === 'UPDATE' && newMessageData) {
                // --- Use REF here --- 
               const currentSelectedUser = selectedConversationUserRef.current; 
               console.log('[Realtime UPDATE] Checking against ref.current user:', currentSelectedUser?.id);
               setMessages(prevMessages => prevMessages.map(msg => 
                 msg.id === newMessageData.id ? { ...msg, ...newMessageData } : msg
               ));
               if (currentSelectedUser && 
                   (newMessageData.senderId === currentSelectedUser.id || newMessageData.recipientId === currentSelectedUser.id)) {
                 console.log('[Realtime UPDATE] Updating active conversationMessages state via ref check');
                 setConversationMessages(prevConvMessages => prevConvMessages.map(msg => 
                   msg.id === newMessageData.id ? { ...msg, ...newMessageData } : msg
                 ));
               }
            } else if (payload.eventType === 'DELETE' && oldMessageData) {
               // --- Use REF here --- 
               const currentSelectedUser = selectedConversationUserRef.current; 
               console.log('[Realtime DELETE] Checking against ref.current user:', currentSelectedUser?.id);
               setMessages(prevMessages => prevMessages.filter(msg => msg.id !== oldMessageData.id));
               if (currentSelectedUser && 
                   (oldMessageData.senderId === currentSelectedUser.id || oldMessageData.recipientId === currentSelectedUser.id)) {
                  console.log('[Realtime DELETE] Updating active conversationMessages state via ref check');
                  setConversationMessages(prevConvMessages => prevConvMessages.filter(msg => msg.id !== oldMessageData.id));
               }
            }
            // --- End Direct State Update Logic ---
          } else {
             console.log('[Realtime] Ignoring irrelevant message update for userId:', userId, 'Payload:', relevantRecord);
          }
        }
      )
      .subscribe(/* ... */);

    // Attachment subscription (keep as is)
    // ...

    return () => {
       // ... (cleanup remains the same) ...
    };
  };

  // Initial data fetching useEffect (Calls handleMessageUpdate, which no longer sets title directly)
  useEffect(() => {
     let cleanupSubscription = () => {};
     const initialize = async () => {
       // ... (existing init logic is mostly fine, calls handleMessageUpdate for initial messages) ...
       try {
         setLoading(true);
         const user = await userService.getCurrentUser();
         setCurrentUser(user);
         if (!user || !user.id) {
           console.error('No authenticated user or user ID found');
           setLoading(false);
           return;
         }
         console.log('[Initialize] Fetching initial messages...');
         await handleMessageUpdate(); // Fetches and sets `messages` state
         console.log('[Initialize] Fetching all users...');
         const allUsers = await userService.getAllUsers();
         setUsers(allUsers.filter(u => u.id !== user.id));

         const newParam = searchParams.get('new');
         const conversationUserId = searchParams.get('user');

         if (newParam === 'true') {
           console.log('[Initialize] Showing new message form.');
           setShowNewMessageForm(true);
         } else if (conversationUserId) {
           console.log('[Initialize] Looking for conversation user:', conversationUserId);
           const conversationUser = allUsers.find(u => u.id === conversationUserId);
           if (conversationUser) {
             console.log('[Initialize] Setting selected conversation user:', conversationUser);
             setSelectedConversationUser(conversationUser);
             // Need the latest messages here for loadConversation
             const initialMessages = await messageService.getMessagesWithAttachments(); 
             setMessages(initialMessages); // Ensure state is set before loadConversation uses it
             await loadConversation(conversationUser, initialMessages);
           }
         }
         console.log('[Initialize] Setting up realtime subscription...');
         cleanupSubscription = setupRealtimeSubscription(user.id);
       } catch (error) {
         console.error('Error initializing messages page:', error);
       } finally {
         console.log('[Initialize] Finished.');
         setLoading(false);
       }
     };
     initialize();
     return () => {
       console.log('[Initialize] Cleanup effect.');
       cleanupSubscription();
     };
   }, [searchParams]);

  // Centralized handler - NOW ONLY FOR INITIAL LOAD / MANUAL REFRESH
  const handleMessageUpdate = async (sentMessageId?: string) => {
     try {
       console.log('[handleMessageUpdate] Triggered');
       const updatedMessages = await messageService.getMessagesWithAttachments();
       console.log('[handleMessageUpdate] Fetched updated messages count:', updatedMessages.length);
       
       if (sentMessageId) {
         const justSentMessage = updatedMessages.find(m => m.id === sentMessageId);
         console.log('[handleMessageUpdate] Details of just sent message (ID:', sentMessageId, '):', JSON.stringify(justSentMessage));
         if (justSentMessage) {
            console.log('[handleMessageUpdate] Attachments for just sent message:', JSON.stringify(justSentMessage.attachments));
         } else {
           console.log('[handleMessageUpdate] Just sent message (ID:', sentMessageId, ') not found in updatedMessages list immediately.');
         }
       }

       setMessages([...updatedMessages]); 
       console.log('[handleMessageUpdate] setMessages called');

       // If a conversation is selected, update its messages directly from the fresh list
       if (selectedConversationUserRef.current && currentUser) { 
            console.log('[handleMessageUpdate] Active conversation detected with user:', selectedConversationUserRef.current.id, '. Re-filtering conversation messages.');
            const currentFreshMessages = [...updatedMessages]; 
            const otherUser = selectedConversationUserRef.current;
            const conversationMsgs = currentFreshMessages.filter(
              msg =>
                (msg.senderId === otherUser.id && msg.recipientId === currentUser.id) ||
                (msg.senderId === currentUser.id && msg.recipientId === otherUser.id)
            );
            const sortedMessages = [...conversationMsgs].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            setConversationMessages(sortedMessages); 
            console.log(`[handleMessageUpdate] Updated conversationMessages for user ${otherUser.id}. Count: ${sortedMessages.length}. First new: ${sortedMessages[sortedMessages.length -1]?.id}`);
       }

     } catch (error) {
       console.error('Error in handleMessageUpdate:', error);
     }
     // Removed title update from here
  };

  // Mark conversation messages as read (ONLY called by loadConversation)
  const markConversationMessagesAsRead = async (conversationMsgs: Message[], otherUserId: string) => {
    // ... (Keep the existing refined logic from previous step, including state updates)
    if (!currentUser || !otherUserId) return; 
    console.log('[markConversationMessagesAsRead] Checking messages for other user:', otherUserId);
    const unreadMessages = conversationMsgs.filter(
      msg => !msg.isRead && msg.senderId === otherUserId && msg.recipientId === currentUser.id
    );
    console.log('[markConversationMessagesAsRead] Found unread messages count:', unreadMessages.length);

    if (unreadMessages.length > 0) {
      try {
        const messageIds = unreadMessages.map(msg => msg.id);
        console.log('[markConversationMessagesAsRead] Calling service to mark as read:', messageIds);
        const success = await messageService.markAsRead(messageIds);
        if (success) {
          console.log('[markConversationMessagesAsRead] Service call successful. Updating local state.');
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              messageIds.includes(msg.id)
                ? { ...msg, isRead: true }
                : msg
            )
          );
          setConversationMessages(prevConvMessages =>
            prevConvMessages.map(msg =>
              messageIds.includes(msg.id)
                ? { ...msg, isRead: true }
                : msg
            )
          );
          console.log('[markConversationMessagesAsRead] Local state updated.');
          // Title update will be handled by the dedicated useEffect watching `messages`
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  // Load conversation messages (calls markConversationMessagesAsRead)
  const loadConversation = async (otherUser: DatabaseUser, currentMessages: Message[]) => {
    // ... (Keep existing refined logic)
     if (!currentUser) return;
    console.log(`[loadConversation] Loading conversation with ${otherUser.id}`);
    const conversationMsgs = currentMessages.filter(
      msg =>
        (msg.senderId === otherUser.id && msg.recipientId === currentUser.id) ||
        (msg.senderId === currentUser.id && msg.recipientId === otherUser.id)
    );
    console.log(`[loadConversation] Found ${conversationMsgs.length} messages for conversation.`);
    const sortedMessages = [...conversationMsgs].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    setConversationMessages(sortedMessages);
    console.log(`[loadConversation] Set conversation messages state.`);
    await markConversationMessagesAsRead(conversationMsgs, otherUser.id);
  }

  // Handle file selection for reply attachments
  const handleReplyFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    await uploadFile(file, true)
  }

  // Handle file selection for new message attachments
  const handleNewMessageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    await uploadFile(file, false)
  }

  // Handle file upload - common for both new messages and replies
  const uploadFile = async (file: File, isReply: boolean) => {
    try {
      setUploadingAttachment(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prevProgress => {
          const newProgress = prevProgress + 10
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 100)

      // Upload the file
      const fileData = await messageService.uploadAttachment(file)

      // Clear the progress interval and set to 100%
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Add the file to the appropriate attachments array
      if (isReply) {
        setReplyAttachments(prev => [...prev, fileData])
      } else {
        setNewMessage(prev => ({
          ...prev,
          attachments: [...prev.attachments, fileData]
        }))
      }

      // Reset file input
      if (isReply && replyFileInputRef.current) {
        replyFileInputRef.current.value = ''
      } else if (!isReply && newMessageFileInputRef.current) {
        newMessageFileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setTimeout(() => {
        setUploadingAttachment(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  // Remove attachment from reply
  const removeReplyAttachment = (index: number) => {
    setReplyAttachments(prev => prev.filter((_, i) => i !== index))
  }

  // Remove attachment from new message
  const removeNewMessageAttachment = (index: number) => {
    setNewMessage(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  // Handle sending a reply in conversation view
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser || !selectedConversationUser || !replyContent.trim()) return

    setSendingMessage(true)
    try {
      // Most recent message will be at the end of the conversation
      const lastMessage = conversationMessages[conversationMessages.length - 1]

      // Use the last message's subject or create a "Re:" subject
      const subject = lastMessage
        ? (lastMessage.subject.startsWith('Re:') ? lastMessage.subject : `Re: ${lastMessage.subject}`)
        : 'Re: Conversation'

      // Send the reply with any attachments
      // IMPORTANT: Assuming messageService.sendMessage returns the sent message object or { id: string }
      const sentMessage = await messageService.sendMessage({
        recipientId: selectedConversationUser.id,
        subject,
        content: replyContent,
        attachments: replyAttachments
      })

      // Clear the reply field and attachments
      setReplyContent('')
      setReplyAttachments([])

      // Use the handleMessageUpdate function to refresh all messages and conversation
      // Pass the ID of the sent message for targeted logging and potential immediate update
      if (sentMessage && typeof sentMessage === 'object' && 'id' in sentMessage && typeof sentMessage.id === 'string') {
        await handleMessageUpdate(sentMessage.id);
      } else {
        console.warn('[handleSendReply] sentMessage.id not available from messageService.sendMessage. Calling handleMessageUpdate without ID.');
        await handleMessageUpdate();
      }

    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  // Handle sending a new message
  const handleSendNewMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser || !newMessage.recipientId || !newMessage.subject || !newMessage.content.trim()) {
      alert('Please fill out all fields')
      return
    }

    setSendingMessage(true)
    try {
      // Send the message with attachments
      // IMPORTANT: Assuming messageService.sendMessage returns the sent message object or { id: string }
      const sentMessage = await messageService.sendMessage({
        recipientId: newMessage.recipientId,
        subject: newMessage.subject,
        content: newMessage.content,
        attachments: newMessage.attachments
      })

      // Reset form
      setNewMessage({
        recipientId: '',
        subject: '',
        content: '',
        attachments: []
      })

      // Return to inbox view
      setShowNewMessageForm(false)

      // Also refresh all messages
      // Pass the ID of the sent message for targeted logging and potential immediate update
      if (sentMessage && typeof sentMessage === 'object' && 'id' in sentMessage && typeof sentMessage.id === 'string') {
        await handleMessageUpdate(sentMessage.id);
      } else {
        console.warn('[handleSendNewMessage] sentMessage.id not available from messageService.sendMessage. Calling handleMessageUpdate without ID.');
        await handleMessageUpdate();
      }
      
      alert('Message sent successfully')

    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  // Group messages by conversation (sender/recipient)
  const getConversations = (): { user: DatabaseUser, lastMessage: Message, unreadCount: number }[] => {
    const conversations: Record<string, { user: DatabaseUser, lastMessage: Message, unreadCount: number }> = {}

    if (!currentUser) return []

    // Group messages by the other person in the conversation
    messages.forEach(message => {
      const otherUserId = message.senderId === currentUser.id
        ? message.recipientId
        : message.senderId

      const otherUser = users.find(u => u.id === otherUserId)
      if (!otherUser) return

      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user: otherUser,
          lastMessage: message,
          unreadCount: message.senderId === otherUserId && !message.isRead ? 1 : 0
        }
      } else {
        // If this message is more recent, update last message
        if (new Date(message.createdAt) > new Date(conversations[otherUserId].lastMessage.createdAt)) {
          conversations[otherUserId].lastMessage = message
        }

        // Increment unread count if from other user and not read
        if (message.senderId === otherUserId && !message.isRead) {
          conversations[otherUserId].unreadCount++
        }
      }
    })

    return Object.values(conversations).sort((a, b) =>
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )
  }

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Format message date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return format(date, 'h:mm a')
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      // Within the last week
      return format(date, 'EEE')
    } else {
      return format(date, 'MMM d')
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-lg">Loading messages...</p>
        </div>
      </div>
    )
  }

  // Render new message form
  if (showNewMessageForm) {
    return (
      <div className="flex h-full flex-col p-6">
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => setShowNewMessageForm(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">New Message</h2>
        </div>

        <Card className="flex-1 p-6">
          <form onSubmit={handleSendNewMessage} className="flex flex-col h-full">
            <div className="mb-4">
              <Label htmlFor="recipient">Recipient</Label>
              <Popover open={recipientPopoverOpen} onOpenChange={setRecipientPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={recipientPopoverOpen}
                    className="w-full justify-between"
                  >
                    {newMessage.recipientId
                      ? (users.find(user => user.id === newMessage.recipientId)?.name || users.find(user => user.id === newMessage.recipientId)?.email)
                      : "Select a recipient..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command filter={recipientFilter}>
                    <CommandInput placeholder="Search by name, email, or ID..." />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {users.map(user => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={(currentValue) => {
                            setNewMessage({ ...newMessage, recipientId: currentValue === newMessage.recipientId ? "" : currentValue })
                            setRecipientPopoverOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              newMessage.recipientId === user.id ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {user.name ? `${user.name} (${user.email})` : user.email}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="mb-4">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                placeholder="Enter subject"
              />
            </div>

            <div className="mb-4 flex-1">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                className="min-h-[200px] h-full resize-none"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                placeholder="Type your message here..."
              />
            </div>

            {/* Attachment section */}
            <div className="mb-4">
              <Label className="mb-2 block">Attachments</Label>

              {/* Display selected attachments */}
              {newMessage.attachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  {newMessage.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-accent/30 p-2 rounded-md">
                      <div className="flex items-center">
                        <FileIcon className="h-6 w-6 mr-2" />
                        <div>
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(file.size && file.size > 1024 * 1024)
                              ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                              : `${(file.size || 0 / 1024).toFixed(2)} KB`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setPreviewFile(file);
                            setPreviewOpen(true);
                          }}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeNewMessageAttachment(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* File upload button */}
              <div className="flex items-center">
                <input
                  ref={newMessageFileInputRef}
                  type="file"
                  onChange={handleNewMessageFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => newMessageFileInputRef.current?.click()}
                  disabled={uploadingAttachment}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </Button>

                {/* Upload progress indicator */}
                {uploadingAttachment && (
                  <div className="ml-4 flex-1">
                    <Progress value={uploadProgress} className="h-2 w-full" />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={sendingMessage} className="self-end">
              {sendingMessage ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Card>
        {previewOpen && previewFile && (
          <FilePreview file={previewFile} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
        )}
      </div>
    )
  }

  // Render conversation view
  if (selectedConversationUser) {
    return (
      <div className="flex h-full flex-col p-6">
        {/* Fixed header with back button and user info */}
        <div className="sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => setSelectedConversationUser(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="" />
                <AvatarFallback>
                  {getUserInitials(selectedConversationUser.name || selectedConversationUser.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedConversationUser.name || selectedConversationUser.email}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Message content area with ScrollArea applied only to messages, not header */}
        <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
          <ScrollArea className="flex-1 h-full p-6">
            <div className="space-y-4">
              {conversationMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                conversationMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-lg p-4 max-w-[80%] ${
                        msg.senderId === currentUser?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      <div className="mb-1 text-xs opacity-90">
                        {format(new Date(msg.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Show attachments if any */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-primary/20">
                          <div className="text-xs mb-1">Attachments:</div>
                          <div className="space-y-2">
                            {msg.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center rounded bg-black/10 p-2 hover:bg-black/20 transition-colors"
                                >
                                  <FileIcon className="h-6 w-6 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium">{attachment.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {(attachment.size && attachment.size > 1024 * 1024)
                                        ? `${(attachment.size / (1024 * 1024)).toFixed(2)} MB`
                                        : `${((attachment.size || 0) / 1024).toFixed(2)} KB`}
                                    </div>
                                  </div>
                                </a>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setPreviewFile(attachment);
                                    setPreviewOpen(true);
                                  }}
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Show read status for sender's messages */}
                      {msg.senderId === currentUser?.id && (
                        <div className="mt-1 flex justify-end">
                          {msg.isRead ? (
                            <div className="flex items-center text-xs opacity-90">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Read
                            </div>
                          ) : (
                            <div className="text-xs opacity-90">Sent</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {/* This div is used as a reference to scroll to the bottom of messages */}
              <div ref={messagesEndRef}></div>
            </div>
          </ScrollArea>
        </Card>

        <div className="sticky bottom-0 bg-background pt-2 pb-2 border-t z-10">
          {/* Show attachment preview */}
          {replyAttachments.length > 0 && (
            <div className="bg-background p-2 rounded-t-lg border border-b-0 space-y-2">
              <div className="text-xs font-medium">Attachments:</div>
              <div className="flex flex-wrap gap-2">
                {replyAttachments.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="flex items-center bg-accent/30 p-2 rounded-md">
                      <FileIcon className="h-6 w-6 mr-2" />
                      <div>
                        <div className="text-sm font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(file.size && file.size > 1024 * 1024)
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                            : `${((file.size || 0) / 1024).toFixed(2)} KB`}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setPreviewFile(file);
                        setPreviewOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeReplyAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendReply} className="flex items-end gap-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              className="min-h-12 resize-none"
            />

            {/* File attachment button */}
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => replyFileInputRef.current?.click()}
              disabled={uploadingAttachment}
            >
              <input
                ref={replyFileInputRef}
                type="file"
                onChange={handleReplyFileChange}
                className="hidden"
              />
              <Paperclip className="h-5 w-5" />
            </Button>

            <Button type="submit" size="icon" disabled={sendingMessage || !replyContent.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
        {previewOpen && previewFile && (
          <FilePreview file={previewFile} isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
        )}
      </div>
    )
  }

  // Render inbox (default view)
  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button onClick={() => setShowNewMessageForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Card className="flex-1 flex flex-col min-h-0">
        {getConversations().length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <Send className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No messages yet</h3>
            <p className="mb-4 text-center text-muted-foreground">
              Start a conversation with another user
            </p>
            <Button onClick={() => setShowNewMessageForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 h-full">
            <div className="divide-y">
              {getConversations().map(conversation => (
                <div
                  key={conversation.user.id}
                  className={`flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-accent/50 ${
                    conversation.unreadCount > 0 ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => {
                    setSelectedConversationUser(conversation.user);
                    // Explicitly call loadConversation to ensure past messages are loaded
                    loadConversation(conversation.user, messages);
                  }}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {getUserInitials(conversation.user.name || conversation.user.email)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        {conversation.user.name || conversation.user.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatMessageDate(conversation.lastMessage.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="mt-1 truncate text-sm text-muted-foreground">
                        <span className={conversation.unreadCount > 0 ? 'font-semibold text-foreground' : ''}>
                          {conversation.lastMessage.subject}
                        </span>
                        {' - '}
                        {conversation.lastMessage.content.length > 30
                          ? conversation.lastMessage.content.substring(0, 30) + '...'
                          : conversation.lastMessage.content}

                        {/* Show attachment indicator */}
                        {conversation.lastMessage.attachments && conversation.lastMessage.attachments.length > 0 && (
                          <span className="ml-2 inline-flex items-center">
                            <Paperclip className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {conversation.lastMessage.attachments.length}
                            </span>
                          </span>
                        )}
                      </div>

                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  )
}
