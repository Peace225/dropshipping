import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const FILE_MAP: Record<string, string> = {
  "douchette-intime-perinee": "douchette-intime-perinee.jpg",
  "soutien-gorge-grossesse-sans-coutures": "soutien-gorge-grossesse.jpg",
  "ballon-de-grossesse": "ballon-grossesse.jpg",
  "ceinture-abdominale-apres-accouchement": "ceinture-abdominale.jpg",
  "ballon-grossesse": "ballon-grossesse.jpg",
};

function getUrl(fileName: string) {
  try {
    if (!supabaseUrl ||!supabaseKey) return "/placeholder.jpg";
    const supabase = createClient(supabaseUrl, supabaseKey);
    const clean = fileName.replace(/^aurae-images\//, "").trim() || "placeholder.jpg";
    return supabase.storage.from("aurae-images").getPublicUrl(clean).data.publicUrl;
  } catch { return "/placeholder.jpg"; }
}

export async function MaternityCareSection() {
  try {
    if (!supabaseUrl ||!supabaseKey) return null;
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const { data: products } = await supabase.from("products").select(`id,name,slug,price,categories(slug,name),product_images(image_url,is_primary,position)`).eq("is_active", true).limit(20);
    if (!products?.length) return null;

    const list = products.filter((p:any)=>{
      const cat = p.categories?.slug?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      return cat.includes("mater") || cat.includes("maman") || name.includes("grossesse") || name.includes("perinee") || name.includes("ceinture") || name.includes("douchette");
    }).slice(0,4);

    const formatted = list.map((p:any)=>{
      const raw = p.product_images?.find((i:any)=>i.is_primary)?.image_url || p.product_images?.[0]?.image_url || "";
      let file = FILE_MAP[p.slug] || raw || `${p.slug}.jpg`;
      if (FILE_MAP[p.slug]) file = FILE_MAP[p.slug];
      return {
        id: p.id,
        name: p.name,
        price: `${Number(p.price).toFixed(2)} €`,
        image: getUrl(file),
        slug: `/shop/maternite/${p.slug}`,
      };
    });

    if (!formatted.length) return null;

    return (
      <ProductSection title="Maternité & Bien-être" subtitle="Des soins pensés pour vous accompagner avant, pendant et après" viewAllLink="/shop/maternite">
        {formatted.map((product:any)=>(
          <div key={product.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative w-full h-52 bg-[#F5EBE6]/50 flex items-center justify-center p-4">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" onError={(e)=>{e.currentTarget.src="https://placehold.co/400x400/F5EBE6/a3a3a3?text=ECLOSIA"}}/>
              <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-full text- font-bold uppercase flex items-center gap-1"><Sparkles className="w-3 h-3"/>MAMAN</span>
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
  } catch (e) {
    console.error("MaternityCareSection safe fallback", e);
    return null;
  }
}