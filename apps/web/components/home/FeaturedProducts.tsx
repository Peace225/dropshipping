"use client";

import { useState, useEffect, useRef } from "react";
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
import { useCart } from "@/context/cart-context";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function FeaturedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart() as any;

  const [flashProducts, setFlashProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlashSales() {
      const { data, error } = await supabase
       .from("products")
       .select(`
          id,
          name,
          slug,
          price,
          promo_price,
          is_flash_sale,
          is_active,
          categories ( name, slug ),
          product_images ( image_url, is_primary, position )
        `)
       .eq("is_active", true)
       .order("created_at", { ascending: false })
       .limit(12);

      if (error) {
        console.error("Erreur chargement ventes flash:", error);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      // Si on a des flash_sales, on les priorise, sinon on affiche tout
      const withFlag = data.filter((d: any) => d.is_flash_sale === true);
      const dataToUse = withFlag.length > 0? withFlag : data;

      const formatted = dataToUse.map((item: any) => {
        const images = [...(item.product_images?? [])].sort((a: any, b: any) => (a.position?? 0) - (b.position?? 0));
        const rawImg = images.find((img: any) => img.is_primary)?.image_url?? images[0]?.image_url?? "";
        // Si image_url est déjà une URL complète (cloudinary / supabase storage), on la garde telle quelle
        const imageUrl = rawImg.startsWith("http")
         ? rawImg
          : rawImg ? `${supabaseUrl}/storage/v1/object/public/aurae-images/${rawImg.split("/").pop()}`
          : "/placeholder.jpg";

        const originalPrice = Number(item.price);
        const promoPrice = item.promo_price? Number(item.promo_price) : originalPrice * 0.75;
        const discountPercent = originalPrice > 0? Math.round(((originalPrice - promoPrice) / originalPrice) * 100) : 0;

        const catSlug = item.categories?.slug || "maternite";
        const isBebe = catSlug.toLowerCase().includes("bebe") || item.name.toLowerCase().includes("bébé") || item.name.toLowerCase().includes("biberon");

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          categoryName: item.categories?.name || "Essentiel",
          universe: isBebe? "Bébé" : "Maternité",
          universeColor: isBebe? "bg-[#6E857B] text-white" : "bg-[#E8C5C8] text-[#333333]",
          price: `${promoPrice.toFixed(2).replace(".", ",")} €`,
          numericPrice: promoPrice,
          oldPrice: `${originalPrice.toFixed(2).replace(".", ",")} €`,
          discount: `-${discountPercent}%`,
          rating: 5,
          image: imageUrl,
          detailUrl: `/shop/${isBebe? "bebe" : "maternite"}/${item.slug}`,
        };
      });

      setFlashProducts(formatted);
      setLoading(false);
    }

    fetchFlashSales();
  }, []);

  const handleAddToCart = (product: any) => {
    if (addItem) {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.numericPrice,
        priceFormatted: product.price,
        image: product.image,
        quantity: 1,
      });
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left"? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) return null;
  if (flashProducts.length === 0) return null;

  return (
    <ProductSection
      title="Flash Vente ECLOSIA"
      subtitle="Les essentiels de Maman & Bébé, sélectionnés à prix doux."
      viewAllLink="/ventes-flash"
    >
      <div className="col-span-full w-full">
        <div className="mb-8 w-full rounded-2xl border border-[#333333]/10 bg-[#F5EBE6] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4A396] text-white">
                <Clock3 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#333333]/55">Offre limitée</p>
                <p className="mt-1 text-sm font-medium leading-5 text-[#333333]">Des essentiels à prix doux, pendant un temps limité.</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5" aria-label="Temps restant pour l'offre">
              <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-sm">02</span>
              <span className="text-xs text-[#333333]/40">:</span>
              <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-sm">18</span>
              <span className="text-xs text-[#333333]/40">:</span>
              <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-sm">45</span>
              <span className="ml-1 text-[10px] text-[#333333]/50">restantes</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium text-[#333333]/60">{flashProducts.length} produits disponibles</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => scroll("left")} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333333]/15 bg-white text-[#333333] shadow-sm hover:bg-[#F5EBE6] hover:text-[#D4A396] active:scale-95">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scroll("right")} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333333]/15 bg-white text-[#333333] shadow-sm hover:bg-[#F5EBE6] hover:text-[#D4A396] active:scale-95">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex w-full gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-5">
          {flashProducts.map((product) => (
            <article key={product.id} className="group relative flex w-[75%] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#333333]/10 bg-white snap-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[45%] lg:w-[calc(25%-15px)]">
              <span className="absolute left-3 top-3 z-20 rounded-full bg-[#333333] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white pointer-events-none">{product.discount}</span>
              <span className={`absolute right-3 top-3 z-20 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide pointer-events-none ${product.universeColor}`}>{product.universe}</span>
              <Link href="/ventes-flash" className="relative block aspect-square w-full overflow-hidden bg-[#F5EBE6]/45 cursor-pointer" aria-label="Voir toutes les ventes flash">
                <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 639px) 75vw, (max-width: 1023px) 45vw, 25vw" className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-105 sm:p-7" />
              </Link>
              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <p className="mb-1.5 line-clamp-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6E857B] sm:text-[10px]">{product.categoryName}</p>
                <Link href={product.detailUrl}>
                  <h3 className="line-clamp-2 min-h-[40px] text-xs font-semibold leading-5 text-[#333333] transition-colors group-hover:text-[#6E857B] sm:text-sm hover:underline">{product.name}</h3>
                </Link>
                <div className="mt-3 flex items-center gap-1">
                  <div className="flex items-center gap-0.5">{Array.from({ length: product.rating }, (_, index) => (<Star key={index} className="h-3 w-3 fill-current text-[#D4A396]" />))}</div>
                  <span className="text-[10px] text-[#333333]/40">{product.rating}.0</span>
                </div>
                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-bold text-[#333333] sm:text-base">{product.price}</span>
                      <span className="text-[10px] text-[#333333]/40 line-through">{product.oldPrice}</span>
                    </div>
                    <p className="mt-1 text-[9px] font-medium text-[#6E857B]">Offre Flash</p>
                  </div>
                  <button type="button" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }} aria-label={`Ajouter ${product.name} au panier`} className="relative z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#333333] text-white shadow-sm transition-all duration-200 hover:bg-[#D4A396] hover:shadow-md active:scale-90 sm:h-10 sm:w-10">
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/ventes-flash" className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#333333] transition-colors duration-200 hover:text-[#D4A396]">
            Découvrir toute la sélection Flash
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </ProductSection>
  );
}