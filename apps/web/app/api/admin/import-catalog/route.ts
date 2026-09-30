import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const coefficient = parseFloat(formData.get("coefficient") as string || "2.5");
    const supplierSel = formData.get("supplier") as string || "auto";

    if (!file) return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });

    const text = (await file.text()).replace(/^\uFEFF/, '').trim();

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
      transformHeader: h => h.trim().toLowerCase(),
    });

    let importedCount = 0;

    for (const r of parsed.data as any[]) {
      const sku = r.sku || r.reference || r["référence"];
      const name = r.name || r["nom du produit"];
      if (!sku || !name) continue;

      const cost = parseFloat((r.price_achat || r.prix_achat || "0").replace(",", ".")) || 0;
      const price = Math.round(cost * coefficient * 100) / 100;
      const marketPrice = Math.round(price * 1.3 * 100) / 100;
      const brand = supplierSel === "auto" ? (r.brand || r.marque || "Easy Dort") : supplierSel;

      // 1. Upsert dans la table "products" basé sur le SKU unique
      const { data: productData, error: productError } = await supabase
        .from("products")
        .upsert(
          {
            sku: sku.trim(),
            name: name.trim(),
            slug: sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            cost_price: cost,
            price: price,
            market_price: marketPrice,
            supplier: brand,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "sku" }
        )
        .select("id")
        .single();

      if (productError || !productData) {
        console.error(`Erreur SKU ${sku}:`, productError?.message);
        continue;
      }

      const productId = productData.id;

      // 2. Gestion de la galerie dans la table "product_images"
      const mainImage = r.img1 || r.image_url || "";
      const allImages = (r.images_all || mainImage || "").split('|').filter((v: string) => v && v.startsWith('http'));

      if (allImages.length > 0) {
        const imageRecords = allImages.map((imgUrl: string, index: number) => ({
          product_id: productId,
          image_url: imgUrl.trim(),
          position: index + 1,
          is_primary: index === 0,
          display_order: index + 1,
        }));
        
        // Supprime puis insère en batch pour la galerie
        await supabase.from("product_images").delete().eq("product_id", productId);
        await supabase.from("product_images").insert(imageRecords);
      }

      importedCount++;
    }

    if (importedCount === 0) {
      return NextResponse.json({ error: `0 produit importé. Vérifiez les en-têtes du CSV (sku, name, price_achat).` }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      count: importedCount, 
      message: `Importation réussie ! ${importedCount} produits et leurs galeries synchronisés.` 
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}