"use client";

import Link from "next/link";
import { Mail, MapPin, Clock, Send, ShieldCheck, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Votre message a bien été envoyé à l'équipe ECLOSIA !");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16">
      
      {/* Bouton de retour */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#333333]/70 hover:text-[#333333] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de la page */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#333333] tracking-tight mb-4">
            Contactez notre équipe
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Une question sur une commande, un produit de puériculture ou besoin d'un conseil ? Notre équipe ECLOSIA est à votre écoute pour vous accompagner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Informations de contact (Sidebar) */}
          <div className="bg-white rounded-3xl border border-[#EAE6E1] p-8 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-[#333333]">Nos Coordonnées</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F5EBE6] text-[#6E857B] rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">E-mail</span>
                  <a href="mailto:support@eclosia.app" className="text-sm font-semibold text-[#333333] hover:text-[#6E857B] transition-colors">
                    support@eclosia.app
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F5EBE6] text-[#6E857B] rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Horaires du Support</span>
                  <p className="text-sm font-semibold text-[#333333]">
                    Lun - Ven : 8h - 19h<br />Samedi : 10h - 18h
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F5EBE6] text-[#6E857B] rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Localisation</span>
                  <p className="text-sm font-semibold text-[#333333]">
                    Paris, France
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                <ShieldCheck className="w-5 h-5 text-[#6E857B]" />
                <span>Réponse garantie sous 24 à 48h ouvrées.</span>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EAE6E1] p-8 sm:p-12 shadow-sm">
            <h3 className="text-xl font-bold text-[#333333] mb-6">Envoyez-nous un message</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Votre Nom</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex. Sophie Martin"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6E857B] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Votre Adresse E-mail</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Ex. sophie@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6E857B] transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sujet de votre demande</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex. Suivi de commande / Question sur un produit"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6E857B] transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Votre Message</label>
                <textarea 
                  rows={5}
                  required
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6E857B] transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[#6E857B] hover:bg-[#5b6e65] text-white font-bold text-sm rounded-full transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le message</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}