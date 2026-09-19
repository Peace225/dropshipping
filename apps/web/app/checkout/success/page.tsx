import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, Mail } from "lucide-react";
import { OrderTimeline } from "@/components/orders/OrderTimeline";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  // Simulation des événements de la commande pour l'affichage initial
  // Dans le futur, ces données proviendront de Supabase via une requête serveur
  const initialHistoryEvents = [
    {
      status: "order_received",
      created_at: new Date().toISOString(),
      description: "Votre commande a été bien enregistrée.",
    },
    {
      status: "payment_confirmed",
      created_at: new Date().toISOString(),
      description: "Paiement sécurisé validé via Stripe.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
        
        {/* En-tête de succès */}
        <div className="bg-[#6E857B]/10 p-8 text-center border-b border-[#333333]/10">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#6E857B]/20 mb-6">
            <CheckCircle className="h-8 w-8 text-[#6E857B]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#333333] mb-2">
            Merci pour votre commande !
          </h1>
          <p className="text-[#333333]/70 text-sm max-w-md mx-auto">
            Votre paiement a été traité avec succès. Nous préparons actuellement vos articles pour l'expédition.
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Colonne de gauche : Informations et prochaines étapes */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-[#333333] border-b border-[#333333]/10 pb-3 mb-4">
                Détails de la commande
              </h2>
              <ul className="space-y-3 text-sm text-[#333333]/80">
                <li className="flex justify-between">
                  <span className="font-medium">Numéro de transaction</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono truncate max-w-[150px]">
                    {sessionId ? sessionId.replace('cs_test_', 'TX-') : 'TX-EN-ATTENTE'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Date</span>
                  <span>{new Date().toLocaleDateString('fr-FR')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl flex items-start gap-3 border border-gray-100">
              <Mail className="w-5 h-5 text-[#6E857B] shrink-0 mt-0.5" />
              <p className="text-sm text-[#333333]/70 leading-relaxed">
                Un email de confirmation contenant votre facture et le récapitulatif de vos achats vous a été envoyé. 
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link 
                href="/"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#6E857B] hover:bg-[#5b7067] text-white text-sm font-bold uppercase tracking-wide transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Retour à la boutique
              </Link>
              <Link 
                href="/compte/commandes"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#333333]/20 hover:border-[#6E857B] text-[#333333] hover:text-[#6E857B] text-sm font-bold uppercase tracking-wide transition-all group"
              >
                Mon compte
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Colonne de droite : Intégration du composant de suivi */}
          <div className="bg-gray-50 p-6 rounded-xl border border-[#333333]/5">
            <OrderTimeline 
              currentStatusKey="payment_confirmed" 
              historyEvents={initialHistoryEvents} 
            />
            
            <div className="mt-8 text-xs text-center text-[#333333]/50">
              <p>Une question concernant votre commande ?</p>
              <Link href="/contact" className="text-[#6E857B] hover:underline font-medium">
                Contactez notre support client
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}