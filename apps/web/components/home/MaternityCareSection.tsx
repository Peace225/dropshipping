import Image from "next/image";
import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const FILE_MAP: Record<string, string> = {
  "ballon-de-grossesse": "ballon-grossesse.jpg",
  "ballon-grossesse": "ballon-grossesse.jpg",
  "coussinets-d-allaitement-jetables": "coussinets-allaitement-jetables.jpg",
  "coussinets-allaitement-jetables": "coussinets-allaitement-jetables.jpg",
  "serviettes-apaisantes-post-accouchement": "serviettes-apaisantes-post-accouchement.jpg",
  "serviettes-apaisantes-post-partum": "serviettes-apaisantes-post-accouchement.jpg",
};

function resolveImageUrl(rawImg: string, slug: string): string {
  if (rawImg?.startsWith("http")) return rawImg;
  let fileName = rawImg?.trim().replace(/^aurae-images\//, "").replace(/^\//, "") || "";
  if (!fileName || !fileName.includes(".")) {
    fileName = FILE_MAP[slug] || `${slug}.jpg`;
  }
  if (FILE_MAP[slug]) fileName = FILE_MAP[slug];
  if (FILE_MAP[fileName.replace(".jpg","")]) fileName = FILE_MAP[fileName.replace(".jpg","")];
  const { data } = supabase.storage.from("aurae-images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function MaternityCareSection() {
  const { data: products } = await supabase
   .from("products")
   .select(`id, name, slug, price, categories ( slug, name ), product_images ( image_url, is_primary, position )`)
   .eq("is_active", true)
   .order("created_at", { ascending: false })
   .limit(20);

  const materProducts = (products || []).filter((p:any) => {
    const slug = p.categories?.slug?.toLowerCase() || "";
    return slug.includes("mater") || slug.includes("maman") || p.name.toLowerCase().includes("grossesse") || p.name.toLowerCase().includes("maternité");
  }).slice(0,4);

  const fallback = materProducts.length > 0 ? materProducts : (products || []).slice(0,4);

  const formatted = fallback.map((product:any) => {
    const images = [...(product.product_images||[])].sort((a:any,b:any)=> (a.position||0)-(b.position||0));
    const raw = images.find((i:any)=>i.is_primary)?.image_url || images[0]?.image_url || "";
    const imageUrl = resolveImageUrl(raw, product.slug);
    return {
      id: product.id,
      name: product.name,
      category: product.categories?.name || "Maternité",
      price: `${Number(product.price).toFixed(2)} €`,
      image: imageUrl,
      slug: `/shop/maternite/${product.slug}`,
    };
  });

  if (formatted.length === 0) return null;

  return (
    <ProductSection title="Maternité & Bien-être" subtitle="Des soins pensés pour vous accompagner avant, pendant et après" viewAllLink="/shop/maternite">
      {formatted.map((product:any) => (
        <div key={product.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="relative w-full h-52 bg-[#F5EBE6]/50 flex items-center justify-center p-4">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
            <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><Sparkles className="w-3 h-3"/>{product.category}</span>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold">{product.price}</span>
              <Link href={product.slug} className="h-8 w-8 flex items-center justify-center rounded-full bg-[#333333] text-white"><ShoppingBag className="w-4 h-4"/></Link>
            </div>
          </div>
        </div>
      ))}
    </ProductSection>
  );
}
