'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, MessageCircleHeart, AlertCircle } from 'lucide-react'
import ChatMessageList from './chat-message-list'
import ChatInput from './chat-input'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function AiChatDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false) // NOUVEL ÉTAT pour masquer la bulle
  const [conversationId] = useState(() => `session-drawer-${Date.now()}`)
  
  const [shouldBounce, setShouldBounce] = useState(true)
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis Clara, votre conseillère ECLOSIA. Comment puis-je vous aider aujourd\'hui ?',
    },
  ])
  const [loading, setLoading] = useState(false)

  // Arrête le petit saut de la bulle une fois cliquée
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

  // Si l'utilisateur a fermé la bulle, on ne rend plus rien
  if (isDismissed) return null;
  
  return (
    <div className={`fixed z-50 pointer-events-none flex flex-col items-end justify-end transition-all ${
      isOpen ? "inset-3 sm:inset-auto sm:bottom-6 sm:right-6" : "bottom-4 right-4 sm:bottom-6 sm:right-6"
    }`}>
      
      {/* BOUTON D'OUVERTURE DE LA BULLE */}
      {!isOpen && (
        <div className={`relative pointer-events-auto ${shouldBounce ? 'animate-bounce' : ''}`}>
          
          {/* NOUVEAU : Bouton pour fermer (masquer) la bulle elle-même */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Évite d'ouvrir le chat en cliquant sur la croix
              setIsDismissed(true);
            }}
            className="absolute -top-2 -left-2 z-40 bg-white text-gray-400 hover:text-[#333333] rounded-full p-1 shadow-md border border-gray-200 active:scale-95 transition-all"
            aria-label="Masquer la bulle"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Bulle de notification clignotante */}
          <div className="absolute -top-2 -right-1 sm:-top-3 sm:-right-2 z-30 animate-pulse pointer-events-none">
            <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white shadow-sm">
              <span className="text-white text-[9px] sm:text-[10px] font-bold">1</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-[#333333] to-[#1a1a1a] hover:from-black hover:to-[#222222] text-white pl-1.5 sm:pl-2 pr-4 sm:pr-5 py-2 sm:py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-500 transform border border-white/10"
          >
            <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse group-hover:bg-transparent transition-colors" />

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-white/30 animate-[spin_10s_linear_infinite] group-hover:border-white/60" />
              <img 
                src={counselorImage} 
                alt="Conseillère" 
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#333333] shadow-md z-10"
              />
              <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5 sm:h-4 sm:w-4 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 border-2 border-[#1a1a1a] group-hover:border-[#222222] transition-colors shadow-sm"></span>
              </span>
            </div>
            
            <div className="flex flex-col items-start justify-center ml-1 z-10">
              <span className="font-extrabold text-[12px] sm:text-sm tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Conseillère ECLOSIA
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
                <MessageCircleHeart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Posez une question
              </span>
            </div>

            <Sparkles className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          </button>
        </div>
      )}

      {/* FENÊTRE DE CHAT OUVERTE */}
      {isOpen && (
        <div className="pointer-events-auto flex flex-col w-full h-full sm:h-[560px] sm:w-[380px] bg-white border border-[#333333]/20 rounded-[20px] sm:rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 transform origin-bottom sm:origin-bottom-right">
          
          {/* En-tête avec bouton de FERMETURE DU CHAT */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#333333] to-[#1a1a1a] text-white flex items-center justify-between border-b border-white/10 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center shadow-lg overflow-hidden border-[2px] sm:border-[2.5px] border-white/20">
                  <img 
                    src={counselorImage} 
                    alt="Clara - ECLOSIA" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0.5 right-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-500 border-2 border-[#1a1a1a] shadow-sm"></span>
              </div>
              
              <div className="flex flex-col">
                <h3 className="font-extrabold text-[14px] sm:text-[15px] tracking-wide text-white">Clara d'ECLOSIA</h3>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-300 font-medium mt-0.5">
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
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-[#F5EBE6] border-b border-[#333333]/10 px-3 py-2 flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#333333] shrink-0">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6E857B] shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong className="font-bold">Info :</strong> Cet assistant ne remplace pas un professionnel de santé.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ChatMessageList messages={messages} loading={loading} />
          </div>

          <div className="shrink-0">
            <ChatInput onSend={handleSendMessage} disabled={loading} />
          </div>
          
        </div>
      )}
    </div>
  )
}