export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();
    const orderId = body.orderId || body.order_id;
    const status = body.status;
    
    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId/status manquant' }, { status: 400 });
    }

    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

    const userId = order.user_id;
    const shortId = orderId.slice(0, 8).toUpperCase();
    const totalAmount = Number(order.total_amount || order.total || 0).toFixed(2);

    const { data: userProfile } = await supabase.from('users').select('email, phone').eq('id', userId).single();
    const { data: pushData } = await supabase.from('push_tokens').select('token').eq('user_id', userId).order('created_at', { ascending: false }).limit(1);

    const finalPhone = (order.shipping_address as any)?.phone || userProfile?.phone || null;
    const finalEmail = userProfile?.email || (order as any).customer_email || null;
    const pushToken = pushData?.[0]?.token || null;

    let title = "Mise à jour ECLOSIA 🌿";
    let messageBody = `Votre commande #${shortId} a évolué.`;
    let notifType = status;

    if (['validated','paid','processing'].includes(status)) {
      title = "Commande validée! ✅";
      messageBody = `Votre commande #${shortId} (${totalAmount}€) est validée. Culotte SKU-BUM1 25,90€, Matelas SKU-KITBIO40X80M2 74,90€. Préparation en cours. Livraison 10,00€ (offerte dès 60€).`;
      notifType = 'validated';
    } else if (status === 'shipped') {
      title = "Colis en route! 🚚";
      messageBody = `Votre commande #${shortId} est en route! Suivi: ${order.tracking_number || 'en cours'}. Livraison 10,00€ prévue sous 48h. ECLOSIA 75 rue de Rivoli.`;
      notifType = 'shipped';
    } else if (status === 'delivered') {
      title = "Commande livrée! ✨";
      messageBody = `Votre commande #${shortId} livrée! Merci pour votre confiance ECLOSIA.`;
      notifType = 'delivered';
    }

    await supabase.from('notifications').insert({ 
      user_id: userId, 
      order_id: orderId, 
      title, 
      message: messageBody, 
      type: notifType 
    });

    let notificationSent = { push: false, sms: false, email: false };

    if (pushToken && process.env.ONESIGNAL_APP_ID && process.env.ONESIGNAL_API_KEY) {
      const r = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${process.env.ONESIGNAL_API_KEY}` },
        body: JSON.stringify({ 
          app_id: process.env.ONESIGNAL_APP_ID, 
          include_player_ids: [pushToken], 
          headings: { en: title }, 
          contents: { en: messageBody } 
        })
      });
      if (r.ok) notificationSent.push = true;
    }

    if (finalPhone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const cred = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${cred}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 
          To: finalPhone, 
          From: process.env.TWILIO_PHONE_NUMBER!, 
          Body: `ECLOSIA: ${messageBody}` 
        })
      });
      if (r.ok) notificationSent.sms = true;
    }

    if (finalEmail && process.env.RESEND_API_KEY) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({ 
          from: 'ECLOSIA <contact@eclosia.shop>', 
          to: [finalEmail], 
          subject: title, 
          html: `<div style="font-family:sans-serif;padding:20px;background:#FAF7F2;border-radius:12px"><h2 style="color:#6E857B">ECLOSIA</h2><p>${messageBody}</p></div>` 
        })
      });
      if (r.ok) notificationSent.email = true;
    }

    return NextResponse.json({ success: true, notificationSent });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}