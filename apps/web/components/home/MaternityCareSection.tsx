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
  const { data: products, error } = await supabase.from("products").select(`id, name, slug, price, categories(slug, name), product_images(image_url, is_primary, position)`).eq("is_active", true).order("created_at", { ascending: false }).limit(20);
  if (error) return null;
  const mater = (products || []).filter((p:any) => {
    const c = p.categories?.slug?.toLowerCase() || "";
    const n = p.name?.toLowerCase() || "";
    return c.includes("mater") || c.includes("maman") || n.includes("grossesse") || n.includes("maternité") || n.includes("allaitement") || n.includes("accouchement");
  }).slice(0,4);
  const list = mater.length? mater : (products || []).slice(0,4);
  const formatted = list.map((p:any) => ({ id: p.id, name: p.name, category: p.categories?.name || "MAMAN", price: `${Number(p.price).toFixed(2)} €`, image: resolveImageUrl(p.slug), slug: `/shop/maternite/${p.slug}` }));
  if (!formatted.length) return null;
  return (
    <ProductSection title="Maternité & Bien-être" subtitle="Des soins pensés pour vous accompagner avant, pendant et après" viewAllLink="/shop/maternite">
      {formatted.map((product:any) => (
        <div key={product.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="relative w-full h-52 bg-[#F5EBE6]/50 flex items-center justify-center p-4">
            <SafeImage src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
            <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-full text- font-bold uppercase flex items-center gap-1"><Sparkles className="w-3 h-3"/>{product.category}</span>
          </div>
          <div className="p-4"><h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3><div className="mt-2 flex items-center justify-between"><span className="font-bold">{product.price}</span><Link href={product.slug} className="h-8 w-8 flex items-center justify-center rounded-full bg-[#333333] text-white"><ShoppingBag className="w-4 h-4"/></Link></div></div>
        </div>
      ))}
    </ProductSection>
  );
}
