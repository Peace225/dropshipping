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
      className="relative overflow-hidden bg-gradient-to-r from-[#6E857B] to-[#5b6e65] rounded-[20px] sm:rounded-3xl shadow-md text-white p-5 sm:p-6 md:p-8 my-4 sm:my-6 border border-[#333333]/10"
    >
      {/* Élément décoratif d'arrière-plan */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Bouton Fermer (Positionné en haut à droite pour libérer l'espace en bas sur mobile) */}
      <button
        onClick={handleClose}
        aria-label="Fermer la bannière"
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-colors z-20 active:scale-95"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* pr-8 sur mobile pour éviter que le texte ne passe sous la croix de fermeture */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 pr-6 sm:pr-10 md:pr-0">
        <div className="space-y-2 sm:space-y-2.5 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Assistant Intelligent ECLOSIA</span>
            <span className="sm:hidden">Conseillère IA</span>
          </span>
          <h2 className="text-[17px] sm:text-xl md:text-2xl font-extrabold tracking-tight leading-snug">
            {title}
          </h2>
          <p className="text-[#F5EBE6]/90 text-[11px] sm:text-xs md:text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex w-full md:w-auto mt-1 sm:mt-0">
          <Link
            href={ctaLink}
            className="flex-1 md:flex-initial text-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-[#333333] font-bold text-[12px] sm:text-sm rounded-[14px] sm:rounded-2xl shadow-sm hover:bg-[#F5EBE6] transition-all active:scale-95"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </aside>
  )
}