"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, Search, ArrowLeft, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export default function SuiviDeCommandePage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearched(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F5EBE6]/30 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#333333]/70 hover:text-[#333333]">
          <ArrowLeft className="w-4 h-4" /><span>Retour à l'accueil</span>
        </Link>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6E1] shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-[#6E857B]/10 text-[#6E857B] mb-2">
              <Truck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333]">Suivi de Commande</h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Entrez votre numéro de commande et votre e-mail pour suivre l&apos;acheminement de votre colis en temps réel.
            </p>
          </div>

          <form onSubmit={handleTracking} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Numéro de commande</label>
              <input 
                type="text" 
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Ex. ECLOSIA-10423"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6E857B]" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Adresse e-mail de facturation</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex. sophie@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6E857B]" 
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3.5 bg-[#6E857B] hover:bg-[#5b7067] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Rechercher mon colis</span>
            </button>
          </form>

          {searched && (
            <div className="mt-8 p-6 rounded-2xl bg-[#F9F6F0] border border-[#333333]/10 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-[10px] font-bold text-[#6E857B] uppercase tracking-wider">Commande #{orderNumber}</span>
                  <h3 className="font-bold text-sm text-[#333333]">Statut : Expédié</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">En transit</span>
              </div>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Commande validée et préparée depuis notre centre logistique.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Colis pris en charge par le transporteur (Délai indicatif : 2 à 4 jours ouvrables).</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Livraison prévue à votre adresse prochainement.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}