import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // 2. Récupération de l'historique récent de la discussion pour le contexte
    const { data: history } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    // Prompt système personnalisé pour la Conseillère IA AURAE
    const systemPrompt = {
      role: 'system',
      content: 'Tu es la conseillère IA experte d AURAE, une boutique e-commerce haut de gamme spécialisée en soins, beauté et produits maman & bébé. Tu réponds avec bienveillance, précision et professionnalisme pour orienter le client.',
    };

    const formattedMessages = [
      systemPrompt,
      ...(history || []).map((msg) => ({ role: msg.role, content: msg.content })),
    ];

    // 3. Exemple de réponse générée par l'IA (À remplacer par votre appel LLM / OpenAI SDK)
    const aiResponseText = `Merci de votre question. En tant que conseillère AURAE, je vous recommande notre gamme de soins doux adaptés à votre besoin.`;

    // 4. Sauvegarde de la réponse de l'assistant IA
    const { data: assistantMsg, error: assistantMsgError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponseText,
        metadata: { model: 'aurae-advisor-v1' },
      })
      .select()
      .single();

    if (assistantMsgError) {
      throw new Error(`Erreur lors de l enregistrement de la réponse IA : ${assistantMsgError.message}`);
    }

    return NextResponse.json({ message: assistantMsg });
  } catch (error: any) {
    console.error('[AI_CHAT_ERROR]', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur.' }, { status: 500 });
  }
}