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
    const { messageId, feedback, notes } = await req.json();

    if (!feedback || !['helpful', 'unhelpful'].includes(feedback)) {
      return NextResponse.json(
        { success: false, error: 'Valid feedback (helpful | unhelpful) is required.' },
        { status: 400 }
      );
    }

    if (supabase && messageId && !messageId.startsWith('msg-')) {
      try {
        await supabase
          .from('chat_messages')
          .update({
            feedback,
            feedback_notes: notes || null
          })
          .eq('id', messageId);
      } catch (err) {
        console.warn('Feedback update notice:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!'
    });
  } catch (error) {
    console.error('Feedback API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record feedback.' },
      { status: 500 }
    );
  }
}
