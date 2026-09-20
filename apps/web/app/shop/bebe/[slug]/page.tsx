"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, RotateCcw, Heart, MapPin, Home, ChevronRight, ChevronLeft, Package, Facebook, Twitter, MessageCircle, Phone, ShoppingCart, Flag, Truck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/context/cart-context"; // Import du contexte panier

// Initialisation du client Supabase côté client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BebeProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter(); 
  const cart = useCart() as any; // Initialisation du hook du panier

  const [product, setProduct] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // États pour la logistique (dynamiques depuis Supabase)
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

  // ==========================================
  // FONCTION : AJOUTER AU PANIER VIA LE CONTEXTE ET PAYER
  // ==========================================
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

  // ==========================================
  // FONCTIONS DE PARTAGE SOCIAL
  // ==========================================
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
    const text = encodeURIComponent(`Découvrez ${product?.name} sur AURAE ! `);
    window.open(`https://twitter.com/intent/tweet?url=${getShareUrl()}&text=${text}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Regarde ça, j'ai trouvé ${product?.name} sur AURAE : `);
    window.open(`https://wa.me/?text=${text}${getShareUrl()}`, "_blank");
  };

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      // 1. Récupération du produit actuel avec sa catégorie et ses images
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          price,
          description,
          categories!inner(slug),
          product_images ( image_url, is_primary, position )
        `)
        .eq("slug", slug)
        .eq("categories.slug", "bebe")
        .single();

      if (productError) {
        console.error("Erreur de chargement du produit :", productError);
        setLoading(false);
        return;
      }

      if (productData) {
        const images = [...(productData.product_images ?? [])].sort((a, b) => a.position - b.position);
        
        const formattedImages = images.map((img: any) => {
          const rawImage = img.image_url;
          const fileName = rawImage.includes("/") ? rawImage.split("/").pop() : rawImage;
          return `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${fileName}`;
        });

        if (formattedImages.length === 0) formattedImages.push("/images/placeholder.jpg");

        setProduct({
          ...productData,
          images: formattedImages,
          priceFormatted: `${Number(productData.price).toFixed(2).replace(".", ",")} €`,
          oldPriceFormatted: `${(Number(productData.price) * 1.25).toFixed(2).replace(".", ",")} €`,
          reviewsCount: Math.floor(Math.random() * 100) + 20,
        });
        setMainImage(formattedImages[0]);

        // 2. Récupération des suggestions STRICTEMENT FILTRÉES sur l'univers BÉBÉ
        const { data: suggestionsData } = await supabase
          .from("products")
          .select(`
            id, name, slug, price,
            categories!inner(slug),
            product_images ( image_url, is_primary, position )
          `)
          .eq("categories.slug", "bebe")
          .eq("is_active", true)
          .neq("id", productData.id)
          .limit(8);

        if (suggestionsData) {
          const formattedSuggestions = suggestionsData.map((sug: any) => {
            const sugImages = [...(sug.product_images ?? [])].sort((a, b) => a.position - b.position);
            const rawSugImg = sugImages.find((img) => img.is_primary)?.image_url ?? sugImages[0]?.image_url ?? "placeholder.jpg";
            const sugFileName = rawSugImg.includes("/") ? rawSugImg.split("/").pop() : rawSugImg;
            
            return {
              id: sug.id,
              name: sug.name,
              price: `${Number(sug.price).toFixed(2).replace(".", ",")} €`,
              image: `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${sugFileName}`,
              slug: `/shop/bebe/${sug.slug}`
            };
          });
          setSuggestions(formattedSuggestions);
        }

        // 3. Récupération des régions et villes pour la livraison
        const { data: regionsData } = await supabase
          .from("regions")
          .select(`name, cities (name, relais_price, home_price)`)
          .order("name");

        if (regionsData) {
          const fetchedLocations: Record<string, any[]> = {};
          
          regionsData.forEach((region: any) => {
            fetchedLocations[region.name] = region.cities.sort((a: any, b: any) => a.name.localeCompare(b.name));
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <p className="font-bold text-[#333333]/70 animate-pulse">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 pt-20">
        <h1 className="text-2xl font-extrabold text-[#333333]">Produit introuvable</h1>
        <Link href="/shop" className="px-6 py-2 bg-[#333333] text-white rounded-full font-bold">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const currentCityObj = locations[selectedRegion]?.find((c) => c.name === selectedCity);
  
  const relaisPriceStr = currentCityObj?.relais_price != null 
    ? `${Number(currentCityObj.relais_price).toFixed(2).replace(".", ",")} €` 
    : "-- €";
    
  const homePriceStr = currentCityObj?.home_price != null 
    ? `${Number(currentCityObj.home_price).toFixed(2).replace(".", ",")} €` 
    : "-- €";

  const activeDeliveryPriceStr = deliveryMethod === "relais" ? relaisPriceStr : homePriceStr;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête : Fil d'Ariane pointant vers /shop */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-[#333333]/70 hover:text-[#333333] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la boutique</span>
          </Link>
          <div className="text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Non connecté
          </div>
        </div>

        {/* Structure Principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* ==========================================================
              BLOC GAUCHE + CENTRE FUSIONNÉS (Image + Infos Produit)
          ========================================================== */}
          <div className="lg:col-span-9 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row overflow-hidden">
            
            {/* --- Partie Image (Gauche) --- */}
            <div className="w-full md:w-[45%] flex flex-col p-4 sm:p-6 border-b md:border-b-0 md:border-r border-gray-100">
              
              <div className="relative w-full aspect-square flex items-center justify-center mb-4">
                <Image src={mainImage} alt={product.name} fill unoptimized className="object-contain mix-blend-multiply" />
                
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`absolute top-0 right-0 p-2 transition-colors ${isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                >
                  <Heart className={`w-6 h-6 transition-all ${isFavorite ? "fill-current scale-110" : ""}`} />
                </button>
              </div>
              
              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
                  {product.images.map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(imgUrl)}
                      className={`relative w-14 h-14 shrink-0 rounded-md overflow-hidden border transition-all ${
                        mainImage === imgUrl ? "border-orange-500 shadow-sm" : "border-gray-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <Image src={imgUrl} alt={`Vue ${idx + 1}`} fill unoptimized className="object-contain p-1 mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}

              <hr className="border-gray-100 my-2" />
              
              {/* Partage Social */}
              <div className="py-2">
                <p className="text-xs font-bold text-[#333333] mb-3 uppercase tracking-wide">Partagez ce produit</p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={shareOnFacebook}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-gray-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4 fill-current" />
                  </button>
                  <button 
                    onClick={shareOnTwitter}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200 text-gray-700 transition-colors"
                  >
                    <Twitter className="w-4 h-4 fill-current" />
                  </button>
                  <button 
                    onClick={shareOnWhatsApp}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-green-50 hover:text-green-500 hover:border-green-200 text-gray-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 my-2" />

              {/* Signaler */}
              <button className="text-left text-xs font-medium text-blue-600 hover:underline flex items-center gap-2 mt-2">
                <Flag className="w-3.5 h-3.5" />
                Signaler des informations incorrectes liées au produit
              </button>
            </div>


            {/* --- Partie Informations (Centre) --- */}
            <div className="w-full md:w-[55%] flex flex-col p-4 sm:p-6">
              
              {/* Badges et Favoris */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#0053A0] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                    Boutique Officielle
                  </span>
                  <span className="bg-[#31A039] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                    SUPER DEAL
                  </span>
                </div>
                
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-1.5 rounded-full transition-all -mt-1 -mr-1 ${isFavorite ? "text-red-500 bg-red-50" : "text-orange-500 hover:bg-orange-50"}`}
                >
                  <Heart className={`w-6 h-6 transition-all ${isFavorite ? "fill-current scale-110" : ""}`} />
                </button>
              </div>

              {/* Titre et Marque */}
              <h1 className="text-xl sm:text-2xl font-medium text-[#333333] leading-snug mb-1.5">
                {product.name}
              </h1>
              <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                Marque: <Link href="#" className="text-blue-600 hover:underline">AURAE</Link> | 
                <Link href="#" className="text-blue-600 hover:underline">Produits similaires par AURAE</Link>
              </div>

              <hr className="border-gray-200 mb-4" />

              {/* Prix */}
              <div className="flex items-center gap-3 mb-1">
                <p className="text-3xl font-extrabold text-[#333333]">{product.priceFormatted}</p>
                <p className="text-base font-medium text-gray-400 line-through">{product.oldPriceFormatted}</p>
                <span className="bg-orange-100 text-orange-600 text-[11px] font-bold px-1.5 py-0.5 rounded">
                  -20%
                </span>
              </div>
              
              {/* Disponibilité et Livraison */}
              <p className="text-xs text-[#31A039] font-medium mb-1">Disponible</p>
              <p className="text-[11px] text-[#333333] mb-3">
                + livraison à partir de <span className="font-bold text-orange-600">{activeDeliveryPriceStr}</span> vers <strong className="font-medium">{selectedCity || "votre adresse"}</strong>
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
                <Link href="#" className="text-xs text-blue-600 hover:underline">({product.reviewsCount} avis vérifiés)</Link>
              </div>

              <hr className="border-gray-200 mb-5" />

              {/* Bouton d'achat relié à handleBuy() */}
              <button 
                onClick={handleBuy}
                className="w-full bg-[#F68B1E] hover:bg-[#E07A1A] text-white py-3.5 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm mb-6"
              >
                <ShoppingCart className="w-5 h-5" />
                J'achète
              </button>

              {/* Promotions */}
              <div className="mt-auto">
                <h3 className="text-[11px] font-bold text-[#333333] uppercase tracking-wider mb-3">Promotions</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 bg-orange-100 rounded text-orange-600 shrink-0">
                      <Phone className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-blue-600 font-medium">
                      Besoin d'aide pour commander, appelez nous au <span className="hover:underline cursor-pointer">01 23 45 67 89</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 bg-orange-100 rounded text-orange-600 shrink-0">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <p className="text-xs text-blue-600 font-medium">
                      Jusqu'à -5,00 € de frais de livraison sur vos commandes prépayées et livrées en relais. Minimum de commande 40,00 €.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ==========================================================
              BLOC DROIT (Livraison & Retours)
          ========================================================== */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            
            {/* En-tête */}
            <div className="p-3.5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
              <h3 className="font-extrabold text-[11px] text-[#333333] uppercase tracking-wider">LIVRAISON & RETOURS</h3>
              <span className="text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                AURAE <Truck className="w-3 h-3"/>
              </span>
            </div>
            
            <div className="p-4">
              
              {/* Choix du mode de livraison */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                  onClick={() => setDeliveryMethod("relais")}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-lg transition-colors ${deliveryMethod === "relais" ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  <MapPin className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-bold">Point Relais</span>
                </button>
                <button 
                  onClick={() => setDeliveryMethod("domicile")}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-lg transition-colors ${deliveryMethod === "domicile" ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  <Home className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-bold">À domicile</span>
                </button>
              </div>

              <h4 className="text-[13px] font-bold text-[#333333] mb-3">Choisissez le lieu</h4>
              
              {/* Sélecteurs dynamiques depuis Supabase */}
              <div className="flex flex-col gap-3 mb-5">
                <select 
                  className="w-full text-sm border border-gray-300 rounded p-2.5 text-[#333333] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
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
                  className="w-full text-sm border border-gray-300 rounded p-2.5 text-[#333333] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white disabled:bg-gray-100"
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

              {/* Blocs de détails logistiques unifiés */}
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                
                <div className="p-3.5 flex items-start gap-3">
                  <div className="p-2 border border-gray-200 rounded shrink-0">
                    {deliveryMethod === "relais" ? (
                      <Package className="w-4 h-4 text-gray-700" />
                    ) : (
                      <Home className="w-4 h-4 text-gray-700" />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[13px] font-bold text-[#333333]">
                        {deliveryMethod === "relais" ? "Point relais" : "Livraison à domicile"}
                      </p>
                      <button className="text-[11px] text-blue-600 hover:underline">Détails</button>
                    </div>
                    <p className="text-[11px] text-[#333333] mb-1">
                      Frais de livraison : <span className="font-bold text-orange-600">{activeDeliveryPriceStr}</span>
                    </p>
                    <p className="text-[11px] text-[#333333]/80 leading-relaxed">
                      {deliveryMethod === "relais" ? "Prêt pour le retrait à " : "Livraison prévue à "} 
                      <strong className="text-[#333333]">{selectedCity || "votre région"}</strong> sous 48h à 72h.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <div className="p-2 border border-gray-200 rounded shrink-0">
                    <RotateCcw className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[13px] font-bold text-[#333333]">Politique de retour</p>
                      <button className="text-[11px] text-blue-600 hover:underline">Détails</button>
                    </div>
                    <p className="text-[11px] text-[#333333]/80 leading-relaxed">
                      Retours gratuits sur 10 jours. (Produits non ouverts).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <div className="p-2 border border-gray-200 rounded shrink-0">
                    <ShieldCheck className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-[13px] font-bold text-[#333333] mb-1">Garantie</p>
                    <p className="text-[11px] text-[#333333]/80 leading-relaxed">
                      12 Mois - 100% bio et naturel certifié.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            SECTION SUGGESTIONS BÉBÉ EN CARROUSEL
        ========================================== */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[15px] font-medium text-[#333333] uppercase">Vous aimerez aussi</h2>
              <div className="flex gap-1.5">
                <button onClick={() => scrollSlider("left")} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-500 active:scale-95 transition-transform"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => scrollSlider("right")} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-500 active:scale-95 transition-transform"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div 
              ref={sliderRef}
              className="flex items-stretch gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {suggestions.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.slug} 
                  className="group flex flex-col border border-gray-100 rounded hover:shadow-md transition-shadow bg-white shrink-0 snap-start w-[150px] sm:w-[180px] p-2"
                >
                  <div className="relative w-full aspect-square bg-[#E8C5C8]/10 rounded overflow-hidden mb-2 p-2 flex items-center justify-center">
                    <Image src={item.image} alt={item.name} fill unoptimized className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-[12px] text-[#333333] line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors leading-snug">{item.name}</h3>
                  <p className="font-extrabold text-[13px] text-[#333333] mt-auto">{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}