"use client"

import * as React from "react"
import { Search, Mail, CheckCircle, Trash, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { messageService, userService, productService } from "@/lib/database"
import { DatabaseUser, Message, Product } from "@/types/database"

export function MessagesPageContent() {
  // State for messages
  const [messages, setMessages] = React.useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = React.useState<Message[]>([])
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null)
  const [currentUser, setCurrentUser] = React.useState<DatabaseUser | null>(null)
  const [users, setUsers] = React.useState<DatabaseUser[]>([])
  const [products, setProducts] = React.useState<Product[]>([])
  
  // State for new message form
  const [newMessage, setNewMessage] = React.useState({
    recipientId: "",
    subject: "",
    content: "",
    relatedProductId: ""
  })
  
  // State for dialogs
  const [showComposeDialog, setShowComposeDialog] = React.useState(false)
  const [showViewDialog, setShowViewDialog] = React.useState(false)
  const [showExpandDialog, setShowExpandDialog] = React.useState(false)
  const [expandedContent, setExpandedContent] = React.useState<{title: string, content: string} | null>(null)
  
  // State for loading
  const [loading, setLoading] = React.useState(false)
  
  // Load initial data
  React.useEffect(() => {
    async function loadInitialData() {
      setLoading(true)
      try {
        // Load current user
        const user = await userService.getCurrentUser()
        setCurrentUser(user)
        
        // Load all messages for the user
        const messageData = await messageService.getUserMessages()
        setMessages(messageData)
        setFilteredMessages(messageData)
        
        // Load all users for messaging
        const userData = await userService.getUsers()
        setUsers(userData)
        
        // Load user's products for reference
        const productData = await productService.getProducts()
        setProducts(productData)
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadInitialData()
  }, [])
  
  // Filter messages based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredMessages(messages)
      return
    }
    
    const lowerQuery = query.toLowerCase()
    const results = messages.filter(message => 
      message.subject.toLowerCase().includes(lowerQuery) ||
      message.content.toLowerCase().includes(lowerQuery) ||
      message.senderName?.toLowerCase().includes(lowerQuery) ||
      message.senderEmail?.toLowerCase().includes(lowerQuery)
    )
    
    setFilteredMessages(results)
  }
  
  // Mark message as read when viewed
  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message)
    setShowViewDialog(true)
    
    // If message is unread, mark as read
    if (!message.isRead) {
      try {
        const updatedMessage = await messageService.markAsRead(message.id)
        
        // Update messages list
        setMessages(prev => 
          prev.map(m => m.id === updatedMessage.id ? { ...m, isRead: true } : m)
        )
        setFilteredMessages(prev => 
          prev.map(m => m.id === updatedMessage.id ? { ...m, isRead: true } : m)
        )
      } catch (error) {
        console.error("Error marking message as read:", error)
      }
    }
  }
  
  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.recipientId || !newMessage.subject || !newMessage.content) {
      alert("Recipient, subject and message content are required")
      return
    }
    
    setLoading(true)
    try {
      await messageService.sendMessage({
        recipientId: newMessage.recipientId,
        subject: newMessage.subject,
        content: newMessage.content,
        relatedProductId: newMessage.relatedProductId || undefined
      })
      
      // Reset form and close dialog
      setNewMessage({
        recipientId: "",
        subject: "",
        content: "",
        relatedProductId: ""
      })
      setShowComposeDialog(false)
      
      alert("Message sent successfully")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Reply to a message
  const handleReply = () => {
    if (!selectedMessage) return
    
    setNewMessage({
      recipientId: selectedMessage.senderId,
      subject: `Re: ${selectedMessage.subject}`,
      content: "",
      relatedProductId: selectedMessage.relatedProductId || ""
    })
    
    setShowViewDialog(false)
    setShowComposeDialog(true)
  }

  // Handle expand content
  const handleExpandContent = (title: string, content: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the card click (view message) from firing
    setExpandedContent({ title, content })
    setShowExpandDialog(true)
  }
  
  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        
        <Button onClick={() => setShowComposeDialog(true)}>
          <Mail className="mr-2 h-4 w-4" />
          Compose Message
        </Button>
      </div>
      
      <div className="flex flex-col mb-4">
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8 w-[200px] md:w-[300px]"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {loading && Array(3).fill(0).map((_, i) => (
          <Card key={`skeleton-${i}`} className="opacity-50">
            <CardHeader>
              <div className="bg-muted w-2/3 h-6 rounded animate-pulse"></div>
              <div className="bg-muted w-1/2 h-4 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted w-full h-4 rounded animate-pulse mb-2"></div>
              <div className="bg-muted w-3/4 h-4 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
        
        {!loading && filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">
              You don't have any messages yet or your search didn't match any messages.
            </p>
          </div>
        )}
        
        {!loading && filteredMessages.map((message) => (
          <Card 
            key={message.id} 
            className={`cursor-pointer hover:bg-muted/30 transition-colors ${!message.isRead ? 'border-primary/50' : ''}`}
            onClick={() => handleViewMessage(message)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{message.subject}</h3>
                    {!message.isRead && (
                      <Badge variant="default" className="rounded-full px-2 py-0 text-xs">New</Badge>
                    )}
                  </div>
                  <CardDescription>
                    From: {message.sender?.name || message.senderEmail || 'Unknown sender'}
                  </CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-1">
                <p className="text-sm line-clamp-2">
                  {message.content}
                </p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 mt-0.5 ml-1" 
                  onClick={(e) => handleExpandContent(message.subject, message.content, e)}
                >
                  <Maximize2 className="h-3 w-3" />
                  <span className="sr-only">Expand</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Compose Message Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Send a message to another user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Select
                value={newMessage.recipientId}
                onValueChange={(value) => setNewMessage({ ...newMessage, recipientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a recipient" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter(user => user.id !== currentUser?.id)
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                placeholder="Enter message subject"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="related">Related Product (Optional)</Label>
              <Select
                value={newMessage.relatedProductId}
                onValueChange={(value) => setNewMessage({ ...newMessage, relatedProductId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                placeholder="Enter your message"
                rows={6}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Message Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle>{selectedMessage?.subject}</DialogTitle>
              {selectedMessage?.isRead && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Read
                </div>
              )}
            </div>
            <DialogDescription>
              From: {selectedMessage?.sender?.name || selectedMessage?.senderEmail || 'Unknown sender'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[50vh]">
            <div className="whitespace-pre-wrap">
              {selectedMessage?.content}
            </div>
            
            {selectedMessage?.relatedProductId && (
              <div className="mt-4 p-3 border rounded-md bg-muted/30">
                <p className="text-sm font-medium mb-1">Related Product:</p>
                <p className="text-sm">
                  {products.find(p => p.id === selectedMessage.relatedProductId)?.name || 'Product not found'}
                </p>
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter className="gap-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
              
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
              
              <Button onClick={handleReply}>
                <Mail className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Expand Content Dialog */}
      <Dialog open={showExpandDialog} onOpenChange={setShowExpandDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{expandedContent?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-2 whitespace-pre-wrap">
            {expandedContent?.content}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpandDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
