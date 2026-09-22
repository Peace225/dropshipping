'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, X } from 'lucide-react'

interface RecommendationBannerProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  onClose?: () => void
}

export default function RecommendationBanner({
  title = "Besoin d'aide pour choisir ?",
  subtitle = "Discutez avec notre conseillère IA pour trouver les produits parfaits pour maman et bébé.",
  ctaText = "Lancer la discussion",
  ctaLink = "/conseillere-ia",
  onClose,
}: RecommendationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  return (
    <aside 
      aria-label="Recommandation IA"
      className="relative overflow-hidden bg-gradient-to-r from-[#6E857B] to-[#5b6e65] rounded-3xl shadow-md text-white p-6 md:p-8 my-6 border border-[#333333]/10"
    >
      {/* Élément décoratif d'arrière-plan */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Assistant Intelligent ECLOSIA
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            {title}
          </h2>
          <p className="text-[#F5EBE6]/90 text-xs md:text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href={ctaLink}
            className="flex-1 md:flex-initial text-center px-6 py-3 bg-white text-[#333333] font-bold text-xs sm:text-sm rounded-2xl shadow-sm hover:bg-[#F5EBE6] transition-colors"
          >
            {ctaText}
          </Link>
          
          <button
            onClick={handleClose}
            aria-label="Fermer la bannière"
            className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-2xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}