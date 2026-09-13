import Image from "next/image";
import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Star, Heart } from "lucide-react";

// Données mockées pour les soins et accessoires de bébé (douceur, éveil et sécurité)
const BABY_CARE_PRODUCTS = [
  {
    id: 1,
    name: "Coffret Bain & Soins Bio Ultra-Doux",
    category: "Toilette & Bain",
    price: "36,00 €",
    rating: 5,
    image: "/images/slide-1.jpg",
    slug: "/shop/bebe/coffret-bain-bio",
    badge: "Hypoallergénique",
  },
  {
    id: 2,
    name: "Nid d'Ange & Gigoteuse Cocon Coton Bio",
    category: "Sommeil & Cocon",
    price: "52,00 €",
    rating: 5,
    image: "/images/slide-8.jpg",
    slug: "/shop/bebe/gigoteuse-cocon",
    badge: "Douceur Nuit",
  },
  {
    id: 3,
    name: "Porte-Bébé Physiologique Évolutif",
    category: "Portage & Sécurité",
    price: "89,00 €",
    rating: 5,
    image: "/images/slide-2.png",
    slug: "/shop/bebe/porte-bebe-physio",
    badge: "Physiologique",
  },
  {
    id: 4,
    name: "Tapis d'Éveil Sensoriel & Jouets en Bois",
    category: "Éveil & 1er Âge",
    price: "64,00 €",
    rating: 4,
    image: "/images/slide-5.jpg",
    slug: "/shop/bebe/tapis-eveil-bois",
    badge: "Éveil Naturel",
  },
];

export function BabyCareSection() {
  return (
    <ProductSection
      title="Le Cocon de Bébé : Soins & Tendresse"
      subtitle="Une sélection délicate de produits de puériculture, de soins hypoallergéniques et d'accessoires conçus pour envelopper bébé de sécurité et d'amour"
      viewAllLink="/shop/bebe"
    >
      {BABY_CARE_PRODUCTS.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <div className="relative w-full h-52 bg-[#6E857B]/15 overflow-hidden flex items-center justify-center p-4">
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
            <span className="absolute bottom-3 left-3 bg-[#6E857B] text-white px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-wide flex items-center gap-1 shadow-sm">
              <Heart className="w-2.5 h-2.5 fill-current" />
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