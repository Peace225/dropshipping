"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";

// Données détaillées pour l'Univers Soins Maman
const MATERNITY_PRODUCTS = [
  {
    id: 1,
    name: "Huile Prévention & Correction Vergetures Bio",
    category: "Anti-vergetures",
    price: "34,00 €",
    rating: 5,
    reviewsCount: 128,
    image: "/images/slide-3.png",
    slug: "/shop/huile-vergetures",
    badge: "100% Naturel",
    description: "Formule haute tolérance enrichie en huiles végétales pures. Prévient et atténue visiblement l'apparence des vergetures dès le 1er trimestre.",
  },
  {
    id: 2,
    name: "Coussin de Grossesse & Allaitement XXL",
    category: "Confort & Sommeil",
    price: "65,00 €",
    rating: 5,
    reviewsCount: 94,
    image: "/images/slide-7.jpg",
    slug: "/shop/coussin-grossesse",
    badge: "Indispensable Nuits",
    description: "Soutien ergonomique complet pour soulager le dos, le ventre et les jambes pendant la grossesse et faciliter l'allaitement.",
  },
  {
    id: 3,
    name: "Baume Réparateur Intensif Post-Partum",
    category: "Post-Partum",
    price: "28,00 €",
    rating: 5,
    reviewsCount: 62,
    image: "/images/slide-1.jpg",
    slug: "/shop/baume-post-partum",
    badge: "Coup de cœur",
    description: "Apaise et régénère intensément les zones sensibilisées après l'accouchement. Compatible avec l'allaitement.",
  },
  {
    id: 4,
    name: "Ceinture de Maintien & Soutien de Grossesse",
    category: "Maintien & Bien-être",
    price: "39,00 €",
    rating: 4,
    reviewsCount: 45,
    image: "/images/slide-6.png",
    slug: "/shop/ceinture-soutien",
    badge: "Anti-douleurs dos",
    description: "Soulage efficacement les tensions lombaires et pelviennes en répartissant harmonieusement le poids du ventre.",
  },
  {
    id: 5,
    name: "Crème Riche Nourrissante Corps & Ventre",
    category: "Anti-vergetures",
    price: "29,00 €",
    rating: 5,
    reviewsCount: 77,
    image: "/images/slide-3.png",
    slug: "/shop/creme-riche-ventre",
    badge: "Texture Fondante",
    description: "Hydrate en profondeur et améliore l'élasticité de la peau grâce à un complexe exclusif d'actifs bio.",
  },
  {
    id: 6,
    name: "Soin Apaisant Allaitement & Mamelons",
    category: "Allaitement",
    price: "22,00 €",
    rating: 5,
    reviewsCount: 53,
    image: "/images/slide-1.jpg",
    slug: "/shop/soin-allaitement",
    badge: "Garanti sans rincage",
    description: "Protège et répare les mamelons sensibles ou irrités par les tétées. Ingrédients 100% d'origine naturelle.",
  },
];

const CATEGORIES = [
  "Tous",
  "Anti-vergetures",
  "Confort & Sommeil",
  "Post-Partum",
  "Maintien & Bien-être",
  "Allaitement",
];

export default function MaternityShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Filtrage des produits selon la catégorie active
  const filteredProducts = selectedCategory === "Tous"
    ? MATERNITY_PRODUCTS
    : MATERNITY_PRODUCTS.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20">
      
      {/* En-tête de l'univers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#E8C5C8]/30 to-[#F5EBE6] rounded-3xl p-6 sm:p-10 border border-[#333333]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8C5C8] text-[#333333] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Univers 1 : Soins & Cosmétique Maman
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight mb-3">
              Prendre soin de vous, de la grossesse au post-partum
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Des formules clean, 100% sécurisées et adaptées aux bouleversements de votre corps. Luttez efficacement contre les vergetures, soulagez vos nuits et vivez un post-partum serein.
            </p>
          </div>
          <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-xs sm:text-sm text-[#333333] font-medium min-w-[220px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>100% Compatible Allaitement</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Testé dermatologiquement</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Sans perturbateurs endocriniens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de filtres interactive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat, idx) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? "bg-[#333333] text-white"
                    : "bg-white text-[#333333] border border-[#333333]/10 hover:bg-[#333333]/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grille des produits filtrés */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#333333]/10">
            <p className="text-sm font-bold text-[#333333]/70">Aucun produit ne correspond à cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image enveloppée dans un Link */}
                <Link href={product.slug} className="relative w-full h-64 bg-[#E8C5C8]/20 overflow-hidden flex items-center justify-center p-6 block">
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
                  <span className="absolute bottom-4 left-4 bg-[#333333] text-white px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    {product.badge}
                  </span>
                </Link>

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
        )}
      </div>

    </div>
  );
}