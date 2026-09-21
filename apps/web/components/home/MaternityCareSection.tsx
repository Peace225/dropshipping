import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { SafeImage } from "@/components/ui/SafeImage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const FILE_MAP: Record<string, string> = {
  "douchette-intime-perinee": "douchette-intime-perinee.jpg",
  "soutien-gorge-grossesse-sans-coutures": "soutien-gorge-grossesse-sans-coutures.jpg",
  "ballon-de-grossesse": "ballon-grossesse.jpg",
  "ceinture-abdominale-apres-accouchement": "ceinture-abdominale-apres-accouchement.jpg",
  "coussinets-d-allaitement-jetables": "coussinets-allaitement-jetables.jpg",
  "serviettes-apaisantes-post-accouchement": "serviettes-apaisantes-post-accouchement.jpg",
};

function resolveImageUrl(slug: string): string {
  const fileName = FILE_MAP[slug] || `${slug}.jpg`;
  const { data } = supabase.storage.from("aurae-images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function MaternityCareSection() {
  const { data: products } = await supabase.from("products").select(`id, name, slug, price, categories(slug, name)`).eq("is_active", true).order("created_at", { ascending: false }).limit(20);
  const mater = (products || []).filter((p:any) => {
    const c = p.categories?.slug?.toLowerCase() || "";
    const n = p.name?.toLowerCase() || "";
    return c.includes("mater") || c.includes("maman") || n.includes("grossesse") || n.includes("maternité") || n.includes("allaitement") || n.includes("accouchement");
  }).slice(0,4);
  const list = mater.length? mater : (products || []).slice(0,4);

  return (
    <ProductSection title="Maternité & Bien-être" subtitle="Des soins pensés pour vous accompagner avant, pendant et après" viewAllLink="/shop/maternite">
      {/* GRID RESPONSIVE : 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
        {list.map((p:any) => {
          const imageUrl = resolveImageUrl(p.slug);
          return (
            <div key={p.id} className="group bg-white rounded-xl sm:rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <Link href="/shop/maternite" className="relative w-full h-36 xs:h-44 sm:h-52 bg-[#F5EBE6]/50 flex items-center justify-center p-2 sm:p-4 block">
                <SafeImage src={imageUrl} alt={p.name} className="w-full h-full object-contain p-1 sm:p-4 group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3"/>{p.categories?.name || "MAMAN"}
                </span>
              </Link>
              <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                <Link href="/shop/maternite" className="flex-1">
                  <h3 className="font-semibold text-[12px] sm:text-sm line-clamp-2 leading-tight">{p.name}</h3>
                </Link>
                <div className="mt-2 sm:mt-2 flex items-center justify-between">
                  <span className="font-bold text-[13px] sm:text-base">{Number(p.price).toFixed(2)} €</span>
                  <Link href="/shop/maternite" className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full bg-[#333333] text-white shrink-0">
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ProductSection>
  );
}