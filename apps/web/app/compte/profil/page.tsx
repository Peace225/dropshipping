"use client";

import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Save, ShieldCheck } from "lucide-react";

export default function ProfilPage() {
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
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#6E857B]/15 text-[#333333] mb-2">
            Paramètres du profil
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Informations personnelles
          </h1>
          <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
            Mettez à jour vos coordonnées personnelles associées à votre profil AURAE.
          </p>
        </div>

        {/* Formulaire de profil */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#333333] mb-2">Prénom</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    defaultValue="Brad Sergueï"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-2">Nom</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    defaultValue="Kokoliko"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-2">Adresse email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    defaultValue="brad.kokoliko@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-2">Numéro de téléphone</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    defaultValue="+225 07 00 00 00 00"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#333333]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#333333]/70 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Vos données personnelles sont strictement protégées.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}