import Link from "next/link";
import { 
  ArrowLeft, Package, MapPin, CreditCard, 
  User, Mail, Phone, FileText, Truck, Save
} from "lucide-react";
import { OrderTimeline } from "@/components/orders/OrderTimeline";

export const dynamic = "force-dynamic";
export const revalidate = 0;


export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  // En production : Fetch Supabase 
  // const { data: order } = await supabase.from('orders').select('*, customers(*), payments(*)').eq('id', params.id).single();

  // Simulation des données côté Administrateur
  const order = {
    id: params.id,
    displayId: `AUR-${params.id.slice(0, 8).toUpperCase()}`,
    date: new Date().toISOString(),
    status: "processing", // L'état actuel à modifier par l'admin
    totalAmount: 145.90,
    shippingFee: 4.90,
    payment: {
      method: "Carte bancaire",
      provider: "Stripe",
      transactionId: "pi_3MtwBwLkdIwHu7ix28a3tqNd",
      status: "success"
    },
    customer: {
      id: "cust_890",
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie.dupont@example.com",
      phone: "+33 6 12 34 56 78",
      totalOrders: 3, // Petit bonus admin : savoir si c'est un client fidèle
    },
    shippingAddress: {
      address: "123 rue de la Paix",
      postalCode: "75001",
      city: "Paris",
      country: "France",
    },
    items: [
      { id: "1", name: "Sérum Éclat Naturel", quantity: 2, unitPrice: 45.50, sku: "SER-ECL-01" },
      { id: "2", name: "Crème Hydratante Nuit", quantity: 1, unitPrice: 50.00, sku: "CRM-NUI-02" },
    ],
    historyEvents: [
      { status: "order_received", created_at: new Date(Date.now() - 86400000 * 2).toISOString(), description: "Commande validée" },
      { status: "payment_confirmed", created_at: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(), description: "Paiement Stripe (pi_3Mtw...)" },
      { status: "processing", created_at: new Date(Date.now() - 86400000).toISOString(), description: "Transmis à la logistique" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* En-tête de navigation Administrateur */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-[#333333]/10">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/commandes" 
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-transparent transition-colors text-[#333333]/70 hover:text-[#333333]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-[#333333]">
                  Commande {order.displayId}
                </h1>
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-lg">
                  À PRÉPARER
                </span>
              </div>
              <p className="text-sm text-[#333333]/60 mt-1">
                Passée le {new Date(order.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#333333]/20 hover:border-[#333333]/40 rounded-xl text-sm font-semibold text-[#333333] transition-colors">
              <FileText className="w-4 h-4" />
              Facture
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#333333]/20 hover:border-[#333333]/40 rounded-xl text-sm font-semibold text-[#333333] transition-colors">
              <Truck className="w-4 h-4" />
              Bon de livraison
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Colonne Principale : Gestion du statut et Articles */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* ACTION ADMIN : Mise à jour du statut logistique */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#6E857B]/30 overflow-hidden">
              <div className="bg-[#6E857B]/5 p-5 border-b border-[#6E857B]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#6E857B]" />
                  <h2 className="font-bold text-[#333333]">Action Requise : Mise à jour logistique</h2>
                </div>
              </div>
              <div className="p-5 flex flex-col sm:flex-row items-end gap-4">
                <div className="w-full">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-2">
                    Nouveau statut de la commande
                  </label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333] bg-white"
                    defaultValue={order.status}
                  >
                    <option value="processing">Préparation en cours</option>
                    <option value="shipped">Expédiée (Remise au transporteur)</option>
                    <option value="in_transit">En transit</option>
                    <option value="delivered">Livrée au client</option>
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-2">
                    Numéro de suivi (Optionnel)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: 8A1234567890" 
                    className="w-full px-4 py-2.5 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
                  />
                </div>
                <button className="w-full sm:w-auto px-6 py-2.5 bg-[#6E857B] hover:bg-[#5b7067] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Mettre à jour
                </button>
              </div>
            </div>

            {/* Liste des articles commandés */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
              <div className="p-5 border-b border-[#333333]/10">
                <h2 className="font-bold text-[#333333]">Contenu de la commande</h2>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-[#333333]/60 uppercase bg-gray-50/50">
                    <tr>
                      <th className="px-5 py-3">SKU</th>
                      <th className="px-5 py-3">Produit</th>
                      <th className="px-5 py-3 text-center">Qté</th>
                      <th className="px-5 py-3 text-right">Prix Unitaire</th>
                      <th className="px-5 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-4 text-xs font-mono text-[#333333]/60">{item.sku}</td>
                        <td className="px-5 py-4 font-medium text-[#333333]">{item.name}</td>
                        <td className="px-5 py-4 text-center font-semibold text-[#333333]">{item.quantity}</td>
                        <td className="px-5 py-4 text-right text-[#333333]/80">{item.unitPrice.toFixed(2)} €</td>
                        <td className="px-5 py-4 text-right font-medium text-[#333333]">
                          {(item.quantity * item.unitPrice).toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 p-5 border-t border-[#333333]/10 flex justify-end">
                <div className="space-y-2 text-sm w-64">
                  <div className="flex justify-between text-[#333333]/80">
                    <span>Sous-total produits</span>
                    <span>{(order.totalAmount - order.shippingFee).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-[#333333]/80">
                    <span>Frais de port</span>
                    <span>{order.shippingFee.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#333333] pt-3 border-t border-gray-200 mt-2">
                    <span>Total payé</span>
                    <span>{order.totalAmount.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Suivi Logistique Interne */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 p-6">
              <OrderTimeline currentStatusKey={order.status} historyEvents={order.historyEvents} />
            </div>

          </div>

          {/* Colonne Latérale : Client, Livraison et Paiement */}
          <div className="space-y-6">
            
            {/* Profil Client */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
              <div className="p-5 border-b border-[#333333]/10 flex items-center gap-2">
                <User className="w-5 h-5 text-[#6E857B]" />
                <h2 className="font-bold text-[#333333]">Client</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="font-bold text-[#333333] text-lg">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-xs text-[#6E857B] font-semibold mt-1">
                    {order.customer.totalOrders} commandes passées
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <a href={`mailto:${order.customer.email}`} className="flex items-center gap-3 text-sm text-[#333333]/80 hover:text-[#6E857B]">
                    <Mail className="w-4 h-4" /> {order.customer.email}
                  </a>
                  <a href={`tel:${order.customer.phone}`} className="flex items-center gap-3 text-sm text-[#333333]/80 hover:text-[#6E857B]">
                    <Phone className="w-4 h-4" /> {order.customer.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Adresse d'expédition */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
              <div className="p-5 border-b border-[#333333]/10 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#6E857B]" />
                <h2 className="font-bold text-[#333333]">Adresse d'expédition</h2>
              </div>
              <div className="p-5">
                <address className="not-italic text-sm text-[#333333] space-y-1">
                  <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                  <p className="font-semibold pt-1">{order.shippingAddress.country}</p>
                </address>
              </div>
            </div>

            {/* Détails du Paiement Stripe */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
              <div className="p-5 border-b border-[#333333]/10 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#6E857B]" />
                <h2 className="font-bold text-[#333333]">Détails du paiement</h2>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#333333]/60">Statut</span>
                  <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-700 rounded uppercase">Payé</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#333333]/60">Méthode</span>
                  <span className="font-medium text-[#333333]">{order.payment.method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#333333]/60">Prestataire</span>
                  <span className="font-medium text-[#333333]">{order.payment.provider}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <span className="block text-xs text-[#333333]/60 mb-1">ID Transaction (Stripe)</span>
                  <code className="block text-xs bg-gray-50 p-2 rounded text-[#333333] break-all">
                    {order.payment.transactionId}
                  </code>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}