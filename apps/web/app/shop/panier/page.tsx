import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Plus, Minus } from "lucide-react";

export default function CartPage() {
  // Données mockées du panier (mélange Univers 1 et Univers 2)
  const cartItems = [
    {
      id: 1,
      name: "Huile Prévention & Correction Vergetures Bio",
      universe: "Univers 1 : Maternité",
      price: 34.00,
      quantity: 1,
      image: "/images/slide-3.png",
      slug: "/shop/maternite/huile-vergetures",
    },
    {
      id: 2,
      name: "Nid d'Ange & Gigoteuse Cocon Coton Bio",
      universe: "Univers 2 : Puériculture & Bébé",
      price: 52.00,
      quantity: 1,
      image: "/images/slide-8.jpg",
      slug: "/shop/puericulture/gigoteuse-cocon",
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 60 ? 0 : 5.00;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Lien de retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continuer mes achats</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight mb-8">
          Votre Panier AURAE
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Liste des articles */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-[#333333]/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 bg-[#F5EBE6]/30 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-[#333333]/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#333333]/5 text-[#333333] mb-1">
                      {item.universe}
                    </span>
                    <Link href={item.slug}>
                      <h2 className="font-extrabold text-sm sm:text-base text-[#333333] hover:text-black line-clamp-1 transition-colors">
                        {item.name}
                      </h2>
                    </Link>
                    <p className="text-xs font-bold text-[#333333] mt-1">
                      {item.price.toFixed(2)} €
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#333333]/5">
                  {/* Contrôle de quantité */}
                  <div className="flex items-center border border-[#333333]/15 rounded-full px-2 py-1 bg-white">
                    <button aria-label="Diminuer la quantité" className="p-1 hover:text-black text-[#333333]/60 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#333333]">
                      {item.quantity}
                    </span>
                    <button aria-label="Augmenter la quantité" className="p-1 hover:text-black text-[#333333]/60 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Suppression */}
                  <button aria-label="Supprimer l'article" className="p-2 text-rose-500 hover:text-rose-700 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col gap-6">
            <h2 className="text-lg font-extrabold text-[#333333] border-b border-[#333333]/10 pb-4">
              Récapitulatif
            </h2>

            <div className="flex flex-col gap-3 text-xs sm:text-sm font-medium text-[#333333]/80">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-bold text-[#333333]">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="font-bold text-[#333333]">
                  {shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} €`}
                </span>
              </div>
              {subtotal < 60 && (
                <p className="text-[11px] text-[#6E857B] font-semibold">
                  Ajoutez encore {(60 - subtotal).toFixed(2)} € pour profiter de la livraison gratuite !
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#333333]/10 text-base sm:text-lg font-extrabold text-[#333333]">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>

            <Link
              href="/shop/checkout"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm transition-all active:scale-95 shadow-md text-center"
            >
              <span>Passer la commande</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-[#333333]/60 font-medium justify-center">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Paiement sécurisé & crypté</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}