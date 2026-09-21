'use client'

import { useState } from 'react'
import Link from 'next/link'

interface RecommendationBannerProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  onClose?: () => void
}

export default function RecommendationBanner({
  title = "Besoin d'aide pour choisir ?",
  subtitle = "Discutez avec notre conseillère IA CLO pour trouver les produits parfaits pour maman et bébé.",
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
      className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg text-white p-6 md:p-8 my-6"
    >
      {/* Élément décoratif d'arrière-plan */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm mb-2">
            Assistant Intelligent ECLOSIA
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href={ctaLink}
            className="flex-1 md:flex-initial text-center px-6 py-3 bg-white text-blue-600 font-medium text-sm rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
          >
            {ctaText}
          </Link>
          
          <button
            onClick={handleClose}
            aria-label="Fermer la bannière"
            className="p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}