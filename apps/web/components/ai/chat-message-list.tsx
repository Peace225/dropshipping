'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  sku?: string
  name: string
  price: number
  slug: string
  image_url?: string
  image?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: Product[]
  metadata?: {
    products?: Product[]
  }
}

interface ChatMessageListProps {
  messages: Message[]
  loading: boolean
}

// Fonction de nettoyage d'image identique à detail_PAGE_CORRIGE_FINAL.tsx
const PLACEHOLDER = "https://via.placeholder.com/600x600/F5EBE6/333333?text=ECLOSIA+BEBE";

const cleanImageUrl = (raw?: string): string => {
  if (!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  return first.startsWith("http") ? first : PLACEHOLDER;
}

export default function ChatMessageList({ messages, loading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-[#F5EBE6]/10">
      {messages.map((msg) => {
        const displayProducts = msg.products || msg.metadata?.products || []

        return (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl sm:rounded-xl text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#333333] text-white rounded-br-none'
                  : 'bg-white text-[#333333] border border-[#333333]/10 rounded-bl-none'
              }`}
            >
              {/* Anti-étoiles ** pour un rendu propre */}
              {msg.content.replace(/\*\*/g, '')}
            </div>

            {/* Affichage des cartes produits avec image nettoyée, secours onError et routing /bebe/${slug} */}
            {msg.role === 'assistant' && displayProducts.length > 0 && (
              <div className="mt-2.5 max-w-[88%] sm:max-w-[80%] space-y-2 w-full">
                {displayProducts.map((product, idx) => {
                  const rawImg = product.image_url || product.image
                  const imageUrl = cleanImageUrl(rawImg)
                  const productUrl = `/bebe/${product.slug || ''}`

                  return (
                    <Link
                      key={product.sku || idx}
                      href={productUrl}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#333333]/10 shadow-sm hover:border-[#6E857B] hover:shadow-md transition-all group block"
                    >
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-contain bg-[#FAF7F2] shrink-0 border border-gray-100 p-1"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#333333] truncate group-hover:text-[#6E857B] transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs font-extrabold text-[#6E857B] mt-0.5">
                          {Number(product.price).toFixed(2).replace('.', ',')} €
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#333333] group-hover:bg-[#6E857B] text-white shrink-0 transition-colors">
                        Voir
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
      
      {loading && (
        <div className="flex justify-start">
          <div className="bg-white text-[#333333] border border-[#333333]/10 shadow-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl sm:rounded-xl rounded-bl-none text-xs flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#6E857B] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#6E857B] rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#6E857B] rounded-full animate-bounce delay-200"></span>
            </span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}