import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// ✅ Version Stripe valide
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// ✅ FIX CRITIQUE: Utilise SERVICE_ROLE_KEY sinon RLS bloque l'update
// Ton commentaire "ou SUPABASE_SERVICE_ROLE_KEY selon vos règles RLS" était le piège
// En webhook, il n'y a PAS de session user, donc ANON_KEY = bloqué par RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Dev local sans CLI Stripe - ne pas utiliser en prod
      console.warn("STRIPE_WEBHOOK_SECRET manquant - parsing JSON brut (dev only)");
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Erreur signature webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // ✅ Gère plusieurs events importants
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.order_id;
        const orderNumber = session.metadata?.order_number;

        console.log(`Checkout completed: orderId=${orderId}, orderNumber=${orderNumber}, amount=${session.amount_total}`);

        if (!orderId) {
          console.error("order_id manquant dans metadata Stripe");
          break;
        }

        // ✅ FIX: Ta structure réelle orders (31 colonnes)
        // status: pending -> processing -> shipped
        // payment_status: pending -> paid
        const { data, error } = await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing", // payée, en préparation France
            // Optionnel: stocke le payment_intent pour debug
            // Tu peux ajouter une colonne stripe_payment_intent_id si besoin
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .select()
          .single();

        if (error) {
          console.error("Erreur update order Supabase:", error);
          return NextResponse.json({ error: "DB update failed" }, { status: 500 });
        }

        console.log(`✅ Commande ECLOSIA ${data.order_number} (${orderId}) marquée payée - France`);
        
        // TODO: Ici tu peux déclencher email confirmation
        // await sendConfirmationEmail(data.customer_email, data.order_number)
        
        break;
      }

      case "checkout.session.expired":
      case "payment_intent.payment_failed": {
        const session = event.data.object as any;
        const orderId = session.metadata?.order_id;
        if (orderId) {
          await supabaseAdmin
            .from("orders")
            .update({
              payment_status: "failed",
              status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);
          console.log(`❌ Commande ${orderId} échouée/annulée`);
        }
        break;
      }

      default:
        console.log(`Event non géré: ${event.type}`);
    }
  } catch (err: any) {
    console.error("Erreur traitement webhook:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// Important pour Stripe: désactive le body parsing Next.js
// Dans app/api/webhooks/stripe/route.ts, Next.js 13+ gère déjà avec req.text()
