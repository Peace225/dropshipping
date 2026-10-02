"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, Star, Clock3, ArrowRight, ChevronLeft, ChevronRight, Zap, ShieldCheck, Truck } from "lucide-react";
import { ProductSection } from "./ProductSection";
import { useCart } from "@/context/cart-context";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const PLACEHOLDER = "https://via.placeholder.com/600x600/F5EBE6/333333?text=ECLOSIA+BEBE";

const FILE_MAP: Record<string, string> = {
  "ballon-de-grossesse": "ballon-grossesse.jpg",
  "ballon-grossesse": "ballon-grossesse.jpg",
  "coussinets-d-allaitement-jetables": "coussinets-allaitement-jetables.jpg",
  "coussinets-allaitement-jetables": "coussinets-allaitement-jetables.jpg",
  "serviettes-apaisantes-post-accouchement": "serviettes-apaisantes-post-accouchement.jpg",
};

function cleanImageUrl(raw?: string){
  if(!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  return first.startsWith("http") ? first : PLACEHOLDER;
}

function resolveImageUrl(rawImg: string, slug: string): string {
  if (rawImg?.startsWith("http")) return rawImg;
  let fileName = rawImg?.trim().replace(/^aurae-images\//, "").replace(/^\//, "") || "";
  if (!fileName || !fileName.includes(".")) fileName = FILE_MAP[slug] || `${slug}.jpg`;
  if (FILE_MAP[slug]) fileName = FILE_MAP[slug];
  const { data } = supabase.storage.from("aurae-images").getPublicUrl(fileName);
  return data.publicUrl;
}

function getMarketingShort(p:any){
  const s = (p.slug + " " + p.name).toLowerCase();
  if(s.includes("50x100")) return "Matelas respirant + 3 draps ultra-doux + 2 alèses.";
  if(s.includes("40x80") || s.includes("40x90")) return "Le trio qui sauve les nuits. 3 draps + alèse.";
  if(s.includes("32x72")) return "Lot de 3 draps housse couffin ultra-doux.";
  if(s.includes("60x120")) return "3 draps housse + 2 alèses imperméables.";
  if(s.includes("90x190")) return "Matelas enfant déhoussable, mémoire de forme.";
  if(s.includes("culotte") || s.includes("couche")) return "Lavable, Oeko-Tex, fabrication UE.";
  if(s.includes("tapis") || s.includes("langer")) return "Nomade, pliable, imperméable. 🇫🇷";
  return "OEKO-TEX • Fabriqué France/UE • Lavable 60°";
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
      const { data: flashSale } = await supabase.from("flash_sales").select("ends_at").eq("is_active", true).order("created_at",{ascending:false}).limit(1).maybeSingle();
      if (flashSale?.ends_at) setFlashEndsAt(new Date(flashSale.ends_at));
      else setFlashEndsAt(new Date(Date.now() + 2*3600000 + 18*60000));

      let { data, error } = await supabase.from("products")
        .select(`id,name,slug,price,promo_price,original_price_backup,manufacturer_id,rubrique,brand,image_url,categories ( name, slug ),product_images ( image_url, is_primary, position )`)
        .eq("is_flash_sale", true).eq("is_active", true).order("price",{ascending:false}).limit(6);

      if (error) {
        const { data: fallback } = await supabase.from("products").select(`id,name,slug,price,promo_price,original_price_backup,manufacturer_id,rubrique,brand,image_url,product_images ( image_url, is_primary, position )`).eq("is_flash_sale", true).eq("is_active", true).limit(6);
        data = fallback as any;
      }

      if (!data?.length) { setLoading(false); return; }

      const manufIds = [...new Set(data.map((p:any)=>p.manufacturer_id).filter(Boolean))];
      let manufById: Record<string, any> = {};
      if (manufIds.length>0){
        const { data: manufs } = await supabase.from("manufacturers").select("id,label_fr,flag_emoji").in("id", manufIds);
        if (manufs) manufs.forEach(m=>{ manufById[m.id]=m; });
      }

      const formatted = data.map((item: any) => {
        const images = [...(item.product_images ?? [])].sort((a:any,b:any)=>(a.position??0)-(b.position??0));
        const rawImg = images.find((i:any)=>i.is_primary)?.image_url ?? images[0]?.image_url ?? item.image_url ?? "";
        const imageUrl = rawImg.startsWith("http") ? cleanImageUrl(rawImg) : resolveImageUrl(rawImg, item.slug);
        const fallbackFiles = Array.from(new Set([FILE_MAP[item.slug], `${item.slug}.jpg`, "ballon-grossesse.jpg"].filter(Boolean))) as string[];
        const originalPrice = Number(item.original_price_backup || item.price);
        const promoPrice = item.promo_price ? Number(item.promo_price) : Number((originalPrice*0.9).toFixed(2));
        const discountPercent = Math.round(((originalPrice-promoPrice)/originalPrice)*100);
        const catSlug = item.categories?.slug || "bebe";
        const isBebe = catSlug.toLowerCase().includes("bebe") || ["culotte","maillot","matelas","bébé","couche","tapis"].some(k=>item.name.toLowerCase().includes(k));
        const manuf = item.manufacturer_id ? manufById[item.manufacturer_id] : null;
        const fabLabel = manuf?.label_fr || item.brand || "Fabriqué en France/UE";
        const flag = manuf?.flag_emoji || "🇫🇷 🇪🇺";
        const short = getMarketingShort(item);

        return {
          id: item.id, name: item.name, slug: item.slug, shortDesc: short,
          categoryName: item.categories?.name || (isBebe?"Bébé":"Maman"),
          universe: isBebe?"Bébé":"Maman",
          price: `${promoPrice.toFixed(2).replace(".",",")} €`, numericPrice: promoPrice,
          oldPrice: `${originalPrice.toFixed(2).replace(".",",")} €`, originalNumeric: originalPrice,
          discount: `-${discountPercent || 10}%`,
          image: imageUrl, fallbackFiles,
          detailUrl: `/shop/${isBebe?"bebe":"maternite"}/${item.slug}`,
          flashListUrl: "/ventes-flash",
          fabrication: fabLabel,
          flag,
          reviewsCount: Math.floor(Math.random()*35)+22,
          stockLeft: 14,
          stockTotal: 40,
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
    <ProductSection title=" Vente Flash Exclusive -10%" subtitle="Des pépites indispensables Maman & Bébé à prix d'amie. Stocks ultra-limités !" viewAllLink="/ventes-flash">
      <div className="col-span-full w-full">
        
        {/* HEADER MARKETING ECLOSIA */}
        <div className="mb-8 w-full overflow-hidden rounded-2xl border border-[#333333]/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4A396]/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-[#333333] to-[#3D3D3D] p-5 sm:p-6 text-white gap-4 relative">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4A396] shadow-[0_0_20px_rgba(212,163,150,0.5)]"><Zap className="h-6 w-6 fill-current"/></span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-extrabold text-base sm:text-lg tracking-tight">Vente Flash -10%</h2>
                  <span className="bg-white/15 border border-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">Des produits • Stock limité</span>
                  <span className="hidden sm:inline-flex items-center gap-1 bg-[#6E857B] px-2.5 py-0.5 rounded-full text-xs font-bold"><ShieldCheck className="w-3 h-3"/> OEKO-TEX</span>
                </div>
                <p className="text-xs text-white/70 mt-1 flex items-center gap-2"><span>🔥 Ne tardez pas : livraison 10€ seulement !</span><span className="w-1 h-1 bg-white/30 rounded-full"></span><span>🇫🇷 🇪🇺 France/UE</span></p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-white/10 px-5 py-3 border border-white/10 backdrop-blur">
              <Clock3 className="h-5 w-5 text-[#D4A396]"/>
              {!countdown.expired ? (
                <div className="flex items-center gap-1">
                  <span className="bg-white text-[#333333] px-2 py-1 rounded-md font-mono text-xs font-extrabold">{String(countdown.h).padStart(2,"0")}</span>
                  <span className="text-white/50">:</span>
                  <span className="bg-white text-[#333333] px-2 py-1 rounded-md font-mono text-xs font-extrabold">{String(countdown.m).padStart(2,"0")}</span>
                  <span className="text-white/50">:</span>
                  <span className="bg-[#D4A396] text-white px-2 py-1 rounded-md font-mono text-xs font-extrabold">{String(countdown.s).padStart(2,"0")}</span>
                </div>
              ) : <span className="text-xs font-black text-red-300">Expirée</span>}
            </div>
          </div>
          <div className="bg-[#F5EBE6]/40 px-5 py-3 flex flex-wrap items-center gap-3 text-xs font-bold text-[#333333]/70">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#6E857B]"/>Livraison rapide dès 10,00 €</span>
            <span className="w-px h-3 bg-[#333333]/15 hidden sm:block"></span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#6E857B]"/>OEKO-TEX & Fabriqué France/UE</span>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold text-[#333]/60 tracking-wide">Des pépites • Glissez pour découvrir →</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>scroll("left")} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333]/15 bg-white shadow-sm hover:bg-[#F5EBE6] text-[#333] transition-colors cursor-pointer"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" onClick={()=>scroll("right")} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333]/15 bg-white shadow-sm hover:bg-[#F5EBE6] text-[#333] transition-colors cursor-pointer"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>

        {/* CAROUSEL SLIDE HORIZONTAL FLUIDE */}
        <div ref={scrollContainerRef} className="flex w-full gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {flashProducts.map((product) => {
            const pct = Math.round(((product.stockTotal-product.stockLeft)/product.stockTotal)*100);
            return (
              <article key={product.id} className="group relative flex w-[82%] sm:w-[42%] lg:w-[calc(33%-14px)] xl:w-[calc(25%-15px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#333333]/10 bg-white snap-start shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-500">
                
                {/* TOP BADGES - SÉCURISÉS EN HAUT */}
                <div className="absolute left-0 right-0 top-0 z-20 flex justify-between items-start p-3 pointer-events-none">
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className="pointer-events-auto rounded-full bg-[#333333] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">{product.discount} FLASH</span>
                    <span className="pointer-events-auto rounded-full bg-white/95 backdrop-blur border border-[#333333]/10 px-2 py-0.5 text-[9px] font-bold flex items-center gap-1 shadow-sm text-[#333333]"><span>{product.flag}</span><span className="truncate max-w-[70px]">{product.fabrication.split(" ").slice(0,2).join(" ")}</span></span>
                  </div>
                  <span className="pointer-events-auto rounded-full bg-white/95 backdrop-blur border border-[#333333]/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#333333] shadow-sm">{product.universe}</span>
                </div>

                <Link href={product.detailUrl} className="relative block aspect-square w-full overflow-hidden bg-gradient-to-b from-[#F5EBE6]/40 via-[#F5EBE6]/20 to-white pt-12">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-[1.08] transition-transform duration-700 mix-blend-multiply"
                    data-fallbacks={JSON.stringify(product.fallbackFiles)}
                    onError={(e)=>{
                      const img=e.currentTarget as any;
                      const fallbacks: string[]=JSON.parse(img.getAttribute("data-fallbacks")||"[]");
                      const idx=img._idx??0;
                      if(idx<fallbacks.length){ const {data}=supabase.storage.from("aurae-images").getPublicUrl(fallbacks[idx]); img._idx=idx+1; img.src=data.publicUrl; }
                      else { img.src=PLACEHOLDER; img.onerror=null; }
                    }}
                  />
                </Link>

                <div className="flex flex-1 flex-col p-4">
                  <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-[#6E857B]">{product.categoryName}</p>
                  <Link href={product.detailUrl}><h3 className="line-clamp-2 text-xs font-extrabold leading-snug text-[#333333] group-hover:text-[#6E857B] transition-colors min-h-[32px]">{product.name}</h3></Link>
                  <p className="text-[11px] text-[#333333]/60 mt-1 line-clamp-2 leading-relaxed">{product.shortDesc}</p>
                  <div className="mt-2.5 flex items-center gap-1 text-amber-500">{Array.from({length:4},(_,i)=><Star key={i} className="w-3 h-3 fill-current"/>)}<Star className="w-3 h-3 text-gray-200"/><span className="ml-1 text-[10px] text-[#333333]/50 font-medium">({product.reviewsCount})</span></div>
                  <div className="mt-3 flex items-baseline gap-2"><span className="font-extrabold text-sm text-[#333333]">{product.price}</span><span className="text-xs line-through text-[#333333]/40">{product.oldPrice}</span></div>
                  <div className="mt-3"><div className="mb-1.5 flex justify-between text-[10px] font-bold"><span className="text-[#333333]/60">Stock flash</span><span className="text-[#D4A396]">{product.stockLeft} restants</span></div><div className="h-1.5 w-full overflow-hidden rounded-full bg-[#333333]/10"><div className="h-full bg-gradient-to-r from-[#D4A396] to-[#C48A7D]" style={{width:`${pct}%`}}/></div></div>
                  
                  {/* BOUTON AJOUTER - LIBRE ET ACCESSIBLE */}
                  <button type="button" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); handleAddToCart(product);}} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#333333] hover:bg-black py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors relative z-10 cursor-pointer"><ShoppingBag className="h-4 w-4"/>Ajouter • -10%</button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/ventes-flash" className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#333333] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md hover:bg-black transition-all cursor-pointer">
            Découvrir toute la sélection Flash -10%
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </ProductSection>
  );
}