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
      {list.map((p:any) => {
        const imageUrl = resolveImageUrl(p.slug);
        return (
          <div key={p.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* CLIC IMAGE -> PAGE LISTING /shop/maternite */}
            <Link href="/shop/maternite" className="relative w-full h-52 bg-[#F5EBE6]/50 flex items-center justify-center p-4 block">
              <SafeImage src={imageUrl} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
              <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><Sparkles className="w-3 h-3"/>{p.categories?.name || "MAMAN"}</span>
            </Link>
            <div className="p-4">
              <Link href="/shop/maternite"><h3 className="font-semibold text-sm line-clamp-2 hover:underline">{p.name}</h3></Link>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold">{Number(p.price).toFixed(2)} €</span>
                <Link href="/shop/maternite" className="h-8 w-8 flex items-center justify-center rounded-full bg-[#333333] text-white"><ShoppingBag className="w-4 h-4"/></Link>
              </div>
            </div>
          </div>
        );
      })}
    </ProductSection>
  );
}