"use client";

import Link from "next/link";
import { ArrowLeft, Lock, KeyRound, ShieldAlert, Save } from "lucide-react";

export default function SecuritePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/compte"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à mon compte</span>
        </Link>

        {/* En-tête */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#333333]/10 text-[#333333] mb-2">
            Paramètres de sécurité
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Sécurité & Connexion
          </h1>
          <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
            Modifiez votre mot de passe et renforcez la sécurité de votre compte AURAE.
          </p>
        </div>

        {/* Formulaire de sécurité */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#333333] mb-2">Mot de passe actuel</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-2">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#333333]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#333333]/70 font-medium">
                <ShieldAlert className="w-4 h-4 text-[#6E857B]" />
                <span>Utilisez au moins 8 caractères avec des chiffres et des symboles.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Mettre à jour le mot de passe</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}