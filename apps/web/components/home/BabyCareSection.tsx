import Image from "next/image";
import Link from "next/link";
import { ProductSection } from "./ProductSection";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function BabyCareSection() {
  const { data: products } = await supabase
   .from("products")
   .select(`id, name, slug, price, categories ( slug, name ), product_images ( image_url, is_primary, position )`)
   .eq("is_active", true)
   .limit(20);

  const bebeProducts = (products || []).filter((p:any) => {
    const slug = p.categories?.slug?.toLowerCase() || "";
    return slug.includes("bebe") || p.name.toLowerCase().includes("bébé") || p.name.toLowerCase().includes("biberon") || slug.includes("puericulture");
  }).slice(0,4);

  const fallback = bebeProducts.length > 0? bebeProducts : (products || []).slice(0,4);

  const dynamicProducts = fallback.map((product: any) => {
    const sorted = [...(product.product_images||[])].sort((a,b)=> (a.position||0)-(b.position||0));
    const primary = sorted.find((i:any)=>i.is_primary) || sorted[0];
    const img = primary?.image_url || "/images/placeholder.jpg";
    return {
      id: product.id,
      name: product.name,
      category: product.categories?.name || "Univers Bébé",
      price: `${Number(product.price).toFixed(2)} €`,
      rating: 5,
      image: img,
      slug: `/shop/bebe/${product.slug}`,
      badge: "Coup de cœur",
    };
  });

  if (dynamicProducts.length === 0) return null;

  return (
    <ProductSection title="Le Cocon de Bébé : Soins & Tendresse" subtitle="Une sélection délicate de produits de puériculture, de soins hypoallergéniques et d'accessoires conçus pour envelopper bébé de sécurité et d'amour" viewAllLink="/shop/bebe">
      {dynamicProducts.map((product) => (
        <div key={product.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div className="relative w-full h-52 bg-[#6E857B]/15 overflow-hidden flex items-center justify-center p-4">
            <Image src={product.image} alt={product.name} fill unoptimized sizes="25vw" className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 rounded-full text- font-bold uppercase">{product.category}</span>
            <span className="absolute bottom-3 left-3 bg-[#6E857B] text-white px-2 py-0.5 rounded-md text- font-semibold flex items-center gap-1"><Heart className="w-2.5 h-2.5 fill-current" />{product.badge}</span>
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
