"use client";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { ArrowLeft, User, Mail, Lock, Sparkles, ShieldCheck } from "lucide-react";

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/15 py-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour Ã  l'accueil AURAE</span>
        </Link>

        {/* Carte principale d'inscription */}
        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-lg">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#6E857B]/20 flex items-center justify-center mx-auto mb-3 text-[#6E857B]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
              CrÃ©er un compte AURAE
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
              Rejoignez notre univers dÃ©diÃ© Ã  la maternitÃ© et Ã  la puÃ©riculture.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Nom complet</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Brad SergueÃ¯ Kokoliko"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Adresse email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <span>S'inscrire</span>
              </button>
            </div>

          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center text-xs text-[#333333]/70 font-medium">
            DÃ©jÃ  un compte AURAE ?{" "}
            <Link href="/auth/connexion" className="font-extrabold text-[#333333] hover:underline">
              Se connecter
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-[#333333]/60 font-medium pt-4 border-t border-[#333333]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
            <span>SÃ©curitÃ© et confidentialitÃ© garanties.</span>
          </div>

        </div>

      </div>
    </div>
  );
}

