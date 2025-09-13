import { NextRequest, NextResponse } from 'next/server';

// Mockup API - simulates file conversion process
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('targetFormat') as string;
    const inputMethod = formData.get('inputMethod') as string;
    const sourceUrl = formData.get('sourceUrl') as string;

    let filename = '';
    let originalFormat = '';
    let fileSize = 0;

    if (inputMethod === 'upload' && file) {
      filename = file.name;
      originalFormat = filename.split('.').pop()?.toLowerCase() || '';
      fileSize = file.size;
    } else if (inputMethod === 'link' && sourceUrl) {
      filename = sourceUrl.split('/').pop() || 'file';
      originalFormat = filename.split('.').pop()?.toLowerCase() || '';
      // For URL-based conversions, simulate file size
      fileSize = Math.floor(Math.random() * 10000000) + 1000000; // 1-10MB
    }

    // Generate a mock conversion ID
    const conversionId = Math.random().toString(36).substr(2, 9);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response with mock data
    return NextResponse.json({ 
      success: true, 
      conversionId: conversionId,
      message: 'Conversion started successfully',
      mockData: {
        id: conversionId,
        original_filename: filename,
        original_format: originalFormat,
        target_format: targetFormat,
        file_size: fileSize,
        conversion_status: 'pending',
        input_method: inputMethod,
        source_url: inputMethod === 'link' ? sourceUrl : null,
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start conversion' },
      { status: 500 }
    );
  }
}