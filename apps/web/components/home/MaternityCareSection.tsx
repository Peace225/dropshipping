import Image from "next/image";
import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Star, Sparkles } from "lucide-react";

// Données mockées pour les soins et accessoires maman (grossesse & post-partum)
const MATERNITY_CARE_PRODUCTS = [
  {
    id: 1,
    name: "Coussin de Grossesse & Allaitement XXL",
    category: "Confort & Sommeil",
    price: "65,00 €",
    rating: 5,
    image: "/images/slide-7.jpg",
    slug: "/shop/maternite/coussin-grossesse",
    badge: "Indispensable Nuits",
  },
  {
    id: 2,
    name: "Huile Prévention & Correction Vergetures",
    category: "Soins Bio",
    price: "34,00 €",
    rating: 5,
    image: "/images/slide-3.png",
    slug: "/shop/maternite/huile-vergetures",
    badge: "100% Naturel",
  },
  {
    id: 3,
    name: "Ceinture de Maintien & Soutien de Grossesse",
    category: "Maintien & Bien-être",
    price: "39,00 €",
    rating: 4,
    image: "/images/slide-6.png",
    slug: "/shop/maternite/ceinture-soutien",
    badge: "Anti-douleurs dos",
  },
  {
    id: 4,
    name: "Baume Réparateur Intensif Post-Partum",
    category: "Post-Partum",
    price: "28,00 €",
    rating: 5,
    image: "/images/slide-1.jpg",
    slug: "/shop/maternite/baume-post-partum",
    badge: "Coup de cœur",
  },
];

export function MaternityCareSection() {
  return (
    <ProductSection
      title="Spécial Maman : Grossesse & Post-Partum"
      subtitle="Des soins experts et des accessoires ergonomiques pour prendre soin de vous avant et après l'arrivée de bébé"
      viewAllLink="/shop/maternite"
    >
      {MATERNITY_CARE_PRODUCTS.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <div className="relative w-full h-52 bg-[#E8C5C8]/20 overflow-hidden flex items-center justify-center p-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#333333] shadow-sm uppercase tracking-wider">
              {product.category}
            </span>
            <span className="absolute bottom-3 left-3 bg-[#333333] text-white px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-wide flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              {product.badge}
            </span>
          </div>

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
              <Link
                href={product.slug}
                className="inline-flex items-center justify-center p-2 rounded-full bg-[#333333] text-white hover:bg-black transition-all active:scale-95 shadow-sm"
                aria-label={`Acheter ${product.name}`}
              >
                <ShoppingBag className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </ProductSection>
  );
}