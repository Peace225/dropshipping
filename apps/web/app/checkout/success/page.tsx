"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, Mail } from "lucide-react";
import { OrderTimeline } from "@/components/orders/OrderTimeline";

export default function CheckoutSuccessPage() {
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("final_order");
      if (savedOrder) {
        setOrderData(JSON.parse(savedOrder));
      }
    } catch (e) {
      console.error("Erreur de lecture de la commande", e);
    }
  }, []);

  // Événements de suivi de la commande
  const initialHistoryEvents = [
    {
      status: "order_received",
      created_at: new Date().toISOString(),
      description: "Votre commande a été bien enregistrée.",
    },
    {
      status: "payment_confirmed",
      created_at: new Date().toISOString(),
      description: `Paiement validé via ${orderData?.paymentMethod || "Carte bancaire"}.`,
    },
  ];

  // Extraction sécurisée du nom du client
  const customerName = orderData?.customer
    ? `${orderData.customer.firstName || orderData.customer.name || ""} ${orderData.customer.lastName || ""}`.trim()
    : "";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center pt-24">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* En-tête de succès */}
        <div className="bg-orange-50/50 p-8 text-center border-b border-gray-200">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#333333] mb-2">
            Merci pour votre commande !
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Votre paiement a été traité avec succès. Nous préparons actuellement vos articles pour l'expédition.
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Colonne de gauche : Informations et prochaines étapes */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-extrabold text-[#333333] border-b border-gray-100 pb-3 mb-4">
                Détails de la commande
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span className="font-medium">Client</span>
                  <span className="font-bold text-[#333333]">
                    {customerName !== "" ? customerName : (orderData?.customer?.email || "Client AURAE")}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Mode de livraison</span>
                  <span className="font-bold text-[#333333]">{orderData?.shippingMethod || "Standard"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Mode de paiement</span>
                  <span className="font-bold text-[#333333]">{orderData?.paymentMethod || "Carte bancaire"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Montant total</span>
                  <span className="font-extrabold text-orange-600">{orderData?.total ? `${orderData.total.toFixed(2)} €` : "--"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Date</span>
                  <span>{new Date().toLocaleDateString('fr-FR')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl flex items-start gap-3 border border-gray-100">
              <Mail className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">
                Un email de confirmation contenant votre facture et le récapitulatif de vos achats vous a été envoyé à <strong className="text-[#333333]">{orderData?.customer?.email || "votre adresse email"}</strong>. 
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link 
                href="/shop/maternite"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Retour à la boutique
              </Link>
              <Link 
                href="/"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-gray-200 hover:border-orange-500 text-[#333333] hover:text-orange-600 text-xs font-bold uppercase tracking-wider transition-all group"
              >
                Accueil
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Colonne de droite : Intégration du composant de suivi */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-between">
            <OrderTimeline 
              currentStatusKey="payment_confirmed" 
              historyEvents={initialHistoryEvents} 
            />
            
            <div className="mt-8 text-xs text-center text-gray-500">
              <p>Une question concernant votre commande ?</p>
              <Link href="#" className="text-orange-600 hover:underline font-medium">
                Contactez notre support client
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}