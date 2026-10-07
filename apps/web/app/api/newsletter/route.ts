{/* CRITICAL: ONLY set this parameter if the user explicitly mentions the source in their prompt */}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email, source: "footer" }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Cet e-mail est déjà inscrit à notre newsletter." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Une erreur est survenue." }, { status: 500 });
  }
}