import { clientWithWriteAccess } from '@/sanity/lib/client';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { author, message, relationship, memorialId } = await request.json();

    // Validate the input
    if (!author || !message || !relationship) {
      return new Response(
        JSON.stringify({ error: 'Author, message, and relationship are required' }),
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

    const tributeData = {
      _type: 'tribute',
      author,
      message,
      relationship,
      approved: false,
      memorial: memorialId ? {
        _type: 'reference',
        _ref: memorialId,
      } : undefined, // Add memorial reference if provided
      submittedAt: new Date().toISOString(),
    };

    const result = await clientWithWriteAccess.create(tributeData);

    if (result && result._id) {
      return new Response(
        JSON.stringify({ success: true, id: result._id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Submission failed - no result returned');
    }
  } catch (error: any) {
    console.error('Error submitting tribute:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to submit tribute',
        details: error.message || 'Unknown error',
        code: error.code || 'unknown'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}