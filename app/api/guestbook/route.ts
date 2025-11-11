import { clientWithWriteAccess } from '@/sanity/lib/client';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { author, message, location } = await request.json();

    // Validate the input
    if (!author || !message) {
      return new Response(
        JSON.stringify({ error: 'Author and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate message length
    if (message.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Message must be at least 10 characters long' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const guestbookData = {
      _type: 'guestbook',
      author,
      message,
      location: location || 'Visitor',
      approved: false,
      submittedAt: new Date().toISOString(),
    };

    const result = await clientWithWriteAccess.create(guestbookData);

    if (result && result._id) {
      return new Response(
        JSON.stringify({ success: true, id: result._id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Submission failed - no result returned');
    }
  } catch (error: any) {
    console.error('Error submitting guestbook entry:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to submit guestbook entry',
        details: error.message || 'Unknown error',
        code: error.code || 'unknown'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}