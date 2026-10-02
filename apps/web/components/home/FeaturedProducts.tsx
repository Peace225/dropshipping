"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, Star, Clock3, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductSection } from "./ProductSection";
import { useCart } from "@/context/cart-context";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const FILE_MAP: Record<string, string> = {
  "ballon-de-grossesse": "ballon-grossesse.jpg",
  "ballon-grossesse": "ballon-grossesse.jpg",
  "coussinets-d-allaitement-jetables": "coussinets-allaitement-jetables.jpg",
  "coussinets-allaitement-jetables": "coussinets-allaitement-jetables.jpg",
  "serviettes-apaisantes-post-accouchement": "serviettes-apaisantes-post-accouchement.jpg",
};

function resolveImageUrl(rawImg: string, slug: string): string {
  if (rawImg?.startsWith("http")) return rawImg;
  let fileName = rawImg?.trim().replace(/^aurae-images\//, "").replace(/^\//, "") || "";
  if (!fileName || !fileName.includes(".")) fileName = FILE_MAP[slug] || `${slug}.jpg`;
  if (FILE_MAP[slug]) fileName = FILE_MAP[slug];
  const { data } = supabase.storage.from("aurae-images").getPublicUrl(fileName);
  return data.publicUrl;
}

function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 18, s: 45, expired: false });
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0, expired: true }); return; }
      setTimeLeft({ h: Math.floor(diff/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000), expired: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

export function FeaturedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart() as any;
  const [flashProducts, setFlashProducts] = useState<any[]>([]);
  const [flashEndsAt, setFlashEndsAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown(flashEndsAt);

  useEffect(() => {
    async function fetchFlashSales() {
      const { data: flashSale } = await supabase.from("flash_sales").select("ends_at").eq("is_active", true).eq("slot_label","En ce moment").order("created_at",{ascending:false}).limit(1).single();
      if (flashSale?.ends_at) setFlashEndsAt(new Date(flashSale.ends_at));
      else setFlashEndsAt(new Date(Date.now() + 2*3600000 + 18*60000));

      // 6 PRODUITS POUR CAROUSEL
      const { data, error } = await supabase.from("products")
        .select(`id,name,slug,price,promo_price,original_price_backup,flash_sale_ends_at,is_flash_sale,is_active,categories ( name, slug ),product_images ( image_url, is_primary, position )`)
        .eq("is_flash_sale", true).eq("is_active", true).order("price",{ascending:false}).limit(6);

      if (error || !data?.length) { setLoading(false); return; }

      const formatted = data.map((item: any) => {
        const images = [...(item.product_images ?? [])].sort((a:any,b:any)=>(a.position??0)-(b.position??0));
        const rawImg = images.find((i:any)=>i.is_primary)?.image_url ?? images[0]?.image_url ?? "";
        const imageUrl = resolveImageUrl(rawImg, item.slug);
        const fallbackFiles = Array.from(new Set([FILE_MAP[item.slug], `${item.slug}.jpg`, "ballon-grossesse.jpg"].filter(Boolean))) as string[];
        const originalPrice = Number(item.original_price_backup || item.price);
        const promoPrice = item.promo_price ? Number(item.promo_price) : Number((originalPrice*0.9).toFixed(2));
        const discountPercent = Math.round(((originalPrice-promoPrice)/originalPrice)*100);
        const catSlug = item.categories?.slug || "maternite";
        const isBebe = catSlug.toLowerCase().includes("bebe") || ["culotte","maillot","matelas","bébé"].some(k=>item.name.toLowerCase().includes(k));

        return {
          id: item.id, name: item.name, slug: item.slug,
          categoryName: item.categories?.name || (isBebe?"Bébé":"Maman"),
          universe: isBebe?"Bébé":"Maternité",
          universeColor: isBebe?"bg-[#6E857B] text-white":"bg-[#E8C5C8] text-[#333333]",
          price: `${promoPrice.toFixed(2).replace(".",",")} €`, numericPrice: promoPrice,
          oldPrice: `${originalPrice.toFixed(2).replace(".",",")} €`, originalNumeric: originalPrice,
          discount: `-${discountPercent}%`, rating:5,
          image: imageUrl, fallbackFiles,
          detailUrl: `/shop/${isBebe?"bebe":"maternite"}/${item.slug}`,
          flashListUrl: "/ventes-flash",
        };
      });
      setFlashProducts(formatted);
      setLoading(false);
    }
    fetchFlashSales();
  }, []);

  const handleAddToCart = (product: any) => {
    if (addItem) addItem({ id: product.id, name: product.name, slug: product.slug, price: product.numericPrice, original_price: product.originalNumeric, priceFormatted: product.price, image: product.image, quantity: 1, is_flash_sale: true });
  };

  const scroll = (dir: "left"|"right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: dir==="left" ? -320 : 320, behavior: "smooth" });
    }
  };

  if (loading) return null;
  if (!flashProducts.length) return null;

  return (
    <ProductSection title="⚡ Vente Flash Exclusive -10%" subtitle="6 pépites indispensables Maman & Bébé à prix d'amie. Stocks ultra-limités !" viewAllLink="/ventes-flash">
      <div className="col-span-full w-full">
        {/* En-tête avec TIMER RÉEL & Texte Marketing */}
        <div className="mb-8 w-full rounded-2xl border border-[#333333]/10 bg-[#F5EBE6] px-4 py-4 sm:px-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4A396] text-white shadow-sm"><Clock3 className="h-4 w-4 animate-pulse" /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D4A396]">Chrono en main • -10% immédiat</p>
                <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#333333]">🔥Ne tardez pas : Des produits ultra-limités ... et la livraison est de 10€ !</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 self-center">
              {!countdown.expired ? (
                <>
                  <span className="flex h-8 sm:h-9 min-w-9 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-black text-white shadow">{String(countdown.h).padStart(2,"0")}</span>
                  <span className="text-xs font-bold text-[#333]/40">:</span>
                  <span className="flex h-8 sm:h-9 min-w-9 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-black text-white shadow">{String(countdown.m).padStart(2,"0")}</span>
                  <span className="text-xs font-bold text-[#333]/40">:</span>
                  <span className="flex h-8 sm:h-9 min-w-9 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-black text-white shadow">{String(countdown.s).padStart(2,"0")}</span>
                  <span className="ml-1 text-[11px] font-bold text-[#333]/70">⏱️ restantes</span>
                </>
              ) : <span className="text-xs font-black text-red-600 bg-red-100 px-3 py-1 rounded-full">Offre Expirée</span>}
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold text-[#333]/70 tracking-wide">✨ {flashProducts.length} pépites sélectionnées • Glissez pour découvrir →</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>scroll("left")} className="flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm hover:bg-[#F5EBE6] transition-colors"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={()=>scroll("right")} className="flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm hover:bg-[#F5EBE6] transition-colors"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>

        {/* CAROUSEL 6 PRODUITS */}
        <div ref={scrollContainerRef} className="flex w-full gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {flashProducts.map((product) => (
            <article key={product.id} className="group relative flex w-[78%] sm:w-[38%] lg:w-[calc(25%-12px)] xl:w-[calc(16.666%-13px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#333]/10 bg-white snap-start hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <span className="absolute left-3 top-3 z-20 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black text-white shadow-sm">{product.discount} FLASH</span>
              <span className={`absolute right-3 top-3 z-20 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${product.universeColor}`}>{product.universe}</span>
              
              <Link href={product.flashListUrl} className="relative block aspect-square w-full overflow-hidden bg-[#F5EBE6]/45">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-700 sm:p-7"
                  data-fallbacks={JSON.stringify(product.fallbackFiles)}
                  onError={(e)=>{
                    const img=e.currentTarget as any;
                    const fallbacks: string[]=JSON.parse(img.getAttribute("data-fallbacks")||"[]");
                    const idx=img._idx??0;
                    if(idx<fallbacks.length){ const {data}=supabase.storage.from("aurae-images").getPublicUrl(fallbacks[idx]); img._idx=idx+1; img.src=data.publicUrl; }
                    else { img.src="https://placehold.co/400x400/F5EBE6/a3a3a3?text=Bientot"; img.onerror=null; }
                  }}
                />
              </Link>

              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <p className="mb-1.5 line-clamp-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#D4A396]">{product.categoryName}</p>
                <Link href={product.detailUrl}><h3 className="line-clamp-2 text-xs font-bold leading-5 text-[#333] group-hover:text-[#D4A396] sm:text-sm min-h-[40px] hover:underline transition-colors">{product.name}</h3></Link>
                <div className="mt-3 flex items-center gap-1"><div className="flex gap-0.5">{Array.from({length:5},(_,i)=><Star key={i} className="h-3 w-3 fill-current text-[#D4A396]" />)}</div><span className="text-[11px] font-bold text-[#333]/50">5/5 (Avis vérifiés)</span></div>
                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-base font-extrabold text-[#333] sm:text-lg">{product.price}</span>
                      <span className="text-xs font-semibold line-through text-[#333]/40">{product.oldPrice}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] font-black text-red-600 uppercase">⚡ Économie immédiate</p>
                  </div>
                  <button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); handleAddToCart(product);}} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#333] text-white shadow-md hover:bg-[#D4A396] active:scale-95 transition-all" aria-label="Ajouter au panier"><ShoppingBag className="h-4 w-4" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/ventes-flash" className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#333] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md hover:bg-[#D4A396] transition-all">
            Découvrir toute la sélection Flash -10%
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </ProductSection>
  );
}