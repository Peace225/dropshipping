"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  Clock3,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductSection } from "./ProductSection";
import { useCart } from "@/context/cart-context"; // Importation du contexte du panier

const FEATURED_PRODUCTS = [
  {
    id: 1,
    universe: "Maman",
    universeColor: "bg-[#E8C5C8]",
    universeText: "text-[#333333]",
    name: "Coffret Maternité Essentiel",
    category: "Grossesse & Post-Partum",
    price: "49,00 €",
    numericPrice: 49,
    oldPrice: "69,00 €",
    discount: "-29%",
    rating: 5,
    image: "/images/slide-1.jpg",
  },
  {
    id: 2,
    universe: "Bébé",
    universeColor: "bg-[#6E857B]",
    universeText: "text-white",
    name: "Porte-Bébé Ergonomique Physiolock",
    category: "Soins & Tendresse",
    price: "89,00 €",
    numericPrice: 89,
    oldPrice: "119,00 €",
    discount: "-25%",
    rating: 5,
    image: "/images/slide-2.png",
  },
  {
    id: 3,
    universe: "Maman",
    universeColor: "bg-[#E8C5C8]",
    universeText: "text-[#333333]",
    name: "Huile Sèche Apaisante Post-Partum",
    category: "Bien-être & Vergetures",
    price: "29,00 €",
    numericPrice: 29,
    oldPrice: "39,00 €",
    discount: "-26%",
    rating: 4,
    image: "/images/slide-3.png",
  },
  {
    id: 4,
    universe: "Bébé",
    universeColor: "bg-[#6E857B]",
    universeText: "text-white",
    name: "Coussin d'Allaitement Bio Coton",
    category: "Allaitement & Confort",
    price: "45,00 €",
    numericPrice: 45,
    oldPrice: "59,00 €",
    discount: "-24%",
    rating: 5,
    image: "/images/slide-7.jpg",
  },
  {
    id: 5,
    universe: "Bébé",
    universeColor: "bg-[#6E857B]",
    universeText: "text-white",
    name: "Biberon Anti-Colique en Verre",
    category: "Repas & Repos",
    price: "19,00 €",
    numericPrice: 19,
    oldPrice: "24,00 €",
    discount: "-20%",
    rating: 5,
    image: "/images/slide-1.jpg",
  },
];

type FeaturedProduct = (typeof FEATURED_PRODUCTS)[number];

export function FeaturedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart(); // Utilisation du hook du panier

  const handleAddToCart = (product: FeaturedProduct) => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.numericPrice,
      image: product.image,
      category: product.category,
    });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <ProductSection
      title="Flash Vente AURAE"
      subtitle="Les essentiels de Maman & Bébé, sélectionnés à prix doux."
      viewAllLink="/ventes-flash"
    >
      <div className="col-span-full w-full">

        {/* BANDEAU VENTE FLASH */}
        <div className="mb-8 w-full rounded-2xl border border-[#333333]/10 bg-[#F5EBE6] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4A396] text-white">
                <Clock3 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#333333]/55">
                  Offre limitée
                </p>
                <p className="mt-1 text-sm font-medium leading-5 text-[#333333]">
                  Des essentiels à prix doux, pendant un temps limité.
                </p>
              </div>
            </div>

            {/* Compteur */}
            <div
              className="flex shrink-0 items-center gap-1.5"
              aria-label="Temps restant pour l'offre"
            >
              <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-sm">
                02
              </span>
              <span className="text-xs text-[#333333]/40">:</span>
              <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-sm">
                18
              </span>
              <span className="text-xs text-[#333333]/40">:</span>
              <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-sm">
                45
              </span>
              <span className="ml-1 text-[10px] text-[#333333]/50">
                restantes
              </span>
            </div>

          </div>
        </div>

        {/* CONTRÔLES CARROUSEL */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium text-[#333333]/60">
            {FEATURED_PRODUCTS.length} produits disponibles
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Défiler vers la gauche"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333333]/15 bg-white text-[#333333] shadow-sm transition-all hover:bg-[#F5EBE6] hover:text-[#D4A396] active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Défiler vers la droite"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333333]/15 bg-white text-[#333333] shadow-sm transition-all hover:bg-[#F5EBE6] hover:text-[#D4A396] active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CARROUSEL PRODUITS */}
        <div
          ref={scrollContainerRef}
          className="flex w-full gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="group relative flex w-[75%] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#333333]/10 bg-white snap-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[45%] lg:w-[calc(25%-15px)]"
            >
              {/* LIEN REDIRIGEANT DIRECTEMENT VERS LA PAGE VENTES FLASH */}
              <Link
                href="/ventes-flash"
                className="absolute inset-0 z-10"
                aria-label={`Voir ${product.name} sur la page des Ventes Flash`}
              />

              {/* BADGE PROMOTION */}
              <span className="absolute left-3 top-3 z-20 rounded-full bg-[#333333] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white">
                {product.discount}
              </span>

              {/* BADGE UNIVERS */}
              <span
                className={`absolute right-3 top-3 z-20 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${product.universeColor} ${product.universeText}`}
              >
                {product.universe}
              </span>

              {/* IMAGE */}
              <div className="relative block aspect-square w-full overflow-hidden bg-[#F5EBE6]/45">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 639px) 75vw, (max-width: 1023px) 45vw, 25vw"
                  className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-105 sm:p-7"
                />
              </div>

              {/* INFORMATIONS */}
              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <p className="mb-1.5 line-clamp-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6E857B] sm:text-[10px]">
                  {product.category}
                </p>

                <h3 className="line-clamp-2 min-h-[40px] text-xs font-semibold leading-5 text-[#333333] transition-colors group-hover:text-[#6E857B] sm:text-sm">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: product.rating }, (_, index) => (
                      <Star
                        key={index}
                        className="h-3 w-3 fill-current text-[#D4A396]"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#333333]/40">
                    {product.rating}.0
                  </span>
                </div>

                {/* PRIX + PANIER */}
                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-bold text-[#333333] sm:text-base">
                        {product.price}
                      </span>
                      <span className="text-[10px] text-[#333333]/40 line-through">
                        {product.oldPrice}
                      </span>
                    </div>
                    <p className="mt-1 text-[9px] font-medium text-[#6E857B]">
                      Offre Flash
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    aria-label={`Ajouter ${product.name} au panier`}
                    className="relative z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#333333] text-white shadow-sm transition-all duration-200 hover:bg-[#D4A396] hover:shadow-md active:scale-90 sm:h-10 sm:w-10"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA VERS LA PAGE VENTES FLASH */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/ventes-flash"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#333333] transition-colors duration-200 hover:text-[#D4A396]"
          >
            Découvrir toute la sélection Flash
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </ProductSection>
  );
}