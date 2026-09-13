import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Truck } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lien de retour vers le panier */}
        <Link
          href="/shop/panier"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au panier</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight mb-8">
          Validation de la Commande AURAE
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Formulaires d'informations (Adresse & Paiement) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Étape 1 : Informations de livraison */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
              <h2 className="text-base sm:text-lg font-extrabold text-[#333333] mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#6E857B]" />
                1. Adresse de livraison
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Prénom</label>
                  <input 
                    type="text" 
                    placeholder="ex: Marie" 
                    className="w-full px-4 py-3 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#333333]" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Nom</label>
                  <input 
                    type="text" 
                    placeholder="ex: Laurent" 
                    className="w-full px-4 py-3 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#333333]" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#333333] mb-1">Adresse postale</label>
                  <input 
                    type="text" 
                    placeholder="Numéro et nom de rue" 
                    className="w-full px-4 py-3 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#333333]" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Ville</label>
                  <input 
                    type="text" 
                    placeholder="Abidjan" 
                    className="w-full px-4 py-3 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#333333]" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Téléphone</label>
                  <input 
                    type="tel" 
                    placeholder="+225 ..." 
                    className="w-full px-4 py-3 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#333333]" 
                  />
                </div>
              </div>
            </div>

            {/* Étape 2 : Moyen de paiement */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
              <h2 className="text-base sm:text-lg font-extrabold text-[#333333] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#6E857B]" />
                2. Paiement Sécurisé
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-[#333333]/15 cursor-pointer hover:bg-[#333333]/5 transition-colors">
                  <input type="radio" name="payment" defaultChecked className="accent-[#333333]" />
                  <span className="text-xs sm:text-sm font-bold text-[#333333]">Carte bancaire (Visa, Mastercard)</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-[#333333]/15 cursor-pointer hover:bg-[#333333]/5 transition-colors">
                  <input type="radio" name="payment" className="accent-[#333333]" />
                  <span className="text-xs sm:text-sm font-bold text-[#333333]">Mobile Money (Orange, MTN, Moov)</span>
                </label>
              </div>
            </div>

          </div>

          {/* Récapitulatif Final */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col gap-6">
            <h2 className="text-lg font-extrabold text-[#333333] border-b border-[#333333]/10 pb-4">
              Résumé de la commande
            </h2>

            <div className="flex flex-col gap-3 text-xs sm:text-sm font-medium text-[#333333]/80">
              <div className="flex justify-between">
                <span>Sous-total (2 articles)</span>
                <span className="font-bold text-[#333333]">86,00 €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="font-bold text-[#333333]">Gratuite</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#333333]/10 text-base sm:text-lg font-extrabold text-[#333333]">
              <span>Total à payer</span>
              <span>86,00 €</span>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Payer 86,00 € en toute sécurité</span>
            </button>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#333333]/60 font-medium justify-center text-center">
              <ShieldCheck className="w-4 h-4 text-[#6E857B] flex-shrink-0" />
              <span>Transactions cryptées SSL de bout en bout</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}