import Image from "next/image";
import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialisation du client Supabase (utilise les clés publiques)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function BabyCareSection() {
  // 1. Récupération des données depuis Supabase
  // On récupère les produits, on filtre sur la catégorie "bebe" et on inclut l'image
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      categories!inner(slug),
      product_images(image_url, is_primary)
    `)
    .eq("categories.slug", "bebe")
    .eq("is_active", true)
    .limit(4); // On limite à 4 produits pour cette section

  if (error) {
    console.error("Erreur lors de la récupération des produits bébé:", error);
  }

  // 2. Formatage des données pour correspondre à l'affichage
  const dynamicProducts = products?.map((product: any) => {
    // On cherche l'image définie comme principale (is_primary: true), sinon on prend la première
    const primaryImage = product.product_images?.find((img: any) => img.is_primary) 
                         || product.product_images?.[0];

    return {
      id: product.id,
      name: product.name,
      category: "Univers Bébé",
      price: `${Number(product.price).toFixed(2)} €`,
      rating: 5, // Par défaut, ou à relier à vos vrais avis plus tard
      image: primaryImage?.image_url || "/images/placeholder.jpg",
      slug: `/shop/bebe/${product.slug}`, // Lien dynamique vers la page du produit
      badge: "Coup de cœur",
    };
  }) || [];

  // 3. Rendu de la section
  return (
    <ProductSection
      title="Le Cocon de Bébé : Soins & Tendresse"
      subtitle="Une sélection délicate de produits de puériculture, de soins hypoallergéniques et d'accessoires conçus pour envelopper bébé de sécurité et d'amour"
      viewAllLink="/shop/bebe"
    >
      {/* Si aucun produit n'est trouvé, on affiche un petit message optionnel */}
      {dynamicProducts.length === 0 && (
        <p className="text-gray-500 text-center w-full py-10">Aucun produit disponible pour le moment.</p>
      )}

      {dynamicProducts.map((product) => (
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