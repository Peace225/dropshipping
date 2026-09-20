import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Initialisation de Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as any,
});

// Initialisation sécurisée de Supabase avec la clé de service (Service Role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, total, shippingCost, shippingMethod, paymentMethod } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Données de commande incomplètes." }, { status: 400 });
    }

    // Génération d'un numéro de commande unique
    const orderNumber = `AURAE-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Enregistrement initial dans Supabase
    const { data: orderData, error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_firstname: customer.firstName,
          customer_lastname: customer.lastName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_address: customer.address,
          customer_city: customer.city,
          customer_postal_code: customer.postalCode,
          customer_country: customer.country || "France",
          items: items,
          shipping_method: shippingMethod || "Standard",
          shipping_cost: shippingCost || 0,
          payment_method: paymentMethod || "Carte bancaire",
          total_amount: total,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Erreur Supabase:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 2. Création de la session Stripe Checkout en Euros (EUR)
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Livraison (${shippingMethod || "Standard"})`,
          },
          unit_amount: Math.round(Number(shippingCost) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customer.email,
      success_url: `${request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/checkout`,
      metadata: {
        order_id: orderData.id,
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("Erreur Stripe/Serveur:", err);
    return NextResponse.json({ error: err.message || "Erreur interne du serveur." }, { status: 500 });
  }
}