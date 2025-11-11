import { clientWithWriteAccess } from '@/sanity/lib/client';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const unit = formData.get('unit') as string;
    const status = formData.get('status') as string;
    const birthDate = formData.get('birthDate') as string;
    const deathDate = formData.get('deathDate') as string;
    const biography = formData.get('biography') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate the required fields
    if (!name || !role || !unit || !status || !biography) {
      return new Response(
        JSON.stringify({ error: 'Name, role, unit, status, and biography are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate biography minimum length
    if (biography.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Biography must be at least 10 characters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the base memorial data
    let memorialData: any = {
      _type: 'memorial',
      name,
      role,
      unit,
      status,
      birthDate: birthDate || undefined,
      deathDate: deathDate || undefined,
      biography,
      approved: false,  // New memorials require approval by default
      featured: false,
    };

    // If there's an image, we'll need to handle it differently
    // For now, we'll store the image file in Sanity using Sanity's asset system
    if (imageFile && imageFile.size > 0) {
      // Upload image to Sanity
      const imageAsset = await clientWithWriteAccess.assets.upload('image', imageFile, {
        filename: imageFile.name,
      });

      memorialData.image = {
        _type: 'image',
        asset: {
          _ref: imageAsset._id,
        }
      };
    }

    const result = await clientWithWriteAccess.create(memorialData);

    if (result && result._id) {
      return new Response(
        JSON.stringify({ success: true, id: result._id }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Submission failed - no result returned');
    }
  } catch (error: any) {
    console.error('Error submitting memorial:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to submit memorial',
        details: error.message || 'Unknown error',
        code: error.code || 'unknown'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}