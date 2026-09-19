'use client'

import { useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessageListProps {
  messages: Message[]
  loading: boolean
}

export default function ChatMessageList({ messages, loading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5EBE6]/10">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-[#333333] text-white rounded-br-none'
                : 'bg-white text-[#333333] border border-[#333333]/10 rounded-bl-none'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-start">
          <div className="bg-white text-[#333333] border border-[#333333]/10 shadow-sm px-4 py-3 rounded-xl rounded-bl-none text-xs flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#6E857B] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#6E857B] rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-[#6E857B] rounded-full animate-bounce delay-200"></span>
            </span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}