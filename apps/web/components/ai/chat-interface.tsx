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
    <div className="flex flex-col h-[650px] w-full max-w-3xl mx-auto bg-white border border-[#EAE6E1] rounded-3xl shadow-sm overflow-hidden">
      
      {/* En-tête du Chat */}
      <div className="px-6 py-4 bg-[#FDFBF9] border-b border-[#EAE6E1] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#F5EBE6] text-[#6E857B] rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#333333] text-sm">Conseillère IA ECLOSIA</h3>
            <span className="text-[10px] text-gray-500 font-medium">Disponible 24/7</span>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
          En ligne
        </span>
      </div>

      {/* Avertissement Médical Clair */}
      <div className="bg-[#F5EBE6]/60 border-b border-[#EAE6E1] px-4 py-2.5 flex items-start gap-2 text-xs text-[#333333]">
        <AlertCircle className="w-4 h-4 text-[#6E857B] shrink-0 mt-0.5" />
        <p className="leading-tight">
          <strong className="font-bold">Avertissement :</strong> Cet assistant virtuel fournit des informations à titre indicatif et <strong className="underline">ne remplace en aucun cas</strong> l'avis, le diagnostic ou la consultation d'un professionnel de santé qualifié.
        </p>
      </div>

      {/* Corps des messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAFA]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
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
            <div className="bg-white text-gray-400 border border-[#EAE6E1] shadow-sm px-4 py-3 rounded-2xl rounded-bl-none text-xs animate-pulse">
              La conseillère écrit...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire de saisie */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-[#EAE6E1] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question à la conseillère..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#6E857B] transition-colors text-xs sm:text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6E857B] hover:bg-[#5b6e65] text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>Envoyer</span>
        </button>
      </form>

    </div>
  )
}