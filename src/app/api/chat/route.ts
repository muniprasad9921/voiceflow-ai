import { NextRequest, NextResponse } from 'next/server';
import { generateGroundedResponse } from '@/lib/chat/knowledge-base';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using Service Role or Anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && secretKey)
  ? createClient(supabaseUrl, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      conversationId: clientConvId,
      sessionId,
      history = []
    } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'A valid message is required.' },
        { status: 400 }
      );
    }

    const trimmedQuery = message.trim();
    const activeSessionId = sessionId || `anon-${Date.now()}`;
    let conversationId = clientConvId;

    // 1. Generate Grounded AI Response using RAG Engine
    const grounded = await generateGroundedResponse(trimmedQuery, history);

    // 2. Database Persistence (Supabase with graceful fallback)
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    if (supabase) {
      try {
        // Ensure conversation exists or create one
        if (!conversationId) {
          const { data: convData, error: convError } = await supabase
            .from('chat_conversations')
            .insert({
              session_id: activeSessionId,
              status: 'active',
              last_message_at: new Date().toISOString()
            })
            .select('id')
            .single();

          if (!convError && convData) {
            conversationId = convData.id;
          }
        } else {
          // Update last_message_at
          await supabase
            .from('chat_conversations')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', conversationId);
        }

        // Save User Message
        if (conversationId) {
          await supabase.from('chat_messages').insert({
            conversation_id: conversationId,
            sender_type: 'user',
            content: trimmedQuery
          });

          // Save Assistant Message
          await supabase.from('chat_messages').insert({
            conversation_id: conversationId,
            sender_type: 'assistant',
            content: grounded.reply,
            sources: grounded.sources,
            intent: grounded.intent,
            confidence: grounded.confidence,
            is_verified: grounded.isVerified
          });
        }
      } catch (dbErr) {
        console.warn('Notice: Supabase chat log fallback to stateless session:', dbErr);
      }
    }

    // Default conversation ID fallback
    if (!conversationId) {
      conversationId = `conv-${Date.now()}`;
    }

    return NextResponse.json({
      success: true,
      conversationId,
      messageId,
      reply: grounded.reply,
      sources: grounded.sources,
      intent: grounded.intent,
      confidence: grounded.confidence,
      isVerified: grounded.isVerified,
      suggestedQuestions: grounded.suggestedQuestions
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('Chat API Error:', errorMsg);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process chat message. Please try again.',
        reply: "I'm having a temporary connection issue. Please contact our support team at support@voiceflow.ai or try again shortly."
      },
      { status: 500 }
    );
  }
}
