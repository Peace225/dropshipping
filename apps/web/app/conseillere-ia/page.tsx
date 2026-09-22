"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Bot, User, Send, ShieldCheck, AlertCircle } from "lucide-react";

export default function ConseilIAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-8 pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil ECLOSIA</span>
        </Link>

        {/* En-tête de la page */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#6E857B]/20 flex items-center justify-center flex-shrink-0 text-[#6E857B]">
            <Sparkles className="w-8 h-8 text-[#6E857B] animate-pulse" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
              Conseillère IA ECLOSIA
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
              Votre expert virtuel dédié à la maternité et à la puériculture. Posez vos questions à tout moment pour des recommandations personnalisées et bienveillantes.
            </p>
          </div>
        </div>

        {/* Avertissement Médical Clair */}
        <div className="bg-[#F5EBE6] border border-[#333333]/10 rounded-2xl p-4 mb-6 flex items-start gap-3 text-xs sm:text-sm text-[#333333]">
          <AlertCircle className="w-5 h-5 text-[#6E857B] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Avertissement important :</strong> Les conseils fournis par cette intelligence artificielle le sont à titre purement indicatif et <strong className="underline">ne remplacent en aucun cas</strong> l'avis, le diagnostic ou la consultation d'un médecin ou d'un professionnel de santé qualifié.
          </p>
        </div>

        {/* Interface principale de discussion interactive */}
        <div className="bg-white rounded-3xl border border-[#333333]/10 shadow-sm overflow-hidden flex flex-col h-[600px]">
          
          {/* Barre supérieure de l'interface */}
          <div className="bg-[#333333] text-white p-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold">Conseillère IA ECLOSIA</h2>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  En ligne • Prête à vous écouter
                </div>
              </div>
            </div>
            <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full font-medium text-white/80">
              Maternité & Puériculture
            </span>
          </div>

          {/* Corps de la conversation */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F5EBE6]/10">
            {/* Message d'accueil du bot */}
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-[#6E857B] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white text-[#333333] border border-[#333333]/10 shadow-sm text-xs sm:text-sm font-medium leading-relaxed">
                Bonjour et bienvenue sur l'espace de conseil intelligent d'ECLOSIA ! Je suis là pour vous accompagner pas à pas dans votre parcours de future ou jeune maman. Que souhaitez-vous aborder aujourd'hui ?
              </div>
            </div>

            {/* Suggestions rapides */}
            <div className="py-2 pl-11 flex flex-wrap gap-2">
              <button type="button" className="text-xs font-bold bg-white border border-[#333333]/15 text-[#333333] px-3.5 py-2 rounded-full hover:bg-[#333333] hover:text-white transition-colors shadow-sm">
                🌿 Soin vergetures bio
              </button>
              <button type="button" className="text-xs font-bold bg-white border border-[#333333]/15 text-[#333333] px-3.5 py-2 rounded-full hover:bg-[#333333] hover:text-white transition-colors shadow-sm">
                🌙 Sommeil de bébé (TOG 2.0)
              </button>
              <button type="button" className="text-xs font-bold bg-white border border-[#333333]/15 text-[#333333] px-3.5 py-2 rounded-full hover:bg-[#333333] hover:text-white transition-colors shadow-sm">
                📦 Infos livraison & retours
              </button>
            </div>
          </div>

          {/* Zone de saisie du message */}
          <div className="p-4 bg-white border-t border-[#333333]/10">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Posez votre question sur la grossesse, les soins ou l'équipement..."
                className="flex-1 px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-[#6E857B] hover:bg-[#5b6e65] text-white font-bold transition-all shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-[#333333]/60 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
              <span>Plateforme sécurisée & accompagnement bienveillant.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}