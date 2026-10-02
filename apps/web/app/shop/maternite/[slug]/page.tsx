"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, RotateCcw, Heart, MapPin, Home, ChevronRight, ChevronLeft, Package, Facebook, Twitter, MessageCircle, ShoppingCart, Flag, Truck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/context/cart-context";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PLACEHOLDER = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/placeholder.jpg";

function cleanImageUrl(raw?: string): string {
  if (!raw) return PLACEHOLDER;
  // Ton CSV avait des | -> on prend la première
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  if (!first) return PLACEHOLDER;
  // Si déjà une URL Supabase ou externe complète, on garde
  if (first.startsWith("http")) return first;
  // Si c'est juste un filename
  const fileName = first.split("/").pop() || first;
  return `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${fileName}`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const pathname = usePathname();
  const router = useRouter();
  const cart = useCart() as any;

  const [product, setProduct] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [univers, setUnivers] = useState<"bebe" | "maman" | "maternite">("bebe");

  const [locations, setLocations] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("relais");

  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction === "left" ? -250 : 250, behavior: "smooth" });
    }
  };

  const handleBuy = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      priceFormatted: product.priceFormatted,
      image: mainImage,
      quantity: 1,
      delivery: {
        method: deliveryMethod,
        region: selectedRegion,
        city: selectedCity,
        priceStr: activeDeliveryPriceStr
      }
    };
    if (cart?.addItem) cart.addItem(cartItem);
    else if (cart?.add) cart.add(cartItem);

    const s = JSON.stringify([cartItem]);
    localStorage.setItem("cart", s);
    localStorage.setItem("panier", s);
    localStorage.setItem("shopping_cart", s);
    localStorage.setItem("checkout_items", s);
    router.push("/checkout");
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined' && product?.slug) {
      const base = pathname?.includes("/bebe") ? "/shop/bebe" : pathname?.includes("/maman") || pathname?.includes("/maternite") ? "/shop/maman" : `/shop/${univers}`;
      return encodeURIComponent(`${window.location.origin}${base}/${product.slug}`);
    }
    return "";
  };

  const shareOnFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${getShareUrl()}`, "_blank");
  const shareOnTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${getShareUrl()}&text=${encodeURIComponent(`Découvrez ${product?.name} sur ECLOSIA ! `)}`, "_blank");
  const shareOnWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`Regarde ${product?.name} sur ECLOSIA : `)}${getShareUrl()}`, "_blank");

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      try {
        // ✅ FIX: maybeSingle au lieu de single() qui throw NotFound
        const { data: productData, error } = await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            price,
            description,
            category_id,
            categories ( slug, name ),
            product_images ( image_url, is_primary, position )
          `)
          .eq("slug", slug)
          .maybeSingle();

        if (error) {
          console.error("Erreur produit:", error);
          setLoading(false);
          return;
        }
        if (!productData) {
          setLoading(false);
          return;
        }

        // Détecte univers Bébé / Maman depuis la catégorie
        const catSlug = (productData.categories as any)?.slug || (pathname?.includes("bebe") ? "bebe" : "maman");
        if (catSlug === "bebe") setUnivers("bebe");
        else setUnivers("maman");

        const rawImgs = productData.product_images ?? [];
        const sorted = [...rawImgs].sort((a: any, b: any) => a.position - b.position);
        let formattedImages = sorted.map((img: any) => cleanImageUrl(img.image_url)).filter(Boolean);
        if (formattedImages.length === 0) formattedImages = [PLACEHOLDER];

        setProduct({
          ...productData,
          images: formattedImages,
          priceFormatted: `${Number(productData.price).toFixed(2).replace(".", ",")} €`,
          oldPriceFormatted: `${(Number(productData.price) * 1.25).toFixed(2).replace(".", ",")} €`,
          reviewsCount: Math.floor(Math.random() * 80) + 20,
        });
        setMainImage(formattedImages[0]);

        // Suggestions même univers
        if (productData.category_id) {
          const { data: sugg } = await supabase
            .from("products")
            .select(`id, name, slug, price, product_images ( image_url, is_primary, position )`)
            .eq("category_id", productData.category_id)
            .eq("is_active", true)
            .neq("id", productData.id)
            .limit(8);

          if (sugg) {
            setSuggestions(sugg.map((s: any) => {
              const imgs = [...(s.product_images ?? [])].sort((a: any, b: any) => a.position - b.position);
              const raw = imgs.find((i: any) => i.is_primary)?.image_url || imgs[0]?.image_url || "";
              return {
                id: s.id,
                name: s.name,
                price: `${Number(s.price).toFixed(2).replace(".", ",")} €`,
                image: cleanImageUrl(raw),
                slug: `${catSlug === "bebe" ? "bebe" : "maman"}/${s.slug}`,
              };
            }));
          }
        }

        const { data: regionsData } = await supabase.from("regions").select(`name, cities (name, relais_price, home_price)`).order("name");
        if (regionsData) {
          const loc: Record<string, any[]> = {};
          regionsData.forEach((r: any) => {
            if (r.cities) loc[r.name] = r.cities.sort((a: any, b: any) => a.name.localeCompare(b.name));
          });
          setLocations(loc);
          if (loc["Île-de-France"]?.length > 0) {
            setSelectedRegion("Île-de-France");
            setSelectedCity(loc["Île-de-France"][0].name);
          } else if (Object.keys(loc).length > 0) {
            const first = Object.keys(loc)[0];
            setSelectedRegion(first);
            setSelectedCity(loc[first]?.[0]?.name || "");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, pathname]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 flex items-center justify-center pt-20"><p className="font-bold animate-pulse">Chargement...</p></div>;
  }

  if (!product) {
    const backLink = pathname?.includes("bebe") ? "/shop/bebe" : "/shop/maman"; // unified: /shop/maman handles both /maman and /maternite
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 flex flex-col items-center justify-center gap-4 pt-20">
        <h1 className="text-2xl font-extrabold">Produit introuvable</h1>
        <p className="text-xs opacity-60">Slug: {slug}</p>
        <Link href={backLink} className="px-6 py-2.5 bg-[#333] text-white rounded-full font-bold text-sm">Retour à l'univers {univers}</Link>
      </div>
    );
  }

  const currentCityObj = locations[selectedRegion]?.find((c) => c.name === selectedCity);
  const relaisPriceStr = currentCityObj?.relais_price != null ? `${Number(currentCityObj.relais_price).toFixed(2).replace(".", ",")} €` : "3,90 €";
  const homePriceStr = currentCityObj?.home_price != null ? `${Number(currentCityObj.home_price).toFixed(2).replace(".", ",")} €` : "5,90 €";
  const activeDeliveryPriceStr = deliveryMethod === "relais" ? relaisPriceStr : homePriceStr;
  const backLink = univers === "bebe" ? "/shop/bebe" : "/shop/maman";
  const backLabel = univers === "bebe" ? "Retour à l'univers Bébé" : "Retour à l'univers Maman";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 pb-16 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Link href={backLink} className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333]/70 hover:text-[#333]"><ArrowLeft className="w-4 h-4" /><span>{backLabel}</span></Link>
          <div className="text-xs font-bold text-[#6E857B] bg-[#6E857B]/10 px-3 py-1 rounded-full flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#6E857B]"></span>ECLOSIA Secure</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-9 bg-white rounded-2xl border border-[#333]/10 shadow-sm flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-[45%] flex flex-col p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#333]/5 bg-[#6E857B]/5">
              <div className="relative w-full aspect-square flex items-center justify-center mb-4 bg-white rounded-xl border border-[#333]/5 p-4">
                {/* ✅ FIX: <img> sans onError et sans next/image */}
                <img src={mainImage} alt={product.name} className="object-contain w-full h-full p-4 mix-blend-multiply" loading="eager" />
                <button onClick={() => setIsFavorite(!isFavorite)} className={`absolute top-3 right-3 p-2 ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}><Heart className={`w-6 h-6 ${isFavorite ? "fill-current scale-110" : ""}`} /></button>
              </div>
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
                  {product.images.map((imgUrl: string, idx: number) => (
                    <button key={idx} onClick={() => setMainImage(imgUrl)} className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border bg-white ${mainImage === imgUrl ? "border-[#333]" : "border-[#333]/10"}`}>
                      <img src={imgUrl} alt={`Vue ${idx + 1}`} className="w-full h-full object-contain p-1 mix-blend-multiply" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
              <hr className="border-[#333]/10 my-2" />
              <div className="py-2">
                <p className="text-xs font-bold text-[#333] mb-3 uppercase">Partagez ce produit</p>
                <div className="flex items-center gap-3">
                  <button onClick={shareOnFacebook} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-blue-50"><Facebook className="w-4 h-4 fill-current" /></button>
                  <button onClick={shareOnTwitter} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-sky-50"><Twitter className="w-4 h-4 fill-current" /></button>
                  <button onClick={shareOnWhatsApp} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-green-50"><MessageCircle className="w-4 h-4" /></button>
                </div>
              </div>
              <hr className="border-[#333]/10 my-2" />
              <button className="text-left text-xs font-medium text-blue-600 hover:underline flex items-center gap-2 mt-2"><Flag className="w-3.5 h-3.5" />Signaler des informations incorrectes</button>
            </div>

            <div className="w-full md:w-[55%] flex flex-col p-4 sm:p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-[#6E857B] text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Boutique ECLOSIA</span>
                <span className="bg-[#333] text-white text-[10px] font-bold px-2 py-1 rounded uppercase">OEKO-TEX STANDARD</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#333] leading-snug mb-1.5">{product.name}</h1>
              <div className="text-xs text-gray-500 mb-4">Marque: <span className="text-[#6E857B] font-bold">ECLOSIA / Easy Dort</span></div>
              <hr className="border-[#333]/10 mb-4" />
              <div className="flex items-center gap-3 mb-1"><p className="text-3xl font-extrabold text-[#333]">{product.priceFormatted}</p><p className="text-base font-medium text-gray-400 line-through">{product.oldPriceFormatted}</p><span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">-20%</span></div>
              <p className="text-xs text-[#31A039] font-medium mb-1">En stock - Expédition rapide</p>
              <p className="text-[11px] text-[#333] mb-3">+ livraison à partir de <span className="font-bold">{activeDeliveryPriceStr}</span> vers <strong>{selectedCity || "votre adresse"}</strong></p>
              <div className="flex items-center gap-1.5 mb-5 text-amber-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 text-gray-300" /><span className="text-xs text-blue-600 ml-1">({product.reviewsCount} avis vérifiés)</span></div>
              <hr className="border-[#333]/10 mb-5" />
              <button onClick={handleBuy} className="w-full bg-[#333] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-6 transition-colors"><ShoppingCart className="w-5 h-5" />J'achète</button>
              <div className="mt-auto">
                <h3 className="text-[11px] font-bold uppercase mb-3">Promotions & Services</h3>
                <div className="flex flex-col gap-2 text-xs">
                  <p className="flex gap-2"><span className="bg-[#6E857B]/10 p-1 rounded">📞</span>Besoin d'aide pour commander, appelez nous au <strong>01 23 45 67 89</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#333]/10 shadow-sm">
            <div className="p-3.5 border-b bg-[#6E857B]/5 rounded-t-2xl flex justify-between items-center">
              <h3 className="font-extrabold text-[11px] uppercase">LIVRAISON & RETOURS</h3><span className="text-[9px] font-bold text-[#6E857B] bg-white border px-1.5 py-0.5 rounded flex items-center gap-1">ECLOSIA <Truck className="w-3 h-3" /></span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => setDeliveryMethod("relais")} className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-colors ${deliveryMethod === "relais" ? "border-[#333] bg-[#333] text-white" : "border-gray-200 text-gray-500"}`}><MapPin className="w-4 h-4 mb-1" /><span className="text-[11px] font-bold">Point Relais</span></button>
                <button onClick={() => setDeliveryMethod("domicile")} className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-colors ${deliveryMethod === "domicile" ? "border-[#333] bg-[#333] text-white" : "border-gray-200 text-gray-500"}`}><Home className="w-4 h-4 mb-1" /><span className="text-[11px] font-bold">À domicile</span></button>
              </div>
              <h4 className="text-[13px] font-bold mb-3">Choisissez le lieu</h4>
              <div className="flex flex-col gap-3 mb-5">
                <select className="w-full text-sm border rounded-xl p-2.5 bg-white" value={selectedRegion} onChange={(e) => { const nr = e.target.value; setSelectedRegion(nr); if (locations[nr]?.[0]) setSelectedCity(locations[nr][0].name); }}>
                  {Object.keys(locations).map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <select className="w-full text-sm border rounded-xl p-2.5 bg-white" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                  {(locations[selectedRegion] || []).map((c: any) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="border rounded-xl divide-y">
                <div className="p-3.5 flex items-start gap-3"><div className="p-2 border rounded shrink-0"><Package className="w-4 h-4" /></div><div className="flex-1"><div className="flex justify-between items-center mb-1"><p className="text-[13px] font-bold">{deliveryMethod === "relais" ? "Point relais" : "À domicile"}</p><span className="text-[11px] text-blue-600">Détails</span></div><p className="text-[11px]">Frais: <span className="font-bold text-[#6E857B]">{activeDeliveryPriceStr}</span></p><p className="text-[11px] opacity-80 leading-relaxed">Prêt pour retrait à <strong>{selectedCity || "votre région"}</strong> sous 48h à 72h.</p></div></div>
                <div className="p-3.5 flex items-start gap-3"><div className="p-2 border rounded shrink-0"><RotateCcw className="w-4 h-4" /></div><div className="flex-1"><p className="text-[13px] font-bold">Politique de retour</p><p className="text-[11px] opacity-80">Retours gratuits sur 10 jours. (Produits non ouverts).</p></div></div>
                <div className="p-3.5 flex items-start gap-3"><div className="p-2 border rounded shrink-0"><ShieldCheck className="w-4 h-4" /></div><div className="flex-1"><p className="text-[13px] font-bold">Garantie</p><p className="text-[11px] opacity-80">12 Mois - 100% bio et naturel certifié.</p></div></div>
              </div>
            </div>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#333]/10 shadow-sm">
            <div className="flex justify-between items-center mb-4"><h2 className="text-[15px] font-extrabold uppercase">Vous aimerez aussi - {univers}</h2><div className="flex gap-1.5"><button onClick={() => scrollSlider("left")} className="w-7 h-7 rounded-full border flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button><button onClick={() => scrollSlider("right")} className="w-7 h-7 rounded-full border flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button></div></div>
            <div ref={sliderRef} className="flex gap-3 overflow-x-auto scroll-smooth pb-2">
              {suggestions.map((item) => (
                <Link key={item.id} href={`/shop/${item.slug}`} className="group flex flex-col border rounded-xl hover:shadow-md bg-white shrink-0 w-[150px] sm:w-[180px] p-2">
                  <div className="relative w-full aspect-square bg-[#6E857B]/10 rounded-lg overflow-hidden mb-2 p-2 flex items-center justify-center"><img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform" loading="lazy" /></div>
                  <h3 className="text-[12px] line-clamp-2 mb-1 group-hover:text-[#6E857B]">{item.name}</h3><p className="font-extrabold text-[13px] mt-auto">{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
