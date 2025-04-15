"use client"

import * as React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export function CreatePageContent() {
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState([
    {
      role: "system",
      content: "Welcome to the chat! How can I help you today?",
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const newMessages = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ]
    setMessages(newMessages)
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "system",
          content: `I received your message: "${input}". This is a simulated response.`,
        },
      ])
    }, 1000)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <Card key={index} className={`max-w-[80%] ${message.role === "user" ? "ml-auto" : ""}`}>
            <CardContent className="p-3">
              <p className="text-sm">{message.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-10 flex-1 resize-none"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
