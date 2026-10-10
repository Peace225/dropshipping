"use server"; // À ajouter si appelé depuis un composant client

import { createClient } from '@/lib/supabase/server';

export async function createConversation(title?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({ user_id: user?.id, title: title || 'Nouvelle discussion' })
    .select()
    .single();

  if (error) {
    console.error("Erreur création conversation:", error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function saveMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ai_messages')
    .insert({ conversation_id: conversationId, role, content })
    .select();

  if (error) {
    console.error("Erreur sauvegarde message:", error.message);
    throw new Error(error.message);
  }

  return data;
}