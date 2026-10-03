'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, AlertCircle, Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant virtuel d\'ECLOSIA. Comment puis-je vous aider aujourd\'hui concernant nos produits Maman et Bébé ?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      })

      if (!response.ok) throw new Error('Erreur réseau')

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Désolé, je n\'ai pas pu traiter votre demande.',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[500px] sm:h-[650px] w-full max-w-3xl mx-auto bg-white border border-[#EAE6E1] rounded-[20px] sm:rounded-3xl shadow-sm overflow-hidden">
      
      {/* En-tête du Chat */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#FDFBF9] border-b border-[#EAE6E1] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-[#F5EBE6] text-[#6E857B] rounded-lg sm:rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#333333] text-xs sm:text-sm">Conseillère IA ECLOSIA</h3>
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">Disponible 24/7</span>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
          En ligne
        </span>
      </div>

      {/* Avertissement Médical Clair */}
      <div className="bg-[#F5EBE6]/60 border-b border-[#EAE6E1] px-3 sm:px-4 py-2 sm:py-2.5 flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-[#333333] shrink-0">
        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6E857B] shrink-0 mt-0.5" />
        <p className="leading-tight">
          <strong className="font-bold">Avertissement :</strong> Cet assistant virtuel fournit des informations à titre indicatif et <strong className="underline">ne remplace en aucun cas</strong> l'avis, le diagnostic ou la consultation d'un professionnel de santé.
        </p>
      </div>

      {/* Corps des messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-[#FAFAFA]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-[16px] sm:rounded-2xl text-[12px] sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#333333] text-white rounded-br-none shadow-sm'
                  : 'bg-white text-[#333333] border border-[#EAE6E1] shadow-sm rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 border border-[#EAE6E1] shadow-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-[16px] sm:rounded-2xl rounded-bl-none text-[11px] sm:text-xs animate-pulse">
              La conseillère écrit...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire de saisie */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white border-t border-[#EAE6E1] flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question..."
          className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-[14px] sm:rounded-2xl focus:outline-none focus:border-[#6E857B] transition-colors text-[13px] sm:text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#6E857B] hover:bg-[#5b6e65] text-white text-[13px] sm:text-sm font-bold rounded-[14px] sm:rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          aria-label="Envoyer"
        >
          <Send className="w-4 h-4 ml-0.5 sm:ml-0" />
          <span className="hidden sm:inline">Envoyer</span>
        </button>
      </form>

    </div>
  )
}