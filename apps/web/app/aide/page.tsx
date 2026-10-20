import Link from "next/link";
import { HelpCircle, ArrowLeft, Truck, RefreshCcw, ShieldCheck, MessageSquare, Mail, Phone, Sparkles } from "lucide-react";

export default function AidePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F5EBE6]/30 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Bouton de retour */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#333333]/70 hover:text-[#333333]">
          <ArrowLeft className="w-4 h-4" /><span>Retour à l&apos;accueil</span>
        </Link>

        {/* En-tête */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6E1] shadow-sm space-y-4 text-center">
          <div className="inline-flex p-3 rounded-full bg-[#6E857B]/10 text-[#6E857B] mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#333333]">Centre d&apos;Aide & FAQ</h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Vous avez des questions concernant vos commandes, la livraison ou nos articles de puériculture ? Retrouvez ci-dessous les réponses aux questions les plus fréquentes.
          </p>
        </div>

        {/* Grille des FAQ / Thématiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#EAE6E1] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#6E857B]">
              <Truck className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#333333]">Livraison & Expédition</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Les commandes sont expédiées en France métropolitaine dans un délai moyen de <strong>2 à 4 jours ouvrables</strong>. La livraison standard est fixée à 10,00 € et est <strong>totalement offerte dès 89,00 € d&apos;achats</strong>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE6E1] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#6E857B]">
              <RefreshCcw className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#333333]">Retours & Remboursements</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Vous disposez d&apos;un délai de <strong>20 jours</strong> à compter de la réception pour exercer votre droit de rétractation. Les retours s&apos;effectuent dans leur emballage d&apos;origine, et les remboursements sont traités sous 14 jours maximum.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE6E1] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#6E857B]">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#333333]">Sécurité & Qualité OEKO-TEX</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tous nos articles de literie et accessoires bébé sont certifiés <strong>OEKO-TEX</strong> pour garantir l&apos;absence de substances nocives et protéger la peau délicate des tout-petits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE6E1] shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-[#6E857B]">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-base text-[#333333]">Conseillère IA 24/7</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Besoin d&apos;aide pour choisir la bonne taille de matelas ou de draps housse ? Notre assistante virtuelle intelligente est disponible à tout moment pour vous guider.
            </p>
          </div>

        </div>

        {/* Bloc Contact Support */}
        <div className="bg-[#333333] text-[#F5EBE6] p-8 rounded-3xl shadow-md text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Vous n&apos;avez pas trouvé votre réponse ?</h2>
          <p className="text-xs sm:text-sm text-[#F5EBE6]/80 max-w-lg mx-auto leading-relaxed">
            Notre équipe basée à Vauréal est à votre écoute du lundi au vendredi de 09h à 18h.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link 
              href="/contact" 
              className="px-6 py-3 rounded-full bg-[#6E857B] text-white text-xs font-bold hover:bg-[#5b7067] transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contactez notre support</span>
            </Link>
            <Link 
              href="/ai-chat" 
              className="px-6 py-3 rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/20 inline-flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuter avec l&apos;IA</span>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}