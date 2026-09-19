'use client'

import { useState } from 'react'

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
    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Écrivez votre message..."
        disabled={disabled}
        className="flex-1 px-3.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Envoyer
      </button>
    </form>
  )
}