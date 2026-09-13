import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowLeft, ShieldCheck, Heart } from "lucide-react";

// Données détaillées pour l'Univers Puériculture & Bébé
const BABY_PRODUCTS = [
  {
    id: 1,
    name: "Coffret Bain & Soins Bio Ultra-Doux",
    category: "Toilette & Bain",
    price: "36,00 €",
    rating: 5,
    reviewsCount: 84,
    image: "/images/slide-1.jpg",
    slug: "/shop/puericulture/coffret-bain-bio",
    badge: "Hypoallergénique",
    description: "Formules haute tolérance, sans sulfates ni larmes, pour chouchouter la peau délicate de bébé dès la naissance.",
  },
  {
    id: 2,
    name: "Nid d'Ange & Gigoteuse Cocon Coton Bio",
    category: "Sommeil & Cocon",
    price: "52,00 €",
    rating: 5,
    reviewsCount: 112,
    image: "/images/slide-8.jpg",
    slug: "/shop/puericulture/gigoteuse-cocon",
    badge: "Douceur Nuit",
    description: "Enveloppe bébé dans un cocon de chaleur sécurisant. Certifié Oeko-Tex pour des nuits paisibles et protégées.",
  },
  {
    id: 3,
    name: "Porte-Bébé Physiologique Évolutif",
    category: "Portage & Sécurité",
    price: "89,00 €",
    rating: 5,
    reviewsCount: 76,
    image: "/images/slide-2.png",
    slug: "/shop/puericulture/porte-bebe-physio",
    badge: "Physiologique",
    description: "Assure un portage respectueux de la physiologie de bébé (position en M) et soulage le dos du porteur.",
  },
  {
    id: 4,
    name: "Tapis d'Éveil Sensoriel & Jouets en Bois",
    category: "Éveil & 1er Âge",
    price: "64,00 €",
    rating: 4,
    reviewsCount: 41,
    image: "/images/slide-5.jpg",
    slug: "/shop/puericulture/tapis-eveil-bois",
    badge: "Éveil Naturel",
    description: "Stimule la curiosité, la motricité fine et l'éveil sensoriel de bébé grâce à des matériaux naturels et durables.",
  },
];

const CATEGORIES = [
  "Tous",
  "Toilette & Bain",
  "Sommeil & Cocon",
  "Portage & Sécurité",
  "Éveil & 1er Âge",
];

export default function PuericultureShopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6E857B]/10 via-white to-[#6E857B]/5">
      
      {/* En-tête de l'univers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="bg-gradient-to-r from-[#6E857B]/20 via-[#6E857B]/10 to-white rounded-3xl p-6 sm:p-10 border border-[#333333]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#6E857B] text-white mb-3">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Univers 2 : Puériculture & Bébé
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight mb-3">
              Le Cocon de Bébé : Sécurité, Douceur et Tendresse
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Une sélection délicate de produits de puériculture, de soins hypoallergéniques et d'accessoires conçus pour envelopper bébé de sécurité, de confort et d'amour dès ses premiers jours.
            </p>
          </div>
          <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-xs sm:text-sm text-[#333333] font-medium min-w-[220px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Normes de sécurité CE & Oeko-Tex</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>100% Hypoallergénique</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Matériaux durables & naturels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de filtres par catégories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                idx === 0
                  ? "bg-[#333333] text-white"
                  : "bg-white text-[#333333] border border-[#333333]/10 hover:bg-[#333333]/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grille des produits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BABY_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative w-full h-64 bg-[#6E857B]/15 overflow-hidden flex items-center justify-center p-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#333333] shadow-sm uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="absolute bottom-4 left-4 bg-[#6E857B] text-white px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide flex items-center gap-1 shadow-sm">
                  <Heart className="w-3 h-3 fill-current" />
                  {product.badge}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                      <span className="text-xs text-[#333333]/60 font-medium ml-1">
                        ({product.reviewsCount})
                      </span>
                    </div>
                  </div>

                  <Link href={product.slug}>
                    <h2 className="font-extrabold text-base sm:text-lg text-[#333333] group-hover:text-black transition-colors line-clamp-1">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-[#333333]/70 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#333333]/5">
                  <span className="font-extrabold text-lg text-[#333333]">
                    {product.price}
                  </span>
                  <Link
                    href={product.slug}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Découvrir</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}