import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // On utilise la clé SERVICE_ROLE pour avoir les droits de modification (UPDATE)
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey || !openaiKey) {
      return NextResponse.json({ error: "Variables d'environnement manquantes." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const openai = new OpenAI({ apiKey: openaiKey });

    // 1. Récupérer les produits qui n'ont pas encore d'embedding
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, name, description, categories(name)")
      .is("embedding", null)
      .limit(50); // On traite par lot de 50 pour éviter les timeouts

    if (fetchError) throw fetchError;

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "Terminé ! Tous les produits ont un embedding." });
    }

    let count = 0;

    // 2. Générer et sauvegarder le vecteur pour chaque produit
    for (const product of products) {
      const categoryName = Array.isArray(product.categories) 
        ? product.categories[0]?.name 
        : (product.categories as any)?.name || "";

      // C'est ce texte que l'IA va comprendre et mémoriser
      const textToEmbed = `Produit: ${product.name}. Description: ${product.description || ""}. Catégorie: ${categoryName}.`;

      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: textToEmbed,
      });

      const embedding = embeddingResponse.data[0].embedding;

      // 3. Sauvegarder dans Supabase
      const { error: updateError } = await supabase
        .from("products")
        .update({ embedding })
        .eq("id", product.id);
        
      if (!updateError) count++;
    }

    return NextResponse.json({ message: `${count} produits ont été vectorisés avec succès ! Rechargez la page pour faire les suivants si besoin.` });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}