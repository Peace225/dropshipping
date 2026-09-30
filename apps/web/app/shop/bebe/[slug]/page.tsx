"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, RotateCcw, Heart, MapPin, Home, ChevronRight, ChevronLeft, Package, Facebook, Twitter, MessageCircle, Phone, ShoppingCart, Flag, Truck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/context/cart-context";

// Initialisation du client Supabase côté client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BebeProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter(); 
  const cart = useCart() as any;

  const [product, setProduct] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // États pour la logistique
  const [locations, setLocations] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("relais");

  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = direction === "left" ? -250 : 250;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleBuy = () => {
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

    if (cart && typeof cart.addItem === "function") {
      cart.addItem(cartItem);
    } else if (cart && typeof cart.add === "function") {
      cart.add(cartItem);
    }

    const serializedItem = JSON.stringify([cartItem]);
    localStorage.setItem("cart", serializedItem);
    localStorage.setItem("panier", serializedItem);
    localStorage.setItem("shopping_cart", serializedItem);
    localStorage.setItem("checkout_items", serializedItem);

    router.push("/checkout");
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined' && product?.slug) {
      return encodeURIComponent(`${window.location.origin}/shop/bebe/${product.slug}`);
    }
    return "";
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${getShareUrl()}`, "_blank");
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Découvrez ${product?.name} sur ECLOSIA ! `);
    window.open(`https://twitter.com/intent/tweet?url=${getShareUrl()}&text=${text}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Regarde ça, j'ai trouvé ${product?.name} sur ECLOSIA : `);
    window.open(`https://wa.me/?text=${text}${getShareUrl()}`, "_blank");
  };

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      // 1. Récupérer l'ID de la catégorie "bebe"
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .ilike("slug", "%bebe%")
        .single();

      // 2. Récupération du produit actuel par son slug
      let query = supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          price,
          description,
          image_url,
          product_images ( image_url, is_primary, position )
        `)
        .eq("slug", slug);

      if (catData) {
        query = query.eq("category_id", catData.id);
      }

      const { data: productData, error: productError } = await query.single();

      if (productError || !productData) {
        console.error("Erreur de chargement du produit :", productError);
        setLoading(false);
        return;
      }

      if (productData) {
        const rawImages = productData.product_images ?? [];
        let formattedImages: string[] = [];

        if (rawImages.length > 0) {
          const sortedImages = [...rawImages].sort((a, b) => a.position - b.position);
          formattedImages = sortedImages.map((img: any) => img.image_url);
        } else if (productData.image_url) {
          formattedImages = productData.image_url.includes('|') 
            ? productData.image_url.split('|').map((s: string) => s.trim())
            : [productData.image_url];
        }

        if (formattedImages.length === 0) {
          formattedImages.push("https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/baignoire-twistshake.jpg");
        }

        setProduct({
          ...productData,
          images: formattedImages,
          priceFormatted: `${Number(productData.price || 0).toFixed(2).replace(".", ",")} €`,
          oldPriceFormatted: `${(Number(productData.price || 0) * 1.25).toFixed(2).replace(".", ",")} €`,
          reviewsCount: Math.floor(Math.random() * 80) + 20,
        });
        setMainImage(formattedImages[0]);

        // 3. Récupération des suggestions dans la même catégorie
        if (catData) {
          const { data: suggestionsData } = await supabase
            .from("products")
            .select(`
              id, name, slug, price, image_url,
              product_images ( image_url, is_primary, position )
            `)
            .eq("category_id", catData.id)
            .eq("is_active", true)
            .neq("id", productData.id)
            .limit(8);

          if (suggestionsData) {
            const formattedSuggestions = suggestionsData.map((sug: any) => {
              const rawImg = sug.image_url || "";
              const sugImg = rawImg.includes('|') ? rawImg.split('|')[0].trim() : rawImg.trim();

              return {
                id: sug.id,
                name: sug.name,
                price: `${Number(sug.price || 0).toFixed(2).replace(".", ",")} €`,
                image: sugImg || "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/baignoire-twistshake.jpg",
                slug: `/shop/bebe/${sug.slug}`
              };
            });
            setSuggestions(formattedSuggestions);
          }
        }

        // 4. Récupération des régions et villes pour la livraison
        const { data: regionsData } = await supabase
          .from("regions")
          .select(`name, cities (name, relais_price, home_price)`)
          .order("name");

        if (regionsData) {
          const fetchedLocations: Record<string, any[]> = {};
          
          regionsData.forEach((region: any) => {
            if (region.cities) {
              fetchedLocations[region.name] = region.cities.sort((a: any, b: any) => a.name.localeCompare(b.name));
            }
          });
          
          setLocations(fetchedLocations);

          if (fetchedLocations["Île-de-France"] && fetchedLocations["Île-de-France"].length > 0) {
            setSelectedRegion("Île-de-France");
            setSelectedCity(fetchedLocations["Île-de-France"][0].name);
          } else if (Object.keys(fetchedLocations).length > 0) {
            const firstRegion = Object.keys(fetchedLocations)[0];
            setSelectedRegion(firstRegion);
            setSelectedCity(fetchedLocations[firstRegion].length > 0 ? fetchedLocations[firstRegion][0].name : "");
          }
        }
      }
      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 flex items-center justify-center pt-20">
        <p className="font-bold text-[#333333]/70 animate-pulse">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 flex flex-col items-center justify-center gap-4 pt-20">
        <h1 className="text-2xl font-extrabold text-[#333333]">Produit introuvable</h1>
        <Link href="/shop/bebe" className="px-6 py-2.5 bg-[#333333] text-white rounded-full font-bold text-sm">
          Retour à la boutique bébé
        </Link>
      </div>
    );
  }

  const currentCityObj = locations[selectedRegion]?.find((c) => c.name === selectedCity);
  
  const relaisPriceStr = currentCityObj?.relais_price != null 
    ? `${Number(currentCityObj.relais_price).toFixed(2).replace(".", ",")} €` 
    : "3,99 €";
    
  const homePriceStr = currentCityObj?.home_price != null 
    ? `${Number(currentCityObj.home_price).toFixed(2).replace(".", ",")} €` 
    : "6,99 €";

  const activeDeliveryPriceStr = deliveryMethod === "relais" ? relaisPriceStr : homePriceStr;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 pb-16 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête : Fil d'Ariane */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/shop/bebe" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'univers Bébé</span>
          </Link>
          <div className="text-xs font-bold text-[#6E857B] bg-[#6E857B]/10 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6E857B]"></span>
            ECLOSIA Secure
          </div>
        </div>

        {/* Structure Principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* BLOC GAUCHE + CENTRE FUSIONNÉS */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-[#333333]/10 shadow-sm flex flex-col md:flex-row overflow-hidden">
            
            {/* --- Partie Image (Gauche) --- */}
            <div className="w-full md:w-[45%] flex flex-col p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#333333]/5 bg-[#6E857B]/5">
              
              <div className="relative w-full aspect-square flex items-center justify-center mb-4 bg-white rounded-xl border border-[#333333]/5 p-4">
                <Image src={mainImage} alt={product.name} fill unoptimized className="object-contain p-4 mix-blend-multiply" />
                
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`absolute top-3 right-3 p-2 transition-colors ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                >
                  <Heart className={`w-6 h-6 transition-all ${isFavorite ? "fill-current scale-110" : ""}`} />
                </button>
              </div>
              
              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
                  {product.images.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(imgUrl)}
                      className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border transition-all bg-white ${
                        mainImage === imgUrl ? "border-[#333333] shadow-xs" : "border-[#333333]/10 hover:border-[#333333]/30"
                      }`}
                    >
                      <Image src={imgUrl} alt={`Vue ${idx + 1}`} fill unoptimized className="object-contain p-1 mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}

              <hr className="border-[#333333]/10 my-2" />
              
              {/* Partage Social */}
              <div className="py-2">
                <p className="text-xs font-bold text-[#333333] mb-3 uppercase tracking-wide">Partagez ce produit</p>
                <div className="flex items-center gap-3">
                  <button onClick={shareOnFacebook} className="w-8 h-8 rounded-full border border-[#333333]/15 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 text-gray-700 transition-colors">
                    <Facebook className="w-4 h-4 fill-current" />
                  </button>
                  <button onClick={shareOnTwitter} className="w-8 h-8 rounded-full border border-[#333333]/15 flex items-center justify-center hover:bg-sky-50 hover:text-sky-500 text-gray-700 transition-colors">
                    <Twitter className="w-4 h-4 fill-current" />
                  </button>
                  <button onClick={shareOnWhatsApp} className="w-8 h-8 rounded-full border border-[#333333]/15 flex items-center justify-center hover:bg-green-50 hover:text-green-500 text-gray-700 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <hr className="border-[#333333]/10 my-2" />
              
              <button className="text-left text-xs font-medium text-blue-600 hover:underline flex items-center gap-2 mt-2">
                <Flag className="w-3.5 h-3.5" />
                Signaler des informations incorrectes
              </button>
            </div>

            {/* --- Partie Informations (Centre) --- */}
            <div className="w-full md:w-[55%] flex flex-col p-4 sm:p-6">
              
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#6E857B] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Boutique ECLOSIA
                  </span>
                  <span className="bg-[#333333] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Oeko-Tex Standard
                  </span>
                </div>
                
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-1.5 rounded-full transition-all -mt-1 -mr-1 ${isFavorite ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500"}`}
                >
                  <Heart className={`w-6 h-6 transition-all ${isFavorite ? "fill-current scale-110" : ""}`} />
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#333333] leading-snug mb-1.5">
                {product.name}
              </h1>
              <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                Marque: <span className="text-[#6E857B] font-bold">ECLOSIA / Easy Dort</span>
              </div>

              <hr className="border-[#333333]/10 mb-4" />

              {/* Prix */}
              <div className="flex items-center gap-3 mb-1">
                <p className="text-3xl font-extrabold text-[#333333]">{product.priceFormatted}</p>
                <p className="text-base font-medium text-gray-400 line-through">{product.oldPriceFormatted}</p>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">
                  -20%
                </span>
              </div>
              
              <p className="text-xs text-[#31A039] font-medium mb-1">En stock - Expédition rapide</p>
              <p className="text-xs text-[#333333]/80 mb-3">
                + livraison à partir de <span className="font-bold text-[#333333]">{activeDeliveryPriceStr}</span> vers <strong className="font-medium">{selectedCity || "votre adresse"}</strong>
              </p>

              {/* Avis */}
              <div className="flex items-center gap-1.5 mb-5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-xs text-[#333333]/60 font-medium">({product.reviewsCount} avis vérifiés)</span>
              </div>

              <hr className="border-[#333333]/10 mb-5" />

              {/* Bouton d'achat */}
              <button 
                onClick={handleBuy}
                className="w-full bg-[#333333] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm mb-6"
              >
                <ShoppingCart className="w-5 h-5" />
                J'achète
              </button>

              {/* Promotions */}
              <div className="mt-auto">
                <h3 className="text-xs font-extrabold text-[#333333] uppercase tracking-wider mb-3">Promotions & Services</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 bg-[#6E857B]/10 rounded text-[#6E857B] shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-[#333333]/80 font-medium">
                      Besoin d'aide pour commander, appelez nous au <span className="font-bold cursor-pointer">01 23 45 67 89</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 bg-[#6E857B]/10 rounded text-[#6E857B] shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <p className="text-xs text-[#333333]/80 font-medium">
                      Garantie conformité et sécurité certifiée pour le confort de bébé.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* BLOC DROIT (Livraison & Retours) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#333333]/10 shadow-sm flex flex-col">
            
            <div className="p-4 border-b border-[#333333]/10 flex justify-between items-center bg-[#6E857B]/5 rounded-t-2xl">
              <h3 className="font-extrabold text-xs text-[#333333] uppercase tracking-wider">LIVRAISON & RETOURS</h3>
              <span className="text-xs font-bold text-white bg-[#6E857B] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                ECLOSIA <Truck className="w-3 h-3"/>
              </span>
            </div>
            
            <div className="p-4">
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                  onClick={() => setDeliveryMethod("relais")}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all text-xs font-bold ${deliveryMethod === "relais" ? "border-[#333333] bg-[#333333] text-white shadow-xs" : "border-[#333333]/15 text-[#333333]/70 hover:border-[#333333]/30 bg-white"}`}
                >
                  <MapPin className="w-4 h-4 mb-1" />
                  <span>Point Relais</span>
                </button>
                <button 
                  onClick={() => setDeliveryMethod("domicile")}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-xl transition-all text-xs font-bold ${deliveryMethod === "domicile" ? "border-[#333333] bg-[#333333] text-white shadow-xs" : "border-[#333333]/15 text-[#333333]/70 hover:border-[#333333]/30 bg-white"}`}
                >
                  <Home className="w-4 h-4 mb-1" />
                  <span>À domicile</span>
                </button>
              </div>

              <h4 className="text-xs font-extrabold text-[#333333] mb-3">Choisissez le lieu</h4>
              
              <div className="flex flex-col gap-3 mb-5">
                <select 
                  className="w-full text-sm border border-[#333333]/20 rounded-xl p-2.5 text-[#333333] outline-none focus:border-[#333333] bg-white font-medium"
                  value={selectedRegion}
                  onChange={(e) => {
                    const newRegion = e.target.value;
                    setSelectedRegion(newRegion);
                    if (locations[newRegion] && locations[newRegion].length > 0) {
                      setSelectedCity(locations[newRegion][0].name);
                    } else {
                      setSelectedCity("");
                    }
                  }}
                >
                  {Object.keys(locations).map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>

                <select 
                  className="w-full text-sm border border-[#333333]/20 rounded-xl p-2.5 text-[#333333] outline-none focus:border-[#333333] bg-white font-medium disabled:bg-gray-100"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!locations[selectedRegion] || locations[selectedRegion].length === 0}
                >
                  {locations[selectedRegion] && locations[selectedRegion].length > 0 ? (
                    locations[selectedRegion].map((city) => (
                      <option key={city.name} value={city.name}>{city.name}</option>
                    ))
                  ) : (
                    <option value="">Aucune ville disponible</option>
                  )}
                </select>
              </div>

              <div className="border border-[#333333]/10 rounded-xl divide-y divide-[#333333]/10 overflow-hidden bg-[#F9F6F4]">
                <div className="p-3.5 flex items-start gap-3">
                  <div className="p-2 bg-white border border-[#333333]/10 rounded-lg shrink-0">
                    {deliveryMethod === "relais" ? <Package className="w-4 h-4 text-[#333333]" /> : <Home className="w-4 h-4 text-[#333333]" />}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-extrabold text-[#333333]">
                        {deliveryMethod === "relais" ? "Point relais" : "Livraison à domicile"}
                      </p>
                    </div>
                    <p className="text-xs text-[#333333] mb-1 font-medium">
                      Frais : <span className="font-bold text-[#6E857B]">{activeDeliveryPriceStr}</span>
                    </p>
                    <p className="text-xs text-[#333333]/70 leading-relaxed">
                      {deliveryMethod === "relais" ? "Retrait à " : "Livraison à "} 
                      <strong className="text-[#333333]">{selectedCity || "votre région"}</strong> sous 48h à 72h.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <div className="p-2 bg-white border border-[#333333]/10 rounded-lg shrink-0">
                    <RotateCcw className="w-4 h-4 text-[#333333]" />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-xs font-extrabold text-[#333333] mb-1">Politique de retour</p>
                    <p className="text-xs text-[#333333]/70 leading-relaxed">
                      Retours gratuits sur 10 jours (produits non ouverts).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <div className="p-2 bg-white border border-[#333333]/10 rounded-lg shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#333333]" />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-xs font-extrabold text-[#333333] mb-1">Garantie</p>
                    <p className="text-xs text-[#333333]/70 leading-relaxed">
                      12 Mois - Certifié sans substances nocives.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION SUGGESTIONS BÉBÉ EN CARROUSEL */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#333333]/10 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-extrabold text-[#333333] uppercase tracking-wide">Vous aimerez aussi dans l'univers Bébé</h2>
              <div className="flex gap-2">
                <button onClick={() => scrollSlider("left")} className="w-8 h-8 rounded-full border border-[#333333]/15 flex items-center justify-center hover:bg-gray-50 text-[#333333] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => scrollSlider("right")} className="w-8 h-8 rounded-full border border-[#333333]/15 flex items-center justify-center hover:bg-gray-50 text-[#333333] transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div 
              ref={sliderRef}
              className="flex items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
            >
              {suggestions.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.slug} 
                  className="group flex flex-col border border-[#333333]/10 rounded-xl hover:shadow-md transition-all bg-white shrink-0 snap-start w-52 p-3"
                >
                  <div className="relative w-full aspect-square bg-[#6E857B]/10 rounded-lg overflow-hidden mb-3 p-3 flex items-center justify-center">
                    <Image src={item.image} alt={item.name} fill unoptimized className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xs font-bold text-[#333333] line-clamp-2 mb-1 group-hover:text-[#6E857B] transition-colors leading-snug">{item.name}</h3>
                  <p className="font-extrabold text-sm text-[#333333] mt-auto">{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}