import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server'; // Client Supabase serveur

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    const supabase = await createClient();

    // 1. Authentification de l'utilisateur
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 2. Récupération de la commande et validation du montant
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, total_amount, customer_id')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    // 3. Conversion du montant en centimes (ex: 49.90 € -> 4990)
    const amountInCents = Math.round(Number(order.total_amount) * 100);

    // 4. Création du PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true }, // Active CB, Apple Pay, Klarna...
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
    });

    // 5. Initialisation de la transaction dans la table `payments`
    await supabase.from('payments').insert({
      order_id: order.id,
      amount: order.total_amount,
      currency: 'EUR',
      provider: 'stripe',
      transaction_id: paymentIntent.id,
      status: 'pending',
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}