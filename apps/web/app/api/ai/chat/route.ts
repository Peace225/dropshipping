import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const conversationId = body.conversationId;
    const message = ((body.message || '') as string).trim();

    if (!message || !conversationId) {
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: `Bonjour ! Je suis Clara d'ECLOSIA 💚 Votre conseillère maternité & bébé. Posez-moi tout : allaitement, sommeil, lavage, tailles...`,
        },
        products: [],
        delivery_price: '10,00 €',
      });
    }

    const supabase = await createClient();

    try {
      await supabase
        .from('ai_messages')
        .insert({ conversation_id: conversationId, role: 'user', content: message });
    } catch {}

    // INJECTION DYNAMIQUE des produits actifs
    let allActive: any[] = [];
    try {
      const { data } = await supabase
        .from('products')
        .select('name, description, price, image_url, slug, sku, brand')
        .eq('is_active', true)
        .limit(18);
      allActive = data || [];
    } catch {
      allActive = [];
    }

    const catalogueContext = allActive
      .map(
        (p) =>
          `• ${p.name || ''} | SKU ${p.sku || ''} | ${p.price || 0}€ | Marque ${p.brand || 'Eclosia'} | ${(p.description || '').slice(0, 250)} | Lien /bebe/${p.slug || ''}`
      )
      .join('\n');

    // 1. PROMPT SYSTÈME EXPERT (Clara)
    const systemPrompt = `
Tu es Clara, conseillère bienveillante experte en puériculture, allaitement et bien-être post-partum pour ECLOSIA, boutique française.

TON RÔLE :
- Répondre à N'IMPORTE QUELLE question : conseils d'allaitement, astuces sommeil bébé, retours, délais, composition tissus, bien-être post-partum, lavage, fuites, régurgitations...
- Être chaleureuse, rassurante, comme une amie maman expérimentée. Utilise 💚
- Toujours guider naturellement vers un produit ECLOSIA quand c'est pertinent

CATALOGUE RÉEL FRANCE 18 PRODUITS (prix TTC définitifs - injection dynamique) :
${catalogueContext}

RÈGLES FRANCE OBLIGATOIRES :
- Livraison : 10,00€ fixe, gratuite dès 60€, expédition 24/48h depuis la France. Ne JAMAIS parler d'Abidjan ou autre pays.
- Fabrication : INTERDIT de dire "UE", "Union Européenne", "Europe". Dire : "Qualité premium", "Oeko-Tex", "Bambou lavable", "Durable et écologique"
- Prix : Utilise UNIQUEMENT les prix ci-dessus. Exemple : Culottes So Protect 25,90€, Maillots 17,90€, Matelas 40x80 + 3 draps bio 74,90€, Serviettes Nuit 25,90€, Coussinets 13,90€, Carrés 12,90€/17,90€
- Infos boutique : Retours 10 jours gratuits, Garantie 12 mois, Paiement sécurisé
- Composition : Bambou, coton bio, PU lavable, Oeko-Tex
- Conseil : Toujours expliquer le bénéfice (économique, écologique, douceur pour bébé/maman)

Tu ne bloques JAMAIS. Tu réponds à tout.
`;

    // 2. APPEL OPENAI SÉCURISÉ
    let aiReply = '';
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });
        aiReply = completion.choices[0]?.message?.content || '';
      } catch (e: any) {
        console.error('OpenAI error:', e?.message || e);
      }
    }

    if (!aiReply) {
      aiReply = `Je suis là pour vous aider 💚 Dites-moi votre question sur bébé ou maman, je vous conseille avec nos produits lavables ECLOSIA.\n\nNos essentiels France : Culottes 25,90€, Maillots 17,90€, Matelas 74,90€, Serviettes Nuit 25,90€, Coussinets 13,90€, Carrés 12,90€.\nLivraison France 10,00€ fixe, gratuite dès 60€ - 24/48h.`;
    }

    // 3. SÉLECTION SÉCURISÉE DES 3 PRODUITS
    const q = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let filtered = allActive.filter((p) => {
      const haystack = `${p.name || ''} ${p.description || ''} ${p.sku || ''}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return q
        .split(' ')
        .filter((w) => w.length > 2)
        .some((w) => haystack.includes(w));
    });

    if (filtered.length === 0) {
      if (q.includes('allait') || q.includes('fuite') || q.includes('sein')) {
        filtered = allActive.filter((p) => ['SKU-COUSAL1', 'SKU-BUM3'].includes(p.sku || ''));
      } else if (
        q.includes('bebe') ||
        q.includes('sommeil') ||
        q.includes('matelas') ||
        q.includes('couche') ||
        q.includes('culotte')
      ) {
        filtered = allActive.filter(
          (p) => (p.sku || '').startsWith('SKU-BUM') || (p.sku || '').includes('KITBIO')
        );
      } else if (q.includes('maman') || q.includes('post-partum') || q.includes('demaquillant')) {
        filtered = allActive.filter((p) => ['SKU-BBKJNG', 'SKU-CARREFUSCHIA'].includes(p.sku || ''));
      } else {
        filtered = allActive;
      }
    }

    const display = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 3);

    try {
      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiReply,
        metadata: { model: 'clara-france-v6-experte', products: display },
      });
    } catch {}

    return NextResponse.json({
      message: { role: 'assistant', content: aiReply },
      products: display,
      delivery_price: '10,00 €',
    });
  } catch (e: any) {
    console.error('[AI_CHAT_ERROR]', e);
    return NextResponse.json({
      message: {
        role: 'assistant',
        content: `Bonjour, je suis Clara 💚 Je réponds à toutes vos questions maternité et bébé. Posez votre question ! Livraison France 10,00€.`,
      },
      products: [],
      delivery_price: '10,00 €',
    });
  }
}