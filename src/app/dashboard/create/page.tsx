"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function CreatePage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Welcome to the chat! How can I help you today?",
    },
  ])
  const [showOverlay, setShowOverlay] = useState(false)

  // Show overlay automatically when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlay(true)
    }, 300)
    
    // Cleanup
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message only (no auto-response)
    setMessages([
      ...messages,
      {
        role: "user",
        content: input,
      },
    ])
    setInput("")
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col w-full bg-background relative">
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto w-full">
        {messages.map((message, index) => (
          <Card key={index} className={`max-w-[80%] ${message.role === "user" ? "ml-auto" : ""}`}>
            <CardContent className="p-3">
              <p className="text-sm">{message.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="border-t p-4 w-full">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-10 flex-1 resize-none w-full"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
      
      {/* Animated Under Construction Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center z-50 transition-all duration-1000 ease-in-out ${
          showOverlay 
            ? 'opacity-80 backdrop-blur-md bg-background/70' 
            : 'opacity-0 backdrop-blur-none bg-background/0 pointer-events-none'
        }`}
      >
        <div className={`text-4xl font-bold transition-all duration-200 ${
          showOverlay ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}>
          Under Construction
        </div>
      </div>
    </div>
  )
}