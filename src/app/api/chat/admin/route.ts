import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && secretKey)
  ? createClient(supabaseUrl, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    if (!supabase) {
      return NextResponse.json({
        success: true,
        conversations: [],
        escalations: [],
        unverifiedCount: 0
      });
    }

    let query = supabase
      .from('chat_conversations')
      .select(`
        id,
        session_id,
        user_id,
        status,
        visitor_name,
        visitor_email,
        visitor_phone,
        last_message_at,
        created_at,
        chat_messages (
          id,
          sender_type,
          content,
          is_verified,
          feedback,
          created_at
        )
      `)
      .order('last_message_at', { ascending: false })
      .limit(50);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`visitor_name.ilike.%${search}%,visitor_email.ilike.%${search}%`);
    }

    const { data: conversations, error: convError } = await query;

    if (convError) {
      console.warn('Admin fetch error:', convError.message);
      return NextResponse.json({ success: true, conversations: [], escalations: [] });
    }

    // Fetch escalations
    const { data: escalations } = await supabase
      .from('chat_escalations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      success: true,
      conversations: conversations || [],
      escalations: escalations || []
    });
  } catch (error) {
    console.error('Admin Chat API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch conversations.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { conversationId, status } = await req.json();

    if (!conversationId || !status || !['active', 'resolved', 'escalated', 'closed'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid parameters.' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    await supabase
      .from('chat_conversations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Update Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update conversation.' }, { status: 500 });
  }
}
