import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient(),
})

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") as string

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  try {
    const body = await req.text()
    // Vérification cryptographique de la signature Stripe pour la sécurité
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      endpointSecret
    )

    // 1. Anti-replay / anti-doublon : Vérifier si l'événement a déjà été traité
    const { data: existingEvent } = await supabase
      .from("stripe_events")
      .select("event_id")
      .eq("event_id", event.id)
      .single()

    if (existingEvent) {
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      })
    }

    // Enregistrer l'événement pour éviter tout double traitement futur
    await supabase.from("stripe_events").insert({ event_id: event.id, type: event.type })

    // 2. Traitement de l'événement de paiement réussi
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id

      if (orderId) {
        const customerEmail = session.customer_details?.email || session.customer_email || null
        const totalPaid = session.amount_total ? session.amount_total / 100 : null // Conversion centimes -> unités
        const paidAt = new Date().toISOString()

        // Mise à jour sécurisée avec tous les champs nécessaires pour le Push et l'Email
        const { error } = await supabase
          .from("orders")
          .update({
            status: "paid",
            payment_id: session.id,
            stripe_session_id: session.id,
            customer_email: customerEmail,
            total_paid: totalPaid,
            paid_at: paidAt,
          })
          .eq("id", orderId)

        if (error) {
          console.error("Erreur lors de la mise à jour de la commande (paid):", error)
          return new Response(JSON.stringify({ error: error.message }), { status: 500 })
        }
      }
    }

    // 3. Gestion de l'échec de paiement
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata?.order_id

      if (orderId) {
        const { error } = await supabase
          .from("orders")
          .update({ status: "payment_failed" })
          .eq("id", orderId)

        if (error) {
          console.error("Erreur lors de la mise à jour de la commande (failed):", error)
          return new Response(JSON.stringify({ error: error.message }), { status: 500 })
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err: any) {
    console.error(`Erreur Webhook: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})