"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialisation du client Supabase côté client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MaternityShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  // La liste des catégories est maintenant dynamique
  const [categoriesList, setCategoriesList] = useState<string[]>(["Tous"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          price,
          description,
          categories!inner ( slug ),
          product_images ( image_url, is_primary, position )
        `)
        .eq("categories.slug", "maman")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur :", error);
      } else if (data) {
        
        // 1. Formatage des produits et attribution dynamique de la catégorie
        const formattedData = data.map((product: any) => {
          const images = [...(product.product_images ?? [])].sort(
            (a, b) => a.position - b.position
          );
          
          const rawImage =
            images.find((img) => img.is_primary)?.image_url ??
            images[0]?.image_url ??
            "placeholder.jpg";
            
          const fileName = rawImage.includes("/") ? rawImage.split("/").pop() : rawImage;
          const supabaseStorageUrl = `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${fileName}`;

          // Logique intelligente pour créer les catégories selon le nom des produits
          let dynamicCategory = "Accessoires";
          const lowerName = product.name?.toLowerCase() || "";

          if (lowerName.includes("vergeture") || lowerName.includes("huile") || lowerName.includes("crème") || lowerName.includes("baume") || lowerName.includes("soin")) {
            dynamicCategory = "Soins & Cosmétiques";
          } else if (lowerName.includes("soutien") || lowerName.includes("allaitement") || lowerName.includes("tire-lait") || lowerName.includes("coussinet") || lowerName.includes("conservation")) {
            dynamicCategory = "Allaitement";
          } else if (lowerName.includes("ceinture") || lowerName.includes("coussin") || lowerName.includes("bola") || lowerName.includes("maintien")) {
            dynamicCategory = "Confort & Maintien";
          } else if (lowerName.includes("post-partum") || lowerName.includes("douchette") || lowerName.includes("culotte") || lowerName.includes("serviette") || lowerName.includes("périnée") || lowerName.includes("hygiène")) {
            dynamicCategory = "Post-Partum";
          } else if (lowerName.includes("sac") || lowerName.includes("langer") || lowerName.includes("organisateur")) {
            dynamicCategory = "Sacs & Bagagerie";
          }

          return {
            id: product.id,
            name: product.name,
            category: dynamicCategory, 
            price: `${Number(product.price).toFixed(2).replace(".", ",")} €`,
            rating: 5,
            reviewsCount: Math.floor(Math.random() * 100) + 10,
            image: supabaseStorageUrl,
            slug: `/shop/maternite/${product.slug}`,
            badge: "Coup de cœur",
            description: product.description || "Un soin expert pour vous accompagner.",
          };
        });

        // 2. Extraction des catégories uniques trouvées pour la Sidebar
        const uniqueCategories = Array.from(new Set(formattedData.map(p => p.category))).sort();
        
        setProducts(formattedData);
        setCategoriesList(["Tous", ...uniqueCategories]); // Met à jour la sidebar
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  // Filtrage des produits selon le clic dans la sidebar
  const filteredProducts = selectedCategory === "Tous"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20">
      
      {/* En-tête de l'univers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 mt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#E8C5C8]/30 to-[#F5EBE6] rounded-3xl p-6 sm:p-10 border border-[#333333]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8C5C8] text-[#333333] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Univers 1 : Soins & Cosmétique Maman
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight mb-3">
              Prendre soin de vous, de la grossesse au post-partum
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Des formules clean, 100% sécurisées et adaptées aux bouleversements de votre corps. Luttez efficacement contre les vergetures, soulagez vos nuits et vivez un post-partum serein.
            </p>
          </div>
          <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-xs sm:text-sm text-[#333333] font-medium min-w-[220px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>100% Compatible Allaitement</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Testé dermatologiquement</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
              <span>Sans perturbateurs endocriniens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structure principale : Sidebar + Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* =========================================
              SIDEBAR (Filtres Catégories Dynamiques)
          ========================================= */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-[#333333]/10 shadow-sm p-5 sticky top-24">
              <h2 className="text-lg font-extrabold text-[#333333] mb-4 px-2">Catégories</h2>
              <div className="flex flex-col gap-1">
                {categoriesList.map((cat, idx) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-[#333333] text-white shadow-sm"
                          : "text-[#333333]/70 hover:bg-[#333333]/5 hover:text-[#333333]"
                      }`}
                    >
                      <span>{cat}</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* =========================================
              GRILLE DES PRODUITS
          ========================================= */}
          <div className="flex-1">
            {loading ? (
               <div className="flex items-center justify-center py-20 text-[#333333]/70 font-bold">
                 Chargement des produits...
               </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#333333]/10">
                <p className="text-sm font-bold text-[#333333]/70">
                  Aucun produit ne correspond à cette catégorie pour le moment.
                </p>
                <button 
                  onClick={() => setSelectedCategory("Tous")}
                  className="mt-4 px-6 py-2 text-sm font-bold text-[#333333] underline hover:text-black"
                >
                  Voir tous les produits
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <Link href={product.slug} className="relative w-full h-64 bg-[#E8C5C8]/20 overflow-hidden flex items-center justify-center p-6 block">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#333333] shadow-sm uppercase tracking-wider">
                        {product.category}
                      </span>
                      <span className="absolute bottom-4 left-4 bg-[#333333] text-white px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        {product.badge}
                      </span>
                    </Link>

                    <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(product.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                            <span className="text-xs text-[#333333]/60 font-medium ml-1">
                              ({product.reviewsCount})
                            </span>
                          </div>
                        </div>

                        <Link href={product.slug}>
                          <h2 className="font-extrabold text-base sm:text-lg text-[#333333] group-hover:text-black transition-colors line-clamp-1">
                            {product.name}
                          </h2>
                        </Link>

                        <p className="text-xs sm:text-sm text-[#333333]/70 mt-1 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#333333]/5">
                        <span className="font-extrabold text-lg text-[#333333]">
                          {product.price}
                        </span>
                        <Link
                          href={product.slug}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Découvrir</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}