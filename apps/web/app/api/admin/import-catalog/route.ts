import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(request: Request) {
  try {
    // 1. Récupérer le fichier FormData et le coefficient envoyés depuis le dashboard
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const supplier = formData.get("supplier") as string;
    const coefficientStr = formData.get("coefficient") as string;
    const coefficient = coefficientStr ? parseFloat(coefficientStr) : 2.5;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    // 2. Lire le contenu textuel du fichier CSV
    const textContent = await file.text();
    const lines = textContent.split("\n").filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      return NextResponse.json({ error: "Le fichier CSV est vide ou mal formaté." }, { status: 400 });
    }

    // Détection basique du séparateur (virgule ou point-virgule)
    const headerLine = lines[0];
    const separator = headerLine.includes(";") ? ";" : ",";
    const headers = headerLine.split(separator).map((h) => h.trim().replace(/^["']|["']$/g, ""));

    let importedCount = 0;

    // 3. Parcourir les lignes du CSV (à partir de la ligne 1, en sautant l'en-tête)
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];
      const values = currentLine.split(separator).map((v) => v.trim().replace(/^["']|["']$/g, ""));

      const rowData: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowData[header.toLowerCase()] = values[index] || "";
      });

      const sku = rowData["sku"] || rowData["ref"] || rowData["reference"] || `ECL-${i}`;
      const name = rowData["name"] || rowData["titre"] || rowData["produit"] || "Produit Eclosia";
      const rawPrice = parseFloat(rowData["price"] || rowData["prix"] || "10") || 10;
      const stock = parseInt(rowData["stock"] || rowData["quantite"] || "10") || 10;
      const imageUrl = rowData["image"] || rowData["image_url"] || "";
      
      const csvMarketPrice = parseFloat(rowData["market_price"] || rowData["prix_marche"] || "0");

      // Application dynamique du coefficient choisi dans le dashboard
      const sellingPrice = Math.round(rawPrice * coefficient * 100) / 100;
      
      // Estimation automatique ou lecture du prix du marché
      const marketPrice = csvMarketPrice > 0 ? csvMarketPrice : Math.round(rawPrice * 3.2 * 100) / 100;

      // 4. Enregistrement ou mise à jour dans Supabase (Upsert sur la colonne SKU unique)
      const { error: upsertError } = await supabase
        .from("products")
        .upsert(
          {
            sku: sku,
            name: name,
            price: sellingPrice,
            cost_price: rawPrice,
            market_price: marketPrice,
            stock: stock,
            image_url: imageUrl,
            supplier: supplier,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "sku" }
        );

      if (!upsertError) {
        importedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      count: importedCount,
      message: `Importation réussie pour le fournisseur ${supplier}.`,
    });

  } catch (err: any) {
    console.error("Erreur serveur import CSV:", err);
    return NextResponse.json({ error: err.message || "Erreur interne du serveur." }, { status: 500 });
  }
}