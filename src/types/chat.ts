export type SenderType = 'user' | 'assistant' | 'system';

export type ConversationStatus = 'active' | 'resolved' | 'escalated' | 'closed';

export type MessageFeedback = 'helpful' | 'unhelpful' | null;

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  content: string;
  sources?: KnowledgeSource[];
  intent?: string;
  confidence?: number;
  is_verified?: boolean;
  feedback?: MessageFeedback;
  feedback_notes?: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  session_id: string;
  user_id?: string | null;
  organization_id?: string | null;
  status: ConversationStatus;
  visitor_name?: string | null;
  visitor_email?: string | null;
  visitor_phone?: string | null;
  metadata?: Record<string, unknown>;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatEscalation {
  id: string;
  conversation_id?: string | null;
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string | null;
  message: string;
  status: 'pending' | 'in_review' | 'resolved' | 'closed';
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeSource {
  title: string;
  category: string;
  snippet: string;
  confidence: number;
}

export interface KnowledgeFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  is_active: boolean;
  priority: number;
}

export interface ChatApiResponse {
  success: boolean;
  conversationId: string;
  messageId: string;
  reply: string;
  sources: KnowledgeSource[];
  intent: string;
  confidence: number;
  isVerified: boolean;
  suggestedQuestions: string[];
  error?: string;
}
