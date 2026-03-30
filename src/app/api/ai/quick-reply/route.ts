import { NextRequest, NextResponse } from 'next/server';
import { suggestReplyOptions } from '@/ai/flows/relationship-ai-assistant';

export async function POST(request: NextRequest) {
  try {
    const { letterContent, senderName } = await request.json();

    if (!letterContent) {
      return NextResponse.json(
        { error: 'Missing letterContent' },
        { status: 400 }
      );
    }

    const result = await suggestReplyOptions({
      receivedMessage: letterContent,
      preferredTone: 'warm',
      relationshipContext: senderName ? `Mensaje de ${senderName}` : 'Una carta especial',
      language: 'es',
    });

    // Transform the result to match the expected format
    const replies = result.replies.map((reply, idx) => ({
      id: String(idx + 1),
      tone: reply.label,
      text: reply.text,
    }));

    return NextResponse.json({ replies });
  } catch (error) {
    console.error('Error generating quick replies:', error);
    return NextResponse.json(
      { error: 'Failed to generate replies' },
      { status: 500 }
    );
  }
}
