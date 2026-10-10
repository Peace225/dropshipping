import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const conversationId = body.conversationId;
    const message = (body.message || '') as string;

    if (!message || !conversationId) {
      return NextResponse.json({
        message: { role: 'assistant', content: `Bonjour ! Je suis Clara d'ECLOSIA 💚 Tapez "bebe", "maman" ou "commander"` },
        products: [], delivery_price: '10,00 €'
      });
    }

    const supabase = await createClient();
    const raw = message;
    const q = raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // FIX 1 : plus de await + .then()
    try {
      await supabase.from('ai_messages').insert({ conversation_id: conversationId, role: 'user', content: raw });
    } catch (e) { console.warn(e); }

    // FIX 2 : CONSEIL / BONJOUR - répond TOUJOURS
    if (q.includes('bonjour') || q.includes('conseil') || q.includes('conseille') || q.includes('bonsoir') || q.includes('salut') || q.includes('aide') || q.includes('comment') || q.includes('fonction') || q.includes('ici')) {
      const reply = `Bonjour ! Je suis Clara, votre conseillère ECLOSIA 💚\n\nJe vous conseille :\nBébé : Culottes Bumbuns 25,90€, Maillots 17,90€, Matelas + draps bio 74,90€\nMaman : Serviettes lavables Nuit 25,90€, Coussinets allaitement 13,90€, Carrés démaquillants 12,90€/17,90€\nLivraison : 10,00€ fixe, gratuite dès 60€ en France\n\nDites "bebe" ou "maman" pour voir la gamme !`;
      try { await supabase.from('ai_messages').insert({ conversation_id: conversationId, role: 'assistant', content: reply, metadata: { intent: 'conseil' } }); } catch {}
      return NextResponse.json({ message: { role: 'assistant', content: reply }, products: [], delivery_price: '10,00 €' });
    }

    // FIX 3 : COMMANDE
    if (q.includes('commander') || q.includes('commande') || q.includes('livraison') || q.includes('abidjan') || q.includes('acheter') || q.includes('panier')) {
      const reply = `Pour commander chez ECLOSIA 💚\n\n1. Fiche produit → J'achète (10,00€ livraison)\n2. Panier → Checkout → Paiement sécurisé\n3. 24/48h France / 10,00€ Abidjan\n\nTapez "bebe" ou "maman" !`;
      try { await supabase.from('ai_messages').insert({ conversation_id: conversationId, role: 'assistant', content: reply, metadata: { intent: 'commande' } }); } catch {}
      return NextResponse.json({ message: { role: 'assistant', content: reply }, products: [], delivery_price: '10,00 €' });
    }

    // Produits actifs - avec ton SQL ECLOSIA_18_PRODUITS_CORRIGE_SQL.sql
    let allActive: any[] = [];
    try {
      const { data } = await supabase.from('products').select('name, description, price, image_url, slug, sku, brand').eq('is_active', true).limit(18);
      allActive = data || [];
    } catch { allActive = []; }

    if (allActive.length === 0) {
      const reply = `Je suis là 💚 Nos prix : Culottes 25,90€, Maillots 17,90€, Matelas 74,90€, Coussinets 13,90€, Carrés 12,90€. Livraison 10,00€. Tapez "bebe" !`;
      return NextResponse.json({ message: { role: 'assistant', content: reply }, products: [], delivery_price: '10,00 €' });
    }

    // Filtre sécurisé contre null
    const searchTerms = q.split(' ').filter(w => w.length > 2);
    let filtered = allActive.filter(p => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return searchTerms.some(w => name.includes(w) || desc.includes(w));
    });
    if (filtered.length === 0) filtered = allActive;

    if (q.includes('bebe')) filtered = allActive.filter(p => (p.sku||'').startsWith('SKU-BUM') || (p.sku||'').includes('KITBIO'));
    if (q.includes('maman') || q.includes('lavable') || q.includes('allait')) filtered = allActive.filter(p => ['SKU-COUSAL1','SKU-BUM3','SKU-BBKJNG','SKU-CARREFUSCHIA'].includes(p.sku));

    const display = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 3);
    const context = display.map(p => `- ${p.name} (${p.price}€) : ${(p.description||'').slice(0,120)}`).join('\n');

    let reply = '';
    if (q.includes('lavable')) reply = `Oui, tout est lavable ♻ ! ${display.length} articles :\n\n${context}\n\nLivraison 10,00€ 🚚 | Oeko-Tex | UE`;
    else if (q.includes('livraison') || q.includes('abidjan')) reply = `Livraison dès 10,00€ 🚚\n\n${context}`;
    else reply = `Voici ${display.length} produits ECLOSIA pour "${raw}" :\n\n${context}\n\n🚚 10,00€ fixe | Oeko-Tex`;

    let assistantMsg = null;
    try {
      const { data } = await supabase.from('ai_messages').insert({ conversation_id: conversationId, role: 'assistant', content: reply, metadata: { model: 'eclosia-free-v3', products: display } }).select().single();
      assistantMsg = data;
    } catch {}

    return NextResponse.json({ message: assistantMsg || { role: 'assistant', content: reply }, products: display, delivery_price: '10,00 €' });

  } catch (e: any) {
    console.error('[AI_CHAT_ERROR]', e);
    // IMPORTANT : Toujours 200, jamais 500 → plus de "serveur pour le moment"
    return NextResponse.json({
      message: { role: 'assistant', content: `Bonjour ! Je suis Clara d'ECLOSIA 💚 Je suis là pour vous conseiller. Tapez "bebe", "maman" ou "commander" - Livraison 10,00€ fixe !` },
      products: [],
      delivery_price: '10,00 €'
    });
  }
}