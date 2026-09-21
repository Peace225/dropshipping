'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, MessageCircleHeart } from 'lucide-react'
import ChatMessageList from './chat-message-list'
import ChatInput from './chat-input'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AiChatDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [conversationId] = useState(() => `session-drawer-${Date.now()}`)
  
  // État pour gérer l'animation de saut (bounce)
  const [shouldBounce, setShouldBounce] = useState(true)
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis Clara, votre conseillère ECLOSIA. Comment puis-je vous aider aujourd\'hui ?',
    },
  ])
  const [loading, setLoading] = useState(false)

  // Arrêter l'animation de saut après l'ouverture pour ne pas gêner
  useEffect(() => {
    if (isOpen) {
      setShouldBounce(false)
    }
  }, [isOpen])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: content }),
      })

      if (!response.ok) throw new Error('Erreur réseau')

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message?.content || 'Désolé, une erreur est survenue.',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, je ne parviens pas à joindre le serveur pour le moment.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const counselorImage = "/images/conseillere.png"
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Bouton d'ouverture (Design Ultra-Attractif avec Animation Bounce) */}
      {!isOpen && (
        <div className={`relative ${shouldBounce ? 'animate-bounce' : ''}`}>
          
          {/* Bulle de notification clignotante ("Nouveau Message") */}
          <div className="absolute -top-3 -right-2 z-30 animate-pulse">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white shadow-sm">
              <span className="text-white text-[10px] font-bold">1</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-gradient-to-br from-[#333333] to-[#1a1a1a] hover:from-black hover:to-[#222222] text-white pl-2 pr-5 py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-500 transform border border-white/10"
          >
            {/* Effet de lueur animée en arrière-plan (Pulse Glow) */}
            <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse group-hover:bg-transparent transition-colors" />

            <div className="relative flex items-center justify-center">
              {/* Anneau rotatif décoratif */}
              <div className="absolute inset-0 rounded-full border border-dashed border-white/30 animate-[spin_10s_linear_infinite] group-hover:border-white/60" />
              
              {/* Photo de la conseillère */}
              <img 
                src={counselorImage} 
                alt="Conseillère" 
                className="relative w-12 h-12 rounded-full object-cover border-2 border-[#333333] shadow-md z-10"
              />
              
              {/* Pastille de disponibilité (Émeraude éclatant) */}
              <span className="absolute bottom-0 right-0 flex h-4 w-4 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#1a1a1a] group-hover:border-[#222222] transition-colors shadow-sm"></span>
              </span>
            </div>
            
            <div className="flex flex-col items-start justify-center ml-1 z-10">
              <span className="font-extrabold text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Conseillère ECLOSIA
              </span>
              <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
                <MessageCircleHeart className="w-3 h-3" />
                Posez une question
              </span>
            </div>

            {/* Sparkle flottant */}
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          </button>
        </div>
      )}

      {/* Fenêtre de chat flottante */}
      {isOpen && (
        <div className="flex flex-col h-[520px] w-[380px] bg-white border border-[#333333]/20 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 transform origin-bottom-right">
          
          {/* En-tête de la fenêtre (Noir Anthracite Premium) */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#333333] to-[#1a1a1a] text-white flex items-center justify-between border-b border-white/10 relative overflow-hidden">
            
            {/* Effet de lumière subtil dans le header */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shadow-lg overflow-hidden border-[2.5px] border-white/20">
                  <img 
                    src={counselorImage} 
                    alt="Clara - AURAE" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Pastille status header */}
                <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#1a1a1a] shadow-sm"></span>
              </div>
              
              <div className="flex flex-col">
                <h3 className="font-extrabold text-[15px] tracking-wide text-white">Clara d'AURAE</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  En ligne • À votre écoute
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="relative z-10 text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200 active:scale-95"
              aria-label="Fermer le chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Liste des messages */}
          <ChatMessageList messages={messages} loading={loading} />

          {/* Zone de saisie */}
          <ChatInput onSend={handleSendMessage} disabled={loading} />
          
        </div>
      )}
    </div>
  )
}