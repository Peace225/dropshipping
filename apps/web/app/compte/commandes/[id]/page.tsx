import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, Receipt } from "lucide-react";
import { OrderTimeline } from "@/components/orders/OrderTimeline";

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  // Dans une vraie application, vous ferez ici une requête Supabase :
  // const { data: order } = await supabase.from('orders').select('...').eq('id', params.id).single();
  
  // Simulation des données de la commande pour l'intégration visuelle
  const order = {
    id: params.id,
    displayId: `AUR-${params.id.slice(0, 8).toUpperCase()}`,
    date: new Date().toISOString(),
    status: "processing", // Statut actuel
    totalAmount: 145.90,
    shippingFee: 4.90,
    paymentMethod: "Carte bancaire (Stripe)",
    shippingAddress: {
      firstName: "Marie",
      lastName: "Dupont",
      address: "123 rue de la Paix",
      postalCode: "75001",
      city: "Paris",
      country: "France",
    },
    items: [
      { id: "1", name: "Sérum Éclat Naturel", quantity: 2, unitPrice: 45.50 },
      { id: "2", name: "Crème Hydratante Nuit", quantity: 1, unitPrice: 50.00 },
    ],
    historyEvents: [
      { status: "order_received", created_at: new Date(Date.now() - 86400000 * 2).toISOString(), description: "Commande validée" },
      { status: "payment_confirmed", created_at: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(), description: "Paiement accepté" },
      { status: "processing", created_at: new Date(Date.now() - 86400000).toISOString(), description: "En cours de préparation dans nos entrepôts" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* En-tête de navigation */}
        <div className="flex items-center gap-4">
          <Link 
            href="/compte/commandes" 
            className="p-2 rounded-full hover:bg-white border border-transparent hover:border-gray-200 transition-colors text-[#333333]/70 hover:text-[#333333]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#333333]">
              Commande {order.displayId}
            </h1>
            <p className="text-sm text-[#333333]/60">
              Passée le {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne Principale : Articles et Résumé */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Liste des articles */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
              <div className="p-5 border-b border-[#333333]/10 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#6E857B]" />
                <h2 className="font-bold text-[#333333]">Articles commandés</h2>
              </div>
              <div className="p-5">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-[#333333]/60 uppercase bg-gray-50/50">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Produit</th>
                      <th className="px-4 py-3 text-center">Qté</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">Prix total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 font-medium text-[#333333]">{item.name}</td>
                        <td className="px-4 py-4 text-center text-[#333333]/80">{item.quantity}</td>
                        <td className="px-4 py-4 text-right font-medium text-[#333333]">
                          {(item.quantity * item.unitPrice).toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Total Financier */}
              <div className="bg-gray-50 p-5 border-t border-[#333333]/10">
                <div className="space-y-2 text-sm max-w-xs ml-auto">
                  <div className="flex justify-between text-[#333333]/80">
                    <span>Sous-total</span>
                    <span>{(order.totalAmount - order.shippingFee).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-[#333333]/80">
                    <span>Frais de livraison</span>
                    <span>{order.shippingFee.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-[#333333] pt-2 border-t border-gray-200 mt-2">
                    <span>Total payé</span>
                    <span>{order.totalAmount.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Colonne Latérale : Suivi et Informations client */}
          <div className="space-y-6">
            
            {/* Module de Suivi */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 p-6">
              <OrderTimeline 
                currentStatusKey={order.status} 
                historyEvents={order.historyEvents} 
              />
            </div>

            {/* Informations logistiques et facturation */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
              <div className="p-5 border-b border-[#333333]/10 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#6E857B]" />
                <h2 className="font-bold text-[#333333]">Informations</h2>
              </div>
              
              <div className="p-5 space-y-6">
                {/* Adresse */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#333333]/80 uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    Adresse de livraison
                  </div>
                  <address className="not-italic text-sm text-[#333333] pl-6 space-y-0.5">
                    <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                    <p>{order.shippingAddress.country}</p>
                  </address>
                </div>

                {/* Paiement */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#333333]/80 uppercase tracking-wider">
                    <CreditCard className="w-4 h-4" />
                    Méthode de paiement
                  </div>
                  <p className="text-sm text-[#333333] pl-6">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}