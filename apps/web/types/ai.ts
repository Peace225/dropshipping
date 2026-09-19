export type AIRole = 'user' | 'assistant' | 'system';

export interface AIConversation {
  id: string;
  user_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: AIRole;
  content: string;
  tokens_used?: number;
  created_at: string;
}