import { createClient } from '@/lib/supabase/server';

export async function createConversation(title?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return await supabase
    .from('ai_conversations')
    .insert({ user_id: user?.id, title: title || 'Nouvelle discussion' })
    .select()
    .single();
}

export async function saveMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
  const supabase = await createClient();
  return await supabase
    .from('ai_messages')
    .insert({ conversation_id: conversationId, role, content });
}