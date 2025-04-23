'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { messageService, userService } from '@/lib/database'
import { Message, DatabaseUser, MessageAttachment } from '@/types/database'
import { getSupabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Send, User as UserIcon, Plus, ArrowLeft, Paperclip, X, FileIcon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

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

  // Refs for file input elements
  const replyFileInputRef = useRef<HTMLInputElement>(null)
  const newMessageFileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'inbox'

  // Initial data fetching
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true)

        // Get current user
        const user = await userService.getCurrentUser()
        setCurrentUser(user)

        if (!user) {
          console.error('No authenticated user')
          return
        }

        // Get all messages
        const userMessages = await messageService.getUserMessages()
        setMessages(userMessages)

        // Get all users
        const allUsers = await userService.getAllUsers()
        setUsers(allUsers.filter(u => u.id !== user.id))

        // Check for 'new' query parameter
        if (searchParams.get('new') === 'true') {
          setShowNewMessageForm(true)
        }

        // Check for conversation parameter
        const conversationUserId = searchParams.get('user')
        if (conversationUserId) {
          const conversationUser = allUsers.find(u => u.id === conversationUserId)
          if (conversationUser) {
            setSelectedConversationUser(conversationUser)
            // Load conversation messages
            await loadConversation(conversationUser)
          }
        }

        // Set up realtime subscription only after we have the user ID
        setupRealtimeSubscription(user.id)
      } catch (error) {
        console.error('Error initializing messages page:', error)
      } finally {
        setLoading(false)
      }
    }

    initialize()

    return () => {
      // Cleanup is handled in setupRealtimeSubscription
    }
  }, [searchParams])

  // Setup realtime subscription as a separate function for better organization
  const setupRealtimeSubscription = (userId: string) => {
    const supabase = getSupabase()

    // Create a channel for received messages
    const receivedMessagesChannel = supabase
      .channel('messages-received')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`
        },
        async (payload) => {
          console.log('Realtime message received:', payload)
          handleMessageUpdate()

          // Play notification sound for new messages
          if (payload.eventType === 'INSERT') {
            const audio = new Audio('/notification.mp3')
            audio.play().catch(e => console.log('Audio play prevented:', e))
          }
        }
      )
      .subscribe()

    // Create a channel for sent messages
    const sentMessagesChannel = supabase
      .channel('messages-sent')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId}`
        },
        async () => {
          handleMessageUpdate()
        }
      )
      .subscribe()

    return () => {
      // Clean up subscriptions
      supabase.removeChannel(receivedMessagesChannel)
      supabase.removeChannel(sentMessagesChannel)
    }
  }

  // Centralized handler for message updates to avoid duplicate code
  const handleMessageUpdate = async () => {
    // Refresh messages
    const updatedMessages = await messageService.getUserMessages()
    setMessages(updatedMessages)

    // If in conversation view, also update conversation messages
    if (selectedConversationUser && currentUser) {
      // Re-filter messages rather than making another API call
      const conversationMsgs = updatedMessages.filter(
        msg =>
          (msg.senderId === selectedConversationUser.id && msg.recipientId === currentUser.id) ||
          (msg.senderId === currentUser.id && msg.recipientId === selectedConversationUser.id)
      )

      // Sort by creation date
      const sortedMessages = [...conversationMsgs].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )

      setConversationMessages(sortedMessages)

      // Mark received messages as read automatically in conversation view
      const unreadMessages = conversationMsgs.filter(
        msg => !msg.isRead && msg.senderId === selectedConversationUser.id
      )

      if (unreadMessages.length > 0) {
        try {
          for (const msg of unreadMessages) {
            await messageService.markAsRead(msg.id)
          }
          // Update local message state to reflect read status
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              unreadMessages.some(unread => unread.id === msg.id)
                ? { ...msg, isRead: true }
                : msg
            )
          )
        } catch (error) {
          console.error('Error marking messages as read:', error)
        }
      }
    }
  }

  // Load conversation messages between current user and selected user
  const loadConversation = async (otherUser: DatabaseUser) => {
    if (!currentUser) return

    // Get messages exchanged between the two users
    const conversationMsgs = messages.filter(
      msg =>
        (msg.senderId === otherUser.id && msg.recipientId === currentUser.id) ||
        (msg.senderId === currentUser.id && msg.recipientId === otherUser.id)
    )

    // Sort by creation date
    const sortedMessages = [...conversationMsgs].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    setConversationMessages(sortedMessages)

    // Mark all unread messages from this user as read
    const unreadMessages = conversationMsgs.filter(
      msg => !msg.isRead && msg.senderId === otherUser.id
    )

    if (unreadMessages.length > 0) {
      try {
        for (const msg of unreadMessages) {
          await messageService.markAsRead(msg.id)
        }
        // Update local message state to reflect read status
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            unreadMessages.some(unread => unread.id === msg.id)
              ? { ...msg, isRead: true }
              : msg
          )
        )
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    }
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
      await messageService.sendMessage({
        recipientId: selectedConversationUser.id,
        subject,
        content: replyContent,
        attachments: replyAttachments
      })

      // Clear the reply field and attachments
      setReplyContent('')
      setReplyAttachments([])

      // Refresh conversation
      await loadConversation(selectedConversationUser)

      // Also refresh all messages
      const updatedMessages = await messageService.getUserMessages()
      setMessages(updatedMessages)

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
      await messageService.sendMessage({
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
      const updatedMessages = await messageService.getUserMessages()
      setMessages(updatedMessages)

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
              <Select
                value={newMessage.recipientId}
                onValueChange={(value) => setNewMessage({ ...newMessage, recipientId: value })}
              >
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Select a recipient" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeNewMessageAttachment(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
      </div>
    )
  }

  // Render conversation view
  if (selectedConversationUser) {
    return (
      <div className="flex h-full flex-col p-6">
        <div className="mb-6 flex items-center">
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

        <Card className="flex-1 flex flex-col p-6 mb-4">
          <ScrollArea className="flex-1 pr-4">
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
                              <a
                                key={index}
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
            </div>
          </ScrollArea>
        </Card>

        <div className="sticky bottom-0">
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

      <Card className="flex-1">
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
          <ScrollArea className="h-full">
            <div className="divide-y">
              {getConversations().map(conversation => (
                <div
                  key={conversation.user.id}
                  className={`flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-accent/50 ${
                    conversation.unreadCount > 0 ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => setSelectedConversationUser(conversation.user)}
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
