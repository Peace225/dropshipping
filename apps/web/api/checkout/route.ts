import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Mise à jour de la version de l'API Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', 
});

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    // 1. VERIFICATION D'AUTHENTIFICATION CLIENT
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Session invalide ou non authentifiée.' }, { status: 401 });
    }

    // 2. RECUPÉRATION SÉCURISÉE DE LA COMMANDE ET DE L'ADRESSE
    // On vérifie strictement que la commande APPARTIENT BIEN à cet utilisateur
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        payment_status,
        shipping_address,
        customers!inner (
          user_id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', orderId)
      .eq('customers.user_id', user.id) // <--- Évite qu'un utilisateur paye la commande d'un autre
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Commande non trouvée ou accès non autorisé.' }, { status: 404 });
    }

    // 3. VÉRIFICATION QUE LA COMMANDE N'EST PAS DÉJÀ PAYÉE
    if (order.payment_status === 'paid' || order.status === 'paid') {
      return NextResponse.json({ error: 'Cette commande a déjà été réglée.' }, { status: 400 });
    }

    const amountInCents = Math.round(Number(order.total_amount) * 100);

    if (amountInCents <= 0) {
      return NextResponse.json({ error: 'Montant de commande invalide.' }, { status: 400 });
    }

    const shippingAddr = order.shipping_address as any;
    
    // Sécurité : Gère le cas où Supabase renvoie un tableau au lieu d'un objet unique
    const customerData = Array.isArray(order.customers) ? order.customers[0] : order.customers;

    // 4. CRÉATION DU PAYMENT INTENT ENRICHI POUR STRIPE RADAR
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        receipt_email: customerData?.email || user.email,
        shipping: shippingAddr?.street ? {
          name: `${shippingAddr.first_name || customerData?.first_name} ${shippingAddr.last_name || customerData?.last_name}`,
          address: {
            line1: shippingAddr.street,
            postal_code: shippingAddr.postal_code,
            city: shippingAddr.city,
            country: shippingAddr.country_code || 'FR',
          },
        } : undefined,
        metadata: {
          order_id: order.id,
          user_id: user.id,
          customer_email: customerData?.email || user.email,
        },
      },
      {
        // CLE D'IDEMPOTENCE : Empêche Stripe de recréer 2 paiements pour le même appel
        idempotencyKey: `pi_order_${order.id}`,
      }
    );

    // 5. ENREGISTREMENT EN BDD VIA CLIENT ADMIN (BYPASS RLS CÔTÉ SERVEUR SEULEMENT)
    const supabaseAdmin = createAdminClient();
    
    await supabaseAdmin.from('payments').upsert({
      order_id: order.id,
      amount: order.total_amount,
      currency: 'EUR',
      provider: 'stripe',
      transaction_id: paymentIntent.id,
      status: 'pending', // La transaction est créée, mais l'argent n'est pas encore prélevé
    }, { onConflict: 'transaction_id' });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('[PAYMENT_INTENT_ERROR]', err);
    return NextResponse.json({ error: 'Erreur lors de l initialisation du paiement.' }, { status: 500 });
  }
}