"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";

// Données détaillées pour l'Univers Puériculture & Bébé
const BEBE_PRODUCTS = [
  {
    id: 1,
    name: "Kit Essentiel Naissance en Fibre de Bambou Bio",
    category: "Vêtement & Layette",
    price: "49,00 €",
    rating: 5,
    reviewsCount: 112,
    image: "/images/slide-1.jpg",
    slug: "/shop/bebe/kit-naissance-bambou",
    badge: "100% Bio",
    description: "Ultra-doux et hypoallergénique, ce kit complet enveloppe la peau fragile de nouveau-né dans un cocon de bien-être.",
  },
  {
    id: 2,
    name: "Gigoteuse Magique Évolutive 0-6 Mois",
    category: "Sommeil & Nuit",
    price: "45,00 €",
    rating: 5,
    reviewsCount: 88,
    image: "/images/slide-3.png",
    slug: "/shop/bebe/gigoteuse-evolutive",
    badge: "Sécurité Optimale",
    description: "Conçue pour garantir un sommeil sécurisé sans risque de recouvrement. Système d'ouverture pratique pour le change.",
  },
  {
    id: 3,
    name: "Coffret Repas Silicone Antidérapant",
    category: "Repas & Éveil",
    price: "35,00 €",
    rating: 5,
    reviewsCount: 64,
    image: "/images/slide-6.png",
    slug: "/shop/bebe/coffret-repas-silicone",
    badge: "Sans BPA",
    description: "Assiette à ventouse, bol, tasse d'apprentissage et couverts ergonomiques pour accompagner l'autonomie de bébé en douceur.",
  },
  {
    id: 4,
    name: "Tapis d'Éveil Sensoriel & Confort",
    category: "Éveil & Jeux",
    price: "79,00 €",
    rating: 4,
    reviewsCount: 51,
    image: "/images/slide-7.jpg",
    slug: "/shop/bebe/tapis-eveil-sensoriel",
    badge: "Éveil des sens",
    description: "Un espace de découverte molletonné avec arches de jeux amovibles, textures variées et hochets sonores stimulants.",
  },
  {
    id: 5,
    name: "Sortie de Bain Capuche Ourson Douillette",
    category: "Bain & Soins",
    price: "29,00 €",
    rating: 5,
    reviewsCount: 42,
    image: "/images/slide-1.jpg",
    slug: "/shop/bebe/sortie-de-bain",
    badge: "Ultra Absorbant",
    description: "Éponge bouclette de coton épais certifié Oeko-Tex pour envelopper bébé de chaleur après le bain.",
  },
  {
    id: 6,
    name: "Veilleuse Musicale Nomade Apaisante",
    category: "Sommeil & Nuit",
    price: "32,00 €",
    rating: 5,
    reviewsCount: 76,
    image: "/images/slide-3.png",
    slug: "/shop/bebe/veilleuse-nomade",
    badge: "Coup de cœur",
    description: "Diffuse une lumière douce et des berceuses relaxantes pour rassurer bébé et l'aider à s'endormir paisiblement.",
  },
];

const CATEGORIES = [
  "Tous",
  "Vêtement & Layette",
  "Sommeil & Nuit",
  "Repas & Éveil",
  "Éveil & Jeux",
  "Bain & Soins",
];

export default function BebeShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Filtrage dynamique des produits
  const filteredProducts = selectedCategory === "Tous"
    ? BEBE_PRODUCTS
    : BEBE_PRODUCTS.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20">
      
      {/* En-tête de l'univers Bébé */}
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
              Univers 2 : Puériculture & Bébé
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight mb-3">
              L'essentiel pour grandir en toute sécurité
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Des produits pensés pour le confort, l'éveil et la sécurité de votre bébé. Des matières certifiées douces, saines et respectueuses de sa peau délicate.
            </p>
          </div>
          <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-xs sm:text-sm text-[#333333] font-medium min-w-[220px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Certifié Oeko-Tex & Sans BPA</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Conforme aux normes européennes</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Matériaux 100% respectueux</span>
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
                <div className="relative w-full h-64 bg-[#E8C5C8]/20 overflow-hidden flex items-center justify-center p-6">
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
        )}
      </div>

    </div>
  );
}