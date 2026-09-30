import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Heart } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function normalizeKey(name: string): string {
  return name.toLowerCase()
  .replace(/\(.*?\)/g, "")
  .replace(/coton mixte|bio|blanc|mixte/gi, "")
  .replace(/\s+/g, " ")
  .trim();
}

// Fonction pour déterminer la grande famille du produit et forcer la diversité
function getProductFamily(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("matelas")) return "matelas";
  if (n.includes("drap")) return "drap";
  if (n.includes("alèse") || n.includes("alese") || n.includes("protège")) return "alese";
  if (n.includes("couche") || n.includes("culotte") || n.includes("protect")) return "couche";
  if (n.includes("coussin")) return "coussin";
  if (n.includes("bain") || n.includes("bumbuns")) return "bain";
  return "autre";
}

function getBBLAImage(raw?: string): string {
  if (!raw) return "";
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  return first;
}

export async function BabyCareSection() {
  const { data: cat } = await supabase.from("categories").select("id").ilike("slug", "%bebe%").single();
  if (!cat) return null;

  // On retire l'order par prix pour avoir un mix naturel, tout en gardant la rentabilité >= 24.90
  const { data: rawProducts } = await supabase
  .from("products")
  .select(`id, name, slug, price, image_url, product_images(image_url, is_primary, position)`)
  .eq("is_active", true)
  .eq("category_id", cat.id)
  .gte("price", 24.90)
  .limit(100); // On élargit la recherche pour être sûr de trouver 4 familles différentes

  if (!rawProducts || rawProducts.length === 0) return null;

  const map = new Map<string, any>();
  const usedImages = new Set<string>();
  const usedFamilies = new Set<string>(); // Nouveau Set pour empêcher les familles en double

  rawProducts.forEach((p: any) => {
    const key = normalizeKey(p.name);
    const family = getProductFamily(p.name);

    // Si on a déjà ce nom exact OU si on a déjà un produit de cette famille (ex: 2ème matelas), on ignore
    if (map.has(key) || (usedFamilies.has(family) && family !== "autre")) return;

    const all = [...(p.product_images || [])]
    .sort((a:any,b:any)=>(a.position||0)-(b.position||0))
    .map((i:any)=> getBBLAImage(i.image_url))
    .filter(Boolean);

    if (p.image_url) all.unshift(getBBLAImage(p.image_url));

    let img = all.find(u => !usedImages.has(u)) || all[0] || "";
    if (!img) return;

    usedImages.add(img);
    usedFamilies.add(family); // On verrouille cette famille de produit

    map.set(key, {
      id: p.id,
      name: p.name.replace(/\s*\(.*?\)/g, "").trim(),
      price: p.price,
      slug: p.slug,
      image: img
    });
  });

  const uniqueProducts = Array.from(map.values()).slice(0, 4);
  if (uniqueProducts.length === 0) return null;

  return (
    <ProductSection title="Le Cocon de Bébé : Soins & Tendresse" subtitle="Une sélection délicate de produits certifiés Oeko-Tex" viewAllLink="/shop/bebe">
      {uniqueProducts.map((p: any) => (
        <div key={p.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md flex flex-col h-full">
          <Link href={`/shop/bebe/${p.slug}`} className="relative w-full h-40 sm:h-52 bg-[#6E857B]/10 flex items-center justify-center p-3 sm:p-4 shrink-0 block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-[#333333]">BÉBÉ</span>
            <span className="absolute bottom-2 left-2 bg-[#333333] text-white px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1"><Heart className="w-2.5 h-2.5 fill-current text-red-500" /> Coup de cœur</span>
          </Link>
          <div className="p-3 sm:p-4 flex flex-col flex-grow">
            <Link href={`/shop/bebe/${p.slug}`}><h3 className="font-bold text-[#333333] text-xs sm:text-sm line-clamp-2 hover:underline">{p.name}</h3></Link>
            <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#333333]/5 mt-3">
              <span className="font-extrabold text-[#333333] text-sm sm:text-base">{Number(p.price).toFixed(2)} €</span>
              <Link href={`/shop/bebe/${p.slug}`} className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-[#333333] text-white hover:bg-black transition-colors shrink-0"><ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></Link>
            </div>
          </div>
        </div>
      ))}
    </ProductSection>
  );
}