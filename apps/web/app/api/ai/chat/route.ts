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
          products: [],
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

    // INJECTION DYNAMIQUE des 58 variantes actives (limit 60)
    let allActive: any[] = [];
    try {
      const { data } = await supabase
        .from('products')
        .select('name, description, price, image_url, slug, sku, brand')
        .eq('is_active', true)
        .limit(60);
      allActive = data || [];
    } catch {
      allActive = [];
    }

    // Ajout de image_url dans catalogueContext (compatible cleanImageUrl)
    const catalogueContext = allActive
      .map(
        (p) =>
          `• ${p.name || ''} | SKU ${p.sku || ''} | ${p.price || 0}€ | Marque ${p.brand || 'Eclosia'} | ${(p.description || '').slice(0, 250)} | Image ${p.image_url || ''} | Lien /bebe/${p.slug || ''}`
      )
      .join('\n');

    // 1. PROMPT SYSTÈME EXPERT (Clara)
    const systemPrompt = `
Tu es Clara, conseillère bienveillante experte en puériculture, allaitement et bien-être post-partum pour ECLOSIA, boutique française.

TON RÔLE :
- Répondre à N'IMPORTE QUELLE question : conseils d'allaitement, astuces sommeil bébé, retours, délais, composition tissus, bien-être post-partum, lavage, fuites, régurgitations...
- Être chaleureuse, rassurante, comme une amie maman expérimentée. Utilise 💚
- Toujours guider naturellement vers un produit ECLOSIA quand c'est pertinent.
- N'utilise JAMAIS d'astérisques (**) dans tes réponses.
- INTERDIT ABSOLU d'inclure des liens hypertextes ou des URL (ex: [texte](url) ou https://...) dans ton texte. Présente simplement les produits textuellement, le site affichera les fiches et images automatiquement en dessous.

CATALOGUE RÉEL FRANCE (58 variantes actives - prix TTC définitifs - injection dynamique) :
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

    // Nettoyage rigoureux des "**" et de tout lien Markdown accidentel
    aiReply = aiReply
      .replace(/\*\*/g, '')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

    // 3. SÉLECTION DES 3 PRODUITS (basée sur la réponse de Clara + la question du client)
    const combinedSearch = `${message} ${aiReply}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    let filtered = allActive.filter((p) => {
      const pName = (p.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const pSku = (p.sku || '').toLowerCase();
      const keywords = pName.split(' ').filter((w: string) => w.length > 3).slice(0, 2).join(' ');
      return (keywords && combinedSearch.includes(keywords)) || (pSku && combinedSearch.includes(pSku));
    });

    if (filtered.length === 0) {
      if (combinedSearch.includes('allait') || combinedSearch.includes('fuite') || combinedSearch.includes('sein')) {
        filtered = allActive.filter((p) => ['SKU-COUSAL1', 'SKU-BUM3'].includes(p.sku || ''));
      } else if (
        combinedSearch.includes('bebe') ||
        combinedSearch.includes('sommeil') ||
        combinedSearch.includes('matelas') ||
        combinedSearch.includes('couche') ||
        combinedSearch.includes('culotte') ||
        combinedSearch.includes('langer') ||
        combinedSearch.includes('coussin') ||
        combinedSearch.includes('chaise')
      ) {
        filtered = allActive.filter(
          (p) => (p.sku || '').startsWith('SKU-BUM') || (p.sku || '').includes('KITBIO') || (p.name || '').toLowerCase().includes('coussin')
        );
      } else if (combinedSearch.includes('maman') || combinedSearch.includes('post-partum') || combinedSearch.includes('demaquillant')) {
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
      message: {
        role: 'assistant',
        content: aiReply,
        products: display,
        metadata: { products: display },
      },
      products: display,
      delivery_price: '10,00 €',
    });
  } catch (e: any) {
    console.error('[AI_CHAT_ERROR]', e);
    return NextResponse.json({
      message: {
        role: 'assistant',
        content: `Bonjour, je suis Clara 💚 Je réponds à toutes vos questions maternité et bébé. Posez votre question ! Livraison France 10,00€.`,
        products: [],
      },
      products: [],
      delivery_price: '10,00 €',
    });
  }
}