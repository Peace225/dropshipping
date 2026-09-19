import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendOrderNotifications } from '@/lib/notifications/order-notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Alignement sur la version installée précédemment
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature Stripe manquante.' }, { status: 400 });
  }

  let event: Stripe.Event;

  // 1. VÉRIFICATION STRICTE DE LA SIGNATURE WEBHOOK
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`[WEBHOOK_SIGNATURE_FAILED] ${err.message}`);
    return NextResponse.json({ error: 'Signature Webhook invalide.' }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  // NOTE : Si vous utilisez Stripe Checkout, l'événement recommandé est 'checkout.session.completed'. 
  // Si vous utilisez les PaymentElements directs, 'payment_intent.succeeded' est correct.
  if (event.type === 'payment_intent.succeeded') {
    const payloadIntent = event.data.object as Stripe.PaymentIntent;

    // 2. DOUBLE SÉCURITÉ : Récupération en direct de l'état réel auprès de Stripe
    const verifiedIntent = await stripe.paymentIntents.retrieve(payloadIntent.id);

    if (verifiedIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Paiement non confirmé par l API Stripe.' }, { status: 400 });
    }

    const orderId = verifiedIntent.metadata.order_id;
    const userId = verifiedIntent.metadata.user_id;

    if (!orderId) {
      console.error('[WEBHOOK_ERROR] order_id manquant dans les métadonnées.');
      return NextResponse.json({ error: 'Métadonnées incomplètes.' }, { status: 400 });
    }

    // 3. RÉCUPÉRATION DE LA COMMANDE ET DES DONNÉES CLIENT POUR LES NOTIFICATIONS
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        total_amount,
        order_number,
        customers (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('[WEBHOOK_ERROR] Commande introuvable en base de données.');
      return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
    }

    // Vérification anti-fraude du montant (Stripe fonctionne en centimes)
    if (Math.round(Number(order.total_amount) * 100) !== verifiedIntent.amount) {
      console.error('[ALERT_FRAUD] Le montant payé ne correspond pas au total en BDD !');
      return NextResponse.json({ error: 'Incohérence de montant détectée.' }, { status: 400 });
    }

    // 4. MISE À JOUR TRANSACTIONNELLE
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'success',
        paid_at: new Date(verifiedIntent.created * 1000).toISOString(),
      })
      .eq('transaction_id', verifiedIntent.id);

    await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing',
      })
      .eq('id', orderId);

    // Vidage du panier si l'utilisateur est connecté
    if (userId) {
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
    }

    // 5. DÉCLENCHEMENT DES NOTIFICATIONS (EMAIL & SMS)
    // L'exécution se fait en arrière-plan grâce au composant importé
    try {
      // On s'assure que customers est bien un objet unique (relation 1-to-1)
      const customerData = Array.isArray(order.customers) ? order.customers[0] : order.customers;

      if (customerData) {
        await sendOrderNotifications({
          orderNumber: order.order_number || order.id.slice(0, 8).toUpperCase(),
          totalAmount: `${Number(order.total_amount).toFixed(2)} €`,
          customerName: `${customerData.first_name} ${customerData.last_name}`,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
        });
      }
    } catch (notificationError) {
      // On log l'erreur mais on ne bloque pas la réponse 200 au Webhook de Stripe
      console.error('[WEBHOOK_NOTIFICATION_FAILED]', notificationError);
    }
  }

  return NextResponse.json({ received: true });
}