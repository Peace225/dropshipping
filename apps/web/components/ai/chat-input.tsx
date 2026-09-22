'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled) return
    onSend(input)
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-[#333333]/10 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Posez votre question à la conseillère..."
        disabled={disabled}
        className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#6E857B] transition-colors text-xs sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6E857B] hover:bg-[#5b6e65] text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        <span>Envoyer</span>
      </button>
    </form>
  )
}