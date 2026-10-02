import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// ✅ FIX 1: Version Stripe valide
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, total, shippingCost, shippingMethod, paymentMethod, userId } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Données de commande incomplètes." }, { status: 400 });
    }

    // ✅ FIX 2: Validation France/Europe uniquement
    const ALLOWED_COUNTRIES = ["France", "Belgique", "Luxembourg", "Allemagne", "Espagne", "Italie", "Pays-Bas", "Suisse"];
    const country = customer.country || "France";
    if (!ALLOWED_COUNTRIES.includes(country)) {
      return NextResponse.json({ error: `ECLOSIA livre uniquement en France/Europe. Pays reçu: ${country}` }, { status: 400 });
    }

    // ✅ FIX 3: Validation code postal France (5 chiffres)
    if (country === "France" && !/^\d{5}$/.test(customer.postalCode || "")) {
      return NextResponse.json({ error: "Code postal France invalide (5 chiffres requis)" }, { status: 400 });
    }

    const orderNumber = `ECLOSIA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Calcul sous-total
    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) * (item.quantity || 1)), 0);
   const finalShippingCost = shippingCost !== undefined ? Number(shippingCost) : 10.00;// Livraison offerte dès 10€ France

    // ✅ FIX 4: Insert dans orders avec TOUTES les colonnes réelles (31 colonnes vues sur tes screenshots)
    // Ta structure: order_number, customer_*, shipping_*, items (jsonb), total_amount, subtotal, shipping_fee, shipping_cost, user_id, etc
    const { data: orderData, error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          // Customer info
          customer_firstname: customer.firstName,
          customer_lastname: customer.lastName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_address: customer.address,
          customer_city: customer.city,
          customer_postal_code: customer.postalCode,
          customer_country: country,
          // Shipping info (tes colonnes ajoutées)
          shipping_first_name: customer.firstName,
          shipping_last_name: customer.lastName,
          shipping_email: customer.email,
          shipping_phone: customer.phone,
          shipping_address: customer.address,
          shipping_city: customer.city, // Paris, Lyon... pas Abidjan
          shipping_zip: customer.postalCode,
          shipping_method: shippingMethod || "Colissimo",
          shipping_cost: finalShippingCost, // ancien nom
          shipping_fee: finalShippingCost, // nouveau nom ECLOSIA
          // Montants
          subtotal: subtotal,
          total_amount: total || subtotal + finalShippingCost,
          // Items jsonb + user linking
          items: items, // garde le JSON complet
          user_id: userId || null, // ✅ Lien auth.users.id -> orders.user_id
          // Paiement
          payment_method: paymentMethod || "Carte bancaire",
          payment_status: "pending",
          status: "pending",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Erreur Supabase orders:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // ✅ FIX 5: Insert dans order_items avec TA VRAIE STRUCTURE (8 colonnes)
    // id, order_id, product_id, product_name, quantity, unit_price, total_price, created_at
    // D'après ton screenshot 23.19.09
    const orderItemsToInsert = await Promise.all(
      items.map(async (item: any) => {
        // Récupère product_id depuis products si item a un sku ou id
        let productId = item.product_id || item.id || null;
        let productName = item.name;

        // Si pas de product_id mais sku fourni, cherche en DB
        if (!productId && item.sku) {
          const { data: prod } = await supabase.from("products").select("id").eq("sku", item.sku).single();
          if (prod) productId = prod.id;
        }
        // Si pas de product_id, essaie par nom
        if (!productId && item.name) {
          const { data: prod } = await supabase.from("products").select("id").ilike("name", `%${item.name.substring(0, 20)}%`).limit(1).single();
          if (prod) productId = prod.id;
        }

        return {
          order_id: orderData.id,
          product_id: productId, // uuid ou null
          product_name: productName,
          quantity: item.quantity || 1,
          unit_price: Number(item.price),
          total_price: Number(item.price) * (item.quantity || 1),
        };
      })
    );

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert);
    if (itemsError) {
      console.error("Erreur order_items:", itemsError);
      // Ne bloque pas la commande, mais log
    }

    // 2. Stripe Checkout EUR
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            sku: item.sku || "",
          },
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    if (finalShippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Livraison ${shippingMethod || "Colissimo"} - France`,
          },
          unit_amount: Math.round(Number(finalShippingCost) * 100),
        },
        quantity: 1,
      });
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customer.email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderData.id}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        order_id: orderData.id,
        order_number: orderNumber,
        customer_country: country,
      },
    });

    return NextResponse.json({ url: session.url, orderId: orderData.id, orderNumber });

  } catch (err: any) {
    console.error("Erreur Stripe/Serveur:", err);
    return NextResponse.json({ error: err.message || "Erreur interne du serveur." }, { status: 500 });
  }
}
