import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Heart } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const BUCKET = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images";

const FILE_MAP: Record<string, string> = {
  "porte-bebe": "porte-bebe-ergonomique.jpg",
  "tapis-deveil": "tapis-d-eveil.jpg",
  "couches-pampers-tailles": "pack-couches-pampers.jpg",
  "lit-cododo": "lit-cododo-reglable.jpg",
  "kit-gigoteuse-lange-nid-ange-serviettes": "kit-naissance-gigoteuse-lange.jpg",
  "pack-soin-bebe-mustela": "pack-soins-mustela.jpg",
  "chaise-haute": "chaise-haute-evolutive.jpg",
  "coffret-naissance-biberons-mam": "coffret-biberons-mam.jpg",
  "lot-2-tetines-mam": "tetines-mam-lot-de-2.jpg",
  "lot-3-pyjamas": "lot-3-pyjamas-coton.jpg",
};

function getImageUrl(slug: string): string {
  const file = FILE_MAP[slug] || `${slug}.jpg`;
  return `${BUCKET}/${file}`;
}

export async function BabyCareSection() {
  const { data: products } = await supabase
   .from("products")
   .select(`id, name, slug, price, categories!inner(slug, name), product_images(image_url, is_primary, position)`)
   .eq("is_active", true)
   .eq("categories.slug", "bebe")
   .order("created_at", { ascending: false })
   .limit(4);

  if (!products || products.length === 0) return null;

  return (
    <ProductSection title="Le Cocon de Bébé : Soins & Tendresse" subtitle="Une sélection délicate de produits de puériculture" viewAllLink="/shop/bebe">
      {products.map((p: any) => {
        const imageUrl = getImageUrl(p.slug);
        return (
          <div key={p.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
            {/* Hauteurs et marges adaptatives : h-40 sur mobile, h-52 sur desktop */}
            <Link href={`/shop/bebe/${p.slug}`} className="relative w-full h-40 sm:h-52 bg-[#6E857B]/15 flex items-center justify-center p-3 sm:p-4 shrink-0 block">
              <img src={imageUrl} alt={p.name} className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform" />
              
              {/* Badges ajustés pour ne pas déborder sur mobile */}
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase">
                BÉBÉ
              </span>
              <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#6E857B] text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-semibold flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" /> Coup de cœur
              </span>
            </Link>
            
            {/* flex-grow garantit que la carte prend toute la hauteur disponible */}
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <Link href={`/shop/bebe/${p.slug}`}>
                <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 hover:underline">{p.name}</h3>
              </Link>
              
              {/* mt-auto pousse la ligne du prix tout en bas, alignant tous les boutons */}
              <div className="mt-auto pt-3 flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base">{Number(p.price).toFixed(2)} €</span>
                <Link href={`/shop/bebe/${p.slug}`} className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-[#333333] text-white hover:bg-black transition-colors shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </ProductSection>
  );
}