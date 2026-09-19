import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 🛑 COMMENTÉ TANT QUE LA CLÉ API N'EST PAS DISPONIBLE
// import OpenAI from 'openai';
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export async function POST(req: Request) {
  try {
    const { conversationId, message } = await req.json();

    if (!message || !conversationId) {
      return NextResponse.json(
        { error: 'conversationId et message sont requis.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // 1. Sauvegarde du message de l'utilisateur
    const { error: userMsgError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message,
      });

    if (userMsgError) {
      throw new Error(`Erreur lors de la sauvegarde du message : ${userMsgError.message}`);
    }

    // 2. Extraction du catalogue produits (La base de données continue de fonctionner)
    const { data: products } = await supabase
      .from('products')
      .select('name, description, price')
      .eq('is_active', true)
      .limit(30); 

    const productsContext = products
      ?.map((p) => `- ${p.name} (${p.price}€) : ${p.description}`)
      .join('\n') || 'Aucun produit disponible.';

    // 3. Récupération de l'historique récent
    const { data: history } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    // 4. Construction du Prompt (Préparé pour plus tard, n'engendre aucun coût)
    const systemPrompt = {
      role: 'system' as const,
      content: `Tu es AURAE... (Catalogue : ${productsContext})`,
    };

    const formattedMessages = [
      systemPrompt,
      ...(history || []).map((msg) => ({ 
        role: msg.role as 'user' | 'assistant' | 'system', 
        content: msg.content 
      })),
    ];

    // 5. 🛑 APPEL OPENAI COMMENTÉ
    /*
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500,
    });
    const aiResponseText = completion.choices[0].message.content || 'Erreur.';
    */

    // 5. ✅ MODE SIMULATION : Réponse factice gratuite
    const aiResponseText = "Ceci est une réponse de test (mode simulation). J'ai bien reçu votre message et je trouve vos produits dans la base de données !";

    // 6. Sauvegarde de la réponse IA simulée
    const { data: assistantMsg, error: assistantMsgError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponseText,
        metadata: { model: 'simulation-locale' },
      })
      .select()
      .single();

    if (assistantMsgError) {
      throw new Error(`Erreur lors de l'enregistrement de la réponse IA : ${assistantMsgError.message}`);
    }

    return NextResponse.json({ message: assistantMsg });
  } catch (error: any) {
    console.error('[AI_CHAT_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur.' }, { status: 500 });
  }
}