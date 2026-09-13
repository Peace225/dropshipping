"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Star } from "lucide-react";

// Exemple de données mockées pour les produits phares CORRIGÉES
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Coffret Maternité Essentiel",
    category: "Soins & Bio",
    price: "49,00 €",
    rating: 5,
    image: "/images/slide-1.jpg",
    slug: "/boutique/coffret-maternite-essentiel", // Lien corrigé
  },
  {
    id: 2,
    name: "Porte-Bébé Ergonomique Physiolock",
    category: "Puériculture",
    price: "89,00 €",
    rating: 5,
    image: "/images/slide-2.png",
    slug: "/boutique/porte-bebe-ergonomique", // Lien corrigé
  },
  {
    id: 3,
    name: "Huile Sèche Apaisante Post-Partum",
    category: "Clean Beauty",
    price: "29,00 €",
    rating: 4,
    image: "/images/slide-3.png",
    slug: "/boutique/huile-seche-apaisante", // Lien corrigé
  },
  {
    id: 4,
    name: "Coussin d'Allaitement Bio Coton",
    category: "Allaitement",
    price: "45,00 €",
    rating: 5,
    image: "/images/slide-7.jpg",
    slug: "/boutique/coussin-allaitement-bio", // Lien corrigé
  },
];

export function FeaturedProducts() {
  // Fonction pour gérer l'ajout au panier
  const handleAddToCart = (product: typeof FEATURED_PRODUCTS[0]) => {
    // Insérez ici la vraie logique de votre panier (Zustand, Redux, Context API, etc.)
    console.log("Ajouté au panier :", product);
    alert(`Le produit "${product.name}" a été ajouté à votre panier !`);
  };

  return (
    <ProductSection
      title="Les Indispensables AURAE"
      subtitle="Notre sélection coup de cœur plébiscitée par les mamans"
      viewAllLink="/boutique"
    >
      {FEATURED_PRODUCTS.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          {/* L'image est maintenant cliquable et mène aux détails */}
          <Link href={product.slug} className="block relative w-full h-52 bg-[#F5EBE6]/30 overflow-hidden p-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#333333] shadow-sm uppercase tracking-wider z-10">
              {product.category}
            </span>
          </Link>

          <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
            <div>
              <div className="flex items-center gap-1 mb-1 text-amber-500">
                {[...Array(product.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <Link href={product.slug}>
                <h3 className="font-bold text-sm sm:text-base text-[#333333] group-hover:text-black line-clamp-1 transition-colors">
                  {product.name}
                </h3>
              </Link>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#333333]/5">
              <span className="font-extrabold text-base text-[#333333]">
                {product.price}
              </span>
              
              {/* Le lien a été remplacé par un bouton interactif */}
              <button
                onClick={() => handleAddToCart(product)}
                className="inline-flex items-center justify-center p-2 rounded-full bg-[#333333] text-white hover:bg-black transition-all active:scale-95 shadow-sm"
                aria-label={`Ajouter ${product.name} au panier`}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </ProductSection>
  );
}