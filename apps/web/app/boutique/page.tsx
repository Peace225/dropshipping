"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Sparkles, Star, ShieldCheck } from "lucide-react";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Huile Prévention & Correction Vergetures Bio",
    category: "Maternité",
    subCategory: "Anti-vergetures",
    price: "34,00 €",
    rating: 5,
    reviewsCount: 48,
    image: "/images/slide-3.png",
    slug: "/shop/maternite/huile-vergetures",
    description: "Nourrit intensément et améliore l'élasticité de la peau pendant et après la grossesse.",
    bgClass: "bg-[#E8C5C8]/20",
  },
  {
    id: 2,
    name: "Nid d'Ange & Gigoteuse Cocon Coton Bio",
    category: "Puériculture",
    subCategory: "Sommeil & Cocon",
    price: "52,00 €",
    rating: 5,
    reviewsCount: 32,
    image: "/images/slide-8.jpg",
    slug: "/shop/puericulture/gigoteuse-cocon",
    description: "Régulation thermique idéale (TOG 2.0) pour des nuits paisibles et enveloppantes.",
    bgClass: "bg-[#6E857B]/15",
  },
  {
    id: 3,
    name: "Coussin de Grossesse & Allaitement XXL",
    category: "Maternité",
    subCategory: "Confort & Sommeil",
    price: "68,00 €",
    rating: 5,
    reviewsCount: 64,
    image: "/images/slid.png",
    slug: "/shop/maternite/coussin-grossesse",
    description: "Soutien ergonomique d'exception pour soulager le dos et les jambes au quotidien.",
    bgClass: "bg-[#F5EBE6]/60",
  },
  {
    id: 4,
    name: "Coffret Naissance Essentiel Bébé Bio",
    category: "Puériculture",
    subCategory: "Coffrets Naissance",
    price: "45,00 €",
    rating: 5,
    reviewsCount: 29,
    image: "/images/slide-1.jpg",
    slug: "/shop/puericulture/coffret-naissance",
    description: "Un ensemble complet en coton bio incluant bonnet, bavoir, petits chaussons et sortie de bain.",
    bgClass: "bg-[#6E857B]/15",
  },
  {
    id: 5,
    name: "Baume Réparateur Post-Partum & Allaitement",
    category: "Maternité",
    subCategory: "Post-Partum",
    price: "28,00 €",
    rating: 5,
    reviewsCount: 41,
    image: "/images/slide-2.jpg",
    slug: "/shop/maternite/baume-reparateur",
    description: "Apaise et protège les zones fragilisées avec des ingrédients 100% naturels et compatibles.",
    bgClass: "bg-[#E8C5C8]/20",
  },
  {
    id: 6,
    name: "Poussette Compacte Ultra-Légère Nomade",
    category: "Puériculture",
    subCategory: "Balade & Sorties",
    price: "249,00 €",
    rating: 5,
    reviewsCount: 18,
    image: "/images/slide-6.png",
    slug: "/shop/puericulture/poussette-compacte",
    description: "Maniable, légère et homologuée cabine d'avion pour simplifier les déplacements des parents.",
    bgClass: "bg-[#6E857B]/15",
  }
];

const FILTERS = ["Tous", "Anti-vergetures", "Confort & Sommeil", "Post-Partum", "Sommeil & Cocon", "Coffrets Naissance", "Balade & Sorties"];

export default function BoutiquePage() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filteredProducts = activeFilter === "Tous" 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.subCategory === activeFilter);

  const materniteProducts = filteredProducts.filter((p) => p.category === "Maternité");
  const puericultureProducts = filteredProducts.filter((p) => p.category === "Puériculture");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil AURAE</span>
        </Link>

        {/* En-tête de la Boutique (Catalogue Global) */}
        <div className="bg-[#F5EBE6]/40 p-6 sm:p-10 rounded-3xl border border-[#E8C5C8]/40 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8C5C8]/40 text-[#333333] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#6E857B]" />
              Catalogue Général AURAE
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight">
              Tous nos essentiels Maternité & Puériculture
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-2 max-w-2xl">
              Découvrez l'ensemble de nos collections pensées pour le bien-être des futures mamans, le post-partum et le confort de bébé en France.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-[#333333]/10 shadow-xs flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-[#333333]">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>100% Compatible Allaitement</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#333333]">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Testé dermatologiquement</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#333333]">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Sans perturbateurs endocriniens</span>
            </div>
          </div>
        </div>

        {/* Barre de Filtres par Catégories / Sous-catégories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all shrink-0 shadow-xs ${
                activeFilter === filter
                  ? "bg-[#333333] text-white shadow-md"
                  : "bg-white text-[#333333] border border-[#333333]/15 hover:border-[#333333]/40"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* SECTION 1 : UNIVERS MATERNITÉ */}
        {materniteProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#333333] tracking-tight flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E8C5C8]"></span>
                Univers Maternité (Soins & Confort)
              </h2>
              <span className="text-xs font-bold text-[#333333]/60">
                {materniteProducts.length} produit{materniteProducts.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materniteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2 : UNIVERS PUÉRICULTURE */}
        {puericultureProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#333333] tracking-tight flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#6E857B]"></span>
                Univers Puériculture (Bébé & Éveil)
              </h2>
              <span className="text-xs font-bold text-[#333333]/60">
                {puericultureProducts.length} produit{puericultureProducts.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {puericultureProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#333333]/10">
            <p className="text-sm font-bold text-[#333333]/60">Aucun produit ne correspond à ce filtre pour le moment.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// Composant interne réutilisable pour afficher chaque carte produit
function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col justify-between group hover:border-[#333333]/30 transition-all">
      <div>
        {/* Enveloppement de l'image dans un Link pour la rendre cliquable */}
        <Link href={product.slug} className="block">
          <div className={`relative w-full h-56 ${product.bgClass} rounded-2xl overflow-hidden mb-4 flex items-center justify-center cursor-pointer`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#333333] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider z-10">
              {product.subCategory}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1 text-amber-500 mb-1">
          {[...Array(product.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
          <span className="text-[11px] text-[#333333]/60 font-bold ml-1">({product.reviewsCount})</span>
        </div>

        <Link href={product.slug}>
          <h3 className="font-extrabold text-sm sm:text-base text-[#333333] hover:text-black line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#333333]/70 line-clamp-2 mb-4">
          {product.description}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-[#333333]/10">
        <span className="text-base font-extrabold text-[#333333]">{product.price}</span>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  );
}