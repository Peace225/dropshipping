"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Heart,
  Truck,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  CreditCard,
  Lock,
  Check,
  User,
  ShieldCheck,
  Home
} from "lucide-react";

// ==========================================
// BASE DE DONNÉES GLOBALE DE TOUS VOS PRODUITS
// ==========================================
const ALL_PRODUCTS_DETAILS: Record<string, {
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  thumbnails: string[];
  description: string;
}> = {
  // 1. Huile vergetures
  "huile-vergetures": {
    name: "Huile Prévention & Correction Vergetures Bio",
    brand: "AURAE",
    category: "Maternité",
    price: 34.00,
    oldPrice: 42.00,
    discount: "-19%",
    rating: 5,
    reviewsCount: 48,
    stock: 22,
    thumbnails: ["/images/slide-3.png", "/images/slide-1.jpg", "/images/slide-2.jpg"],
    description: "Nourrit intensément et améliore l'élasticité de la peau pendant et après la grossesse. Formule 100% naturelle et certifiée bio.",
  },
  // 2. Gigoteuse
  "gigoteuse-cocon": {
    name: "Nid d'Ange & Gigoteuse Cocon Coton Bio",
    brand: "AURAE",
    category: "Puériculture",
    price: 52.00,
    oldPrice: 65.00,
    discount: "-20%",
    rating: 5,
    reviewsCount: 32,
    stock: 14,
    thumbnails: ["/images/slide-8.jpg", "/images/slide-1.jpg"],
    description: "Régulation thermique idéale (TOG 2.0) pour des nuits paisibles et enveloppantes. En coton biologique ultra-doux pour bébé.",
  },
  // 3. Coussin de grossesse
  "coussin-grossesse": {
    name: "Coussin de Grossesse & Allaitement XXL",
    brand: "AURAE",
    category: "Maternité",
    price: 68.00,
    oldPrice: 85.00,
    discount: "-20%",
    rating: 5,
    reviewsCount: 64,
    stock: 10,
    thumbnails: ["/images/slid.png", "/images/slide-3.png"],
    description: "Soutien ergonomique d'exception pour soulager le dos et les jambes au quotidien pendant et après la grossesse.",
  },
  // 4. Coffret naissance
  "coffret-naissance": {
    name: "Coffret Naissance Essentiel Bébé Bio",
    brand: "AURAE",
    category: "Puériculture",
    price: 45.00,
    oldPrice: 58.00,
    discount: "-22%",
    rating: 5,
    reviewsCount: 29,
    stock: 19,
    thumbnails: ["/images/slide-1.jpg", "/images/slide-2.jpg"],
    description: "Un ensemble complet en coton bio incluant bonnet, bavoir, petits chaussons et sortie de bain.",
  },
  // 5. Baume réparateur
  "baume-reparateur": {
    name: "Baume Réparateur Post-Partum & Allaitement",
    brand: "AURAE",
    category: "Maternité",
    price: 28.00,
    oldPrice: 35.00,
    discount: "-20%",
    rating: 5,
    reviewsCount: 41,
    stock: 25,
    thumbnails: ["/images/slide-2.jpg", "/images/slide-3.png"],
    description: "Apaise et protège les zones fragilisées avec des ingrédients 100% naturels et compatibles avec l'allaitement.",
  },
  // 6. Poussette
  "poussette-compacte": {
    name: "Poussette Compacte Ultra-Légère Nomade",
    brand: "AURAE",
    category: "Puériculture",
    price: 249.00,
    oldPrice: 299.00,
    discount: "-16%",
    rating: 5,
    reviewsCount: 18,
    stock: 5,
    thumbnails: ["/images/slide-6.png", "/images/slide-1.jpg"],
    description: "Maniable, légère et homologuée cabine d'avion pour simplifier les déplacements des parents au quotidien.",
  },
  // 7. Coffret maternité (celui de votre capture d'écran)
  "coffret-maternite": {
    name: "Coffret Maternité Essentiel",
    brand: "AURAE",
    category: "Maternité",
    price: 49.00,
    oldPrice: 65.00,
    discount: "-24%",
    rating: 5,
    reviewsCount: 128,
    stock: 17,
    thumbnails: ["/images/slide-3.png", "/images/slide-1.jpg", "/images/slide-2.jpg"],
    description: "Un ensemble complet de soins biologiques spécialement formulés pour accompagner les futures et jeunes mamans.",
  }
};

// Liste des produits similaires affichés en bas
const SIMILAR_PRODUCTS = [
  { id: 1, name: "Huile Vergetures Bio", price: "29,00 €", image: "/images/slide-3.png", slug: "/shop/maternite/huile-vergetures" },
  { id: 2, name: "Savon Doux Surgras", price: "12,00 €", image: "/images/slide-2.jpg", slug: "/shop/maternite/baume-reparateur" },
  { id: 3, name: "Lait Hydratant Bébé", price: "24,00 €", image: "/images/slide-1.jpg", slug: "/shop/puericulture/coffret-naissance" },
  { id: 4, name: "Baume Apaisant Maman", price: "21,00 €", image: "/images/slide-8.jpg", slug: "/shop/puericulture/gigoteuse-cocon" },
];

export default function UniversalProductDetailPage({ params }: { params: { slug: string } }) {
  // Récupération dynamique du produit en fonction du slug dans l'URL
  // S'il n'est pas trouvé, on prend le coffret maternité par défaut
  const currentProduct = ALL_PRODUCTS_DETAILS[params.slug] || ALL_PRODUCTS_DETAILS["coffret-maternite"];

  const [activeImage, setActiveImage] = useState(currentProduct.thumbnails[0]);
  const [region, setRegion] = useState("Île-de-France");
  const [agence, setAgence] = useState("Paris - Relais Colis");
  const [deliveryMode, setDeliveryMode] = useState<"relais" | "domicile">("relais");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const shippingCost = deliveryMode === "domicile" ? 5.90 : 3.90;
  const totalPrice = currentProduct.price + shippingCost;

  const handleBuyClick = () => {
    if (!isLoggedIn) {
      setIsLoginPromptOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
    }, 1500);
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('similar-products-slider');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-6 relative font-sans text-[#333333]">
      
      {/* 1. MODALE DE CONNEXION REQUISE */}
      {isLoginPromptOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative text-center">
            <button 
              onClick={() => setIsLoginPromptOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-orange-100 text-[#F68B1E] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
            <p className="text-sm text-gray-600 mb-6">
              Veuillez vous identifier pour effectuer vos achats sur AURAE.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setIsLoggedIn(true);
                  setIsLoginPromptOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 bg-[#F68B1E] hover:bg-[#e07b1a] text-white font-bold rounded-xl shadow-md transition"
              >
                Se connecter / S'identifier
              </button>
              <button 
                onClick={() => setIsLoginPromptOpen(false)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODALE DE PAIEMENT (CHECKOUT) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button 
              onClick={() => { setIsCheckoutOpen(false); setOrderSuccess(false); }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {orderSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Paiement réussi !</h3>
                <p className="text-sm text-gray-600">Merci pour votre commande. Un e-mail de confirmation vous a été envoyé.</p>
                <button 
                  onClick={() => { setIsCheckoutOpen(false); setOrderSuccess(false); }}
                  className="mt-6 px-6 py-2.5 bg-[#333333] text-white font-medium rounded-lg hover:bg-black transition"
                >
                  Retourner à la boutique
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-gray-900">Paiement sécurisé - Checkout</h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 border space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="relative w-14 h-14 bg-white rounded-lg border overflow-hidden flex-shrink-0">
                      <Image src={activeImage} alt={currentProduct.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase">{currentProduct.brand}</h4>
                      <p className="text-sm font-bold text-gray-900">{currentProduct.name}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix de l'article</span>
                      <span className="font-semibold">{currentProduct.price.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison ({deliveryMode === 'relais' ? agence : 'À domicile'})</span>
                      <span className="font-semibold">{shippingCost.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-base font-bold text-gray-900">
                      <span>Total à payer</span>
                      <span className="text-[#F68B1E]">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Mode de paiement</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition ${paymentMethod === 'card' ? 'border-[#F68B1E] bg-orange-50 text-[#F68B1E]' : 'border-gray-200 text-gray-700'}`}
                      >
                        <CreditCard className="w-5 h-5" /> Carte bancaire
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("paypal")}
                        className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition ${paymentMethod === 'paypal' ? 'border-[#F68B1E] bg-orange-50 text-[#F68B1E]' : 'border-gray-200 text-gray-700'}`}
                      >
                        <ShoppingBag className="w-5 h-5" /> PayPal
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("apple")}
                        className={`p-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-2 transition ${paymentMethod === 'apple' ? 'border-[#F68B1E] bg-orange-50 text-[#F68B1E]' : 'border-gray-200 text-gray-700'}`}
                      >
                        <Lock className="w-5 h-5" /> Apple Pay
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full mt-4 py-3.5 bg-[#F68B1E] hover:bg-[#e07b1a] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? "Traitement..." : `Payer ${totalPrice.toFixed(2).replace('.', ',')} €`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENU PRINCIPAL DE LA PAGE */}
      <div className="max-w-[1300px] mx-auto px-4">
        
        {/* En-tête : Fil d'ariane & État de connexion */}
        <div className="flex justify-between items-center mb-4 text-xs font-medium">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la boutique - {params.slug}</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full font-semibold ${isLoggedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
              {isLoggedIn ? "● Connecté" : "○ Non connecté"}
            </span>
            {isLoggedIn && (
              <button onClick={() => setIsLoggedIn(false)} className="text-red-600 hover:underline">
                Se déconnecter
              </button>
            )}
          </div>
        </div>

        {/* GRILLE À 3 COLONNES (IDENTIQUE À VOTRE IMAGE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* COLONNE 1 : Images du produit (4 colonnes sur 12) */}
          <div className="lg:col-span-4 bg-white p-4 rounded-xl shadow-sm border flex flex-col">
            <div className="relative w-full aspect-square bg-[#F5EBE6]/20 rounded-lg overflow-hidden mb-3 p-4 flex items-center justify-center">
              <span className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-red-500 shadow-xs z-10">{currentProduct.discount}</span>
              <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 shadow-xs z-10">
                <Heart className="w-5 h-5" />
              </button>
              <Image src={activeImage} alt={currentProduct.name} fill className="object-contain p-2" priority />
            </div>
            
            {/* Miniatures */}
            <div className="flex gap-2">
              {currentProduct.thumbnails.map((thumb, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(thumb)} 
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 flex items-center justify-center bg-gray-50 ${activeImage === thumb ? 'border-[#333333]' : 'border-transparent'}`}
                >
                  <img src={thumb} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* COLONNE 2 : Informations & Achat (5 colonnes sur 12) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border flex flex-col justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] mb-2">{currentProduct.name}</h1>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">{currentProduct.description}</p>

              <div className="flex items-center gap-2 mb-4 border-b pb-4">
                <div className="flex items-center text-amber-500">
                  {[...Array(currentProduct.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs text-blue-600 font-semibold">({currentProduct.reviewsCount} avis)</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-3xl font-black text-[#333333]">{currentProduct.price.toFixed(2).replace('.', ',')} €</span>
                  <span className="text-base text-gray-400 line-through">{currentProduct.oldPrice.toFixed(2).replace('.', ',')} €</span>
                </div>
                <p className="text-xs font-medium text-green-600 mt-1">En stock : {currentProduct.stock} articles</p>
              </div>
            </div>
            
            <button 
              onClick={handleBuyClick} 
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#F68B1E] hover:bg-[#e07b1a] active:scale-[0.99] transition text-white font-extrabold text-base shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" /> J'ACHÈTE
            </button>
          </div>

          {/* COLONNE 3 : Livraison & Retours (3 colonnes sur 12) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-xs uppercase text-[#333333]">Livraison & Retours</h3>
                <span className="text-[10px] bg-orange-100 text-[#F68B1E] px-2 py-0.5 rounded-full font-bold">AURAE Bio</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMode("relais")}
                  className={`p-2.5 border rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition ${deliveryMode === 'relais' ? 'border-[#F68B1E] bg-orange-50 text-[#F68B1E]' : 'border-gray-200 text-gray-700'}`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Point Relais</span>
                  <span className="text-[10px] font-bold">3,90 €</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMode("domicile")}
                  className={`p-2.5 border rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition ${deliveryMode === 'domicile' ? 'border-[#F68B1E] bg-orange-50 text-[#F68B1E]' : 'border-gray-200 text-gray-700'}`}
                >
                  <Home className="w-4 h-4" />
                  <span>À domicile</span>
                  <span className="text-[10px] font-bold">5,90 €</span>
                </button>
              </div>
              
              {deliveryMode === "relais" ? (
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-gray-700">Votre région et point de retrait</div>
                  <div className="relative">
                    <select 
                      value={region} 
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg appearance-none text-gray-800 font-medium pr-8"
                    >
                      <option value="Île-de-France">Île-de-France</option>
                      <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select 
                      value={agence} 
                      onChange={(e) => setAgence(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg appearance-none text-gray-800 font-medium pr-8"
                    >
                      <option value="Paris - Relais Colis">Paris - Relais Colis</option>
                      <option value="Lyon - Point Relais Partenaire">Lyon - Point Relais Partenaire</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-gray-500 pt-1">Livraison estimée en 2 à 3 jours ouvrés.</p>
                </div>
              ) : (
                <div className="space-y-1 bg-gray-50 p-2.5 rounded-lg border text-xs text-gray-600">
                  <p className="font-semibold text-gray-800">Expédition express à domicile</p>
                  <p>Livraison directement chez vous en 48h.</p>
                </div>
              )}

              <div className="border-t pt-3 space-y-2.5 text-xs">
                <div className="flex gap-2 items-start">
                  <RefreshCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#333333]">Retours gratuits</p>
                    <p className="text-[10px] text-gray-500">Vous avez 30 jours pour changer d'avis (produits non ouverts).</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#333333]">Garantie Authenticité</p>
                    <p className="text-[10px] text-gray-500">100% bio et naturel certifié par AURAE.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* SECTION BAS : "Vous aimerez aussi" (Carrousel) */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#333333]">Vous aimerez aussi</h2>
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} className="p-2 border rounded-full hover:bg-gray-50 text-gray-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scroll('right')} className="p-2 border rounded-full hover:bg-gray-50 text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div id="similar-products-slider" className="flex gap-4 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            {SIMILAR_PRODUCTS.map((prod) => (
              <Link key={prod.id} href={prod.slug} className="min-w-[210px] max-w-[210px] flex-shrink-0 bg-gray-50 rounded-lg p-3 border hover:shadow-md transition flex flex-col">
                <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden mb-3 p-2 flex items-center justify-center">
                  <Image src={prod.image} alt={prod.name} fill className="object-contain p-2" />
                </div>
                <h3 className="text-xs font-semibold text-[#333333] mb-1 truncate">{prod.name}</h3>
                <span className="text-xs font-bold text-[#F68B1E] mt-auto">{prod.price}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}