import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images";

const FILE_MAP: Record<string, string> = {
  "sac-de-maternite-organisateur-valise": "sac-maternite-organisateur.jpg",
  "sac-de-maternite-organisateur-valise-55": "sac-maternite-organisateur.jpg",
  "sac-de-maternite-et-organisateur-valise": "sac-maternite-organisateur.jpg",
  "sac-de-maternite-organisateur": "sac-maternite-organisateur.jpg",
  "sac-maternite-organisateur": "sac-maternite-organisateur.jpg",
  "ballon-de-grossesse": "ballon-grossesse.jpg",
  "ceinture-abdominale-apres-accouchement": "ceinture-abdominale-post-partum.jpg",
  "ceinture-abdominale-post-partum": "ceinture-abdominale-post-partum.jpg",
  "soutien-allaitement-lot-de-3": "soutien-gorge-grossesse-sans-coutures.jpg",
  "soutiens-gorge-d-allaitement-lot-de-3": "soutien-gorge-grossesse-sans-coutures.jpg",
  "serviettes-hygieniques-post-partum": "serviettes-hygieniques-maternite.jpg",
  "serviettes-hygieniques-post-partum-12": "serviettes-hygieniques-maternite.jpg",
};

function getImageUrl(slug: string, rawImage?: string): string {
  if (rawImage && rawImage.startsWith("http") && rawImage.includes("aurae-images") && rawImage.length > 60) {
    if (!rawImage.endsWith("aurae-ima") && !rawImage.endsWith("aurae-images")) {
      return rawImage;
    }
  }
  const fileName = FILE_MAP[slug] || `${slug}.jpg`;
  return `${BUCKET}/${fileName}`;
}

export async function MaternityCareSection() {
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      categories!inner(slug, name),
      product_images(image_url, is_primary, position)
    `)
    .eq("is_active", true)
    .eq("categories.slug", "maman")
    .order("created_at", { ascending: false })
    .limit(8);

  if (!products || products.length === 0) return null;

  const list = products.slice(0, 4);

  return (
    <ProductSection
      title="Maternité & Bien-être"
      subtitle="Des soins pensés pour vous accompagner avant, pendant et après"
      viewAllLink="/shop/maternite"
    >
      {list.map((p: any) => {
        const imgs = [...(p.product_images || [])].sort((a: any, b: any) => a.position - b.position);
        const primary = imgs.find((i: any) => i.is_primary) || imgs[0];
        const imageUrl = getImageUrl(p.slug, primary?.image_url);

        return (
          <div key={p.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            {/* HAUTEUR ET PADDINGS RESPONSIVES */}
            <Link href={`/shop/maternite/${p.slug}`} className="relative w-full h-40 sm:h-52 bg-[#F5EBE6]/50 flex items-center justify-center p-3 sm:p-4 shrink-0 block">
              <img
                src={imageUrl}
                alt={p.name}
                className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-300"
              />
              {/* CORRECTION DU TEXT- MANQUANT ET BADGE RESPONSIVE */}
              <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="line-clamp-1">{p.categories?.name || "MAMAN"}</span>
              </span>
            </Link>
            
            {/* CONTENU FLEXIBLE POUR ALIGNEMENT PARFAIT */}
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <Link href={`/shop/maternite/${p.slug}`}>
                <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 hover:underline">{p.name}</h3>
              </Link>
              
              {/* mt-auto POUSSE LE PRIX ET LE BOUTON TOUT EN BAS DE LA CARTE */}
              <div className="mt-auto pt-3 flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base">{Number(p.price).toFixed(2)} €</span>
                <Link href={`/shop/maternite/${p.slug}`} className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-[#333333] text-white hover:bg-black transition-colors shrink-0">
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