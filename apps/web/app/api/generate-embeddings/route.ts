import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl ||!supabaseServiceKey ||!openaiKey) {
      console.error("ENV manquante:", {
        hasUrl:!!supabaseUrl,
        hasServiceKey:!!supabaseServiceKey,
        hasOpenAI:!!openaiKey
      });
      return NextResponse.json(
        { error: "Variables d'environnement manquantes. Vérifie Vercel > Settings > Environment Variables" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const openai = new OpenAI({ apiKey: openaiKey });

    // 1. Produits sans embedding
    const { data: products, error: fetchError } = await supabase
     .from("products")
     .select("id, name, description, categories(name)")
     .is("embedding", null)
     .limit(50);

    if (fetchError) throw fetchError;

    if (!products || products.length === 0) {
      return NextResponse.json({
        message: "Terminé! Tous les produits ont un embedding.",
        count: 0
      });
    }

    let count = 0;
    let errors = 0;

    // 2. Génération
    for (const product of products) {
      try {
        const categoryName = Array.isArray(product.categories)
         ? product.categories[0]?.name
          : (product.categories as any)?.name || "";

        const textToEmbed = `Produit: ${product.name}. Description: ${product.description || ""}. Catégorie: ${categoryName}.`;

        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: textToEmbed,
        });

        const embedding = embeddingResponse.data[0].embedding;

        const { error: updateError } = await supabase
         .from("products")
         .update({ embedding })
         .eq("id", product.id);

        if (updateError) {
          console.error(`Update error ${product.id}:`, updateError);
          errors++;
        } else {
          count++;
        }
      } catch (e) {
        console.error(`Erreur produit ${product.id}:`, e);
        errors++;
      }
    }

    return NextResponse.json({
      message: `${count} produits vectorisés, ${errors} erreurs. Relance /api/generate-embeddings s'il en reste.`,
      count,
      errors
    });

  } catch (error: any) {
    console.error("Erreur generate-embeddings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}