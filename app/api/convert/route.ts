import { NextRequest, NextResponse } from 'next/server';
import CloudConvert from 'cloudconvert';

export const dynamic = 'force-dynamic';

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY || '', false); // false = production mode

export async function POST(request: NextRequest) {
  if (!process.env.CLOUDCONVERT_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Missing API key' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const targetFormat = formData.get('targetFormat') as string;
    const inputMethod = formData.get('inputMethod') as string;
    const sourceUrl = formData.get('sourceUrl') as string;

    let job;

    if (inputMethod === 'upload') {
      job = await cloudConvert.jobs.create({
        tasks: {
          'import-file': {
            operation: 'import/upload'
          },
          'convert-file': {
            operation: 'convert',
            input: 'import-file',
            output_format: targetFormat
          },
          'export-file': {
            operation: 'export/url',
            input: 'convert-file'
          }
        }
      });

      const uploadTask = job.tasks.find(task => task.name === 'import-file');

      return NextResponse.json({
        success: true,
        jobId: job.id,
        uploadTask: uploadTask
      });

    } else if (inputMethod === 'link' && sourceUrl) {
      job = await cloudConvert.jobs.create({
        tasks: {
          'import-file': {
            operation: 'import/url',
            url: sourceUrl
          },
          'convert-file': {
            operation: 'convert',
            input: 'import-file',
            output_format: targetFormat
          },
          'export-file': {
            operation: 'export/url',
            input: 'convert-file'
          }
        }
      });

      return NextResponse.json({
        success: true,
        jobId: job.id
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid input method' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start conversion' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!process.env.CLOUDCONVERT_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Missing API key' },
      { status: 500 }
    );
  }

  const jobId = request.nextUrl.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ success: false, error: 'Missing jobId' }, { status: 400 });
  }

  try {
    const job = await cloudConvert.jobs.get(jobId);
    const exportTask = job.tasks.find(task => task.name === 'export-file');
    const importTask = job.tasks.find(task => task.name === 'import-file');
    const convertTask = job.tasks.find(task => task.name === 'convert-file');

    // Collect any error messages from tasks
    const errors = job.tasks
      .filter(task => task.status === 'error')
      .map(task => ({
        name: task.name,
        message: task.message,
        code: task.code
      }));

    return NextResponse.json({
      success: true,
      status: job.status,
      job: job,
      exportUrl: exportTask?.result?.files?.[0]?.url,
      originalFilename: importTask?.result?.files?.[0]?.filename,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Job status error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get job status' }, { status: 500 });
  }
}