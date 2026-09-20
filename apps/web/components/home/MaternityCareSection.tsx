import Image from "next/image";
import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Star, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function MaternityCareSection() {
  const supabase = await createClient();

  // ============================================================
  // RÉCUPÉRATION DES PRODUITS MAMAN
  // ============================================================

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      is_featured,
      categories!inner (
        slug
      ),
      product_images (
        id,
        image_url,
        is_primary,
        position
      )
    `)
    .eq("categories.slug", "maman")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  // ============================================================
  // GESTION ERREUR SUPABASE
  // ============================================================

  if (error) {
    console.error(
      "Erreur de récupération des produits Maman :",
      error
    );

    return null;
  }

  // ============================================================
  // FORMATAGE DES PRODUITS & STORAGE SUPABASE
  // ============================================================

  const formattedProducts =
    products?.map((product) => {
      // Trier les images par position
      const images = [...(product.product_images ?? [])].sort(
        (a, b) => a.position - b.position
      );

      const rawImage =
        images.find((image) => image.is_primary)?.image_url ??
        images[0]?.image_url ??
        "placeholder.jpg";

      // Nettoie l'URL ou extrait uniquement le nom du fichier pour cibler Supabase Storage
      const fileName = rawImage.includes("/") 
        ? rawImage.split("/").pop() 
        : rawImage;

      // Construction automatique de l'URL publique Supabase Storage
      const supabaseStorageUrl = `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${fileName}`;

      return {
        id: product.id,
        name: product.name,
        category: "Maternité",
        price: `${Number(product.price)
          .toFixed(2)
          .replace(".", ",")} €`,
        rating: 5,
        image: supabaseStorageUrl,
        slug: `/shop/maternite/${product.slug}`,
        badge: "Coup de cœur",
      };
    }) ?? [];

  // ============================================================
  // AUCUN PRODUIT
  // ============================================================

  if (formattedProducts.length === 0) {
    return null;
  }

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <ProductSection
      title="Spécial Maman : Grossesse & Post-Partum"
      subtitle="Des soins experts et des accessoires ergonomiques pour prendre soin de vous avant et après l'arrivée de bébé"
      viewAllLink="/shop/maternite"
    >
      {formattedProducts.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          {/* =====================================================
              IMAGE
          ===================================================== */}

          <div className="relative w-full h-52 bg-[#E8C5C8]/20 overflow-hidden flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Catégorie */}

            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#333333] shadow-sm uppercase tracking-wider">
              {product.category}
            </span>

            {/* Badge */}

            <span className="absolute bottom-3 left-3 bg-[#333333] text-white px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-wide flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              {product.badge}
            </span>
          </div>

          {/* =====================================================
              INFORMATIONS PRODUIT
          ===================================================== */}

          <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
            <div>
              {/* Étoiles */}

              <div className="flex items-center gap-1 mb-1 text-amber-500">
                {[...Array(product.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-current"
                  />
                ))}
              </div>

              {/* Nom */}

              <Link href={product.slug}>
                <h3 className="font-bold text-sm sm:text-base text-[#333333] group-hover:text-black line-clamp-1 transition-colors">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* =================================================
                PRIX + PANIER
            ================================================= */}

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