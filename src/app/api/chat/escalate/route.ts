import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && secretKey)
  ? createClient(supabaseUrl, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export async function POST(req: NextRequest) {
  try {
    const {
      conversationId,
      name,
      email,
      phone,
      message
    } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and a message description are required.' },
        { status: 400 }
      );
    }

    const ticketId = `TICK-${Date.now().toString().slice(-6)}`;

    if (supabase) {
      try {
        // Record in chat_escalations
        await supabase.from('chat_escalations').insert({
          conversation_id: (conversationId && !conversationId.startsWith('conv-')) ? conversationId : null,
          visitor_name: name.trim(),
          visitor_email: email.trim(),
          visitor_phone: phone ? phone.trim() : null,
          message: message.trim(),
          status: 'pending'
        });

        // Mark conversation as escalated
        if (conversationId && !conversationId.startsWith('conv-')) {
          await supabase
            .from('chat_conversations')
            .update({
              status: 'escalated',
              visitor_name: name.trim(),
              visitor_email: email.trim(),
              visitor_phone: phone ? phone.trim() : null
            })
            .eq('id', conversationId);
        }
      } catch (err) {
        console.warn('Escalation persistence notice:', err);
      }
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: `Your request has been received (Ticket ID: ${ticketId}). Our team will review your inquiry and follow up at ${email}. (Please note: live human operators are not in-chat, but your request has been prioritized).`
    });
  } catch (error) {
    console.error('Escalation API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create support escalation.' },
      { status: 500 }
    );
  }
}
