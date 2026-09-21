import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Initialisation des clients (Assurez-vous que vos variables d'environnement sont bien définies)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { searchQuery } = await req.json();

    if (!searchQuery || searchQuery.trim() === "") {
      return NextResponse.json([]);
    }

    // 1. Demander à OpenAI de transformer la recherche textuelle en vecteur mathématique
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: searchQuery,
    });
    
    const query_embedding = embeddingResponse.data[0].embedding;

    // 2. Interroger Supabase avec notre fonction RPC "match_products"
    const { data: matchedProducts, error } = await supabase.rpc("match_products", {
      query_embedding,
      match_threshold: 0.3, // Seuil de tolérance (0.3 est assez permissif, 0.7 est très strict)
      match_count: 6        // On limite à 6 résultats pour ne pas surcharger le menu déroulant
    });

    if (error) {
      console.error("Erreur Supabase lors de la recherche vectorielle :", error);
      throw error;
    }

    // 3. Renvoyer les produits trouvés au Header
    return NextResponse.json(matchedProducts || []);
    
  } catch (error: any) {
    console.error("Erreur API Search :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}