"use client";

import Link from "next/link";
import { ArrowLeft, Users, MessageSquare, Heart, Sparkles, Send, ShieldCheck } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/15 py-8 flex flex-col justify-between">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6">
        
        {/* Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil AURAE</span>
        </Link>

        {/* En-tête de la communauté */}
        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-lg mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#6E857B]/20 flex items-center justify-center mx-auto mb-3 text-[#6E857B]">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Communauté AURAE
          </h1>
          <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1 max-w-lg mx-auto">
            Un espace d'échange bienveillant dédié aux futurs et jeunes parents. Partagez vos expériences, posez vos questions et soutenez-vous au quotidien.
          </p>
        </div>

        {/* Fil d'actualité / Discussions simulées */}
        <div className="space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-[#333333]/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E8C5C8] flex items-center justify-center font-bold text-xs text-[#333333]">
                  CL
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#333333]">Charlotte L.</h3>
                  <span className="text-[10px] text-[#333333]/50">Il y a 2 heures</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F5EBE6] text-[#6E857B]">
                Sommeil de bébé
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#333333]/80 mb-4 font-medium">
              Bonjour à toutes ! Des astuces douces pour aider un nourrisson à trouver un rythme de sommeil régulier la nuit ? Je suis preneuse de vos retours d'expérience. 🌙✨
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-[#333333]/60 pt-3 border-t border-[#333333]/10">
              <button className="flex items-center gap-1.5 hover:text-[#6E857B] transition-colors">
                <Heart className="w-4 h-4 text-[#D4A396]" />
                <span>12 J'aime</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#6E857B] transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>4 Réponses</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#333333]/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#6E857B]/30 flex items-center justify-center font-bold text-xs text-[#333333]">
                  MS
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#333333]">Marie-Sophie</h3>
                  <span className="text-[10px] text-[#333333]/50">Il y a 1 jour</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F5EBE6] text-[#6E857B]">
                Achats & Puériculture
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#333333]/80 mb-4 font-medium">
              Coup de cœur pour les articles de puériculture éco-responsables reçus cette semaine. La qualité est vraiment au rendez-vous. 🌿
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-[#333333]/60 pt-3 border-t border-[#333333]/10">
              <button className="flex items-center gap-1.5 hover:text-[#6E857B] transition-colors">
                <Heart className="w-4 h-4 text-[#D4A396]" />
                <span>24 J'aime</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-[#6E857B] transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>7 Réponses</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}