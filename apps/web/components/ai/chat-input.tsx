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
    <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-[#333333]/10 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Posez votre question..."
        disabled={disabled}
        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-[14px] sm:rounded-2xl focus:outline-none focus:border-[#6E857B] transition-colors text-[13px] sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        // shrink-0 empêche le bouton de s'écraser, px-3 sur mobile et px-6 sur PC
        className="shrink-0 inline-flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#6E857B] hover:bg-[#5b6e65] text-white text-[13px] sm:text-sm font-bold rounded-[14px] sm:rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        aria-label="Envoyer"
      >
        <Send className="w-4 h-4 sm:w-4 sm:h-4 ml-0.5 sm:ml-0" />
        {/* Le texte "Envoyer" est caché sur mobile et visible uniquement à partir de la taille "sm" (tablette/PC) */}
        <span className="hidden sm:inline">Envoyer</span>
      </button>
    </form>
  )
}