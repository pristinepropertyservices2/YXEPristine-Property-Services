import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { Readable } from 'stream';
import { NextRequest, NextResponse } from 'next/server';

const VIDEO_PATH = '/home/candi/Music/Projects/cleaning_services/6197574-uhd_3840_2160_25fps.mp4';

export async function GET(request: NextRequest) {
  try {
    const videoStat = await stat(VIDEO_PATH);
    const fileSize = videoStat.size;
    const range = request.headers.get('range');

    if (!range) {
      const stream = createReadStream(VIDEO_PATH);
      return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': String(fileSize),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    const matches = /bytes=(\d+)-(\d*)/.exec(range);
    if (!matches) {
      return new NextResponse('Invalid range header', { status: 416 });
    }

    const start = Number(matches[1]);
    const end = matches[2] ? Number(matches[2]) : fileSize - 1;
    const chunkEnd = Math.min(end, fileSize - 1);

    if (start >= fileSize || start > chunkEnd) {
      return new NextResponse('Range not satisfiable', { status: 416 });
    }

    const stream = createReadStream(VIDEO_PATH, { start, end: chunkEnd });
    const chunkSize = chunkEnd - start + 1;

    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(chunkSize),
        'Content-Range': `bytes ${start}-${chunkEnd}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Homepage video stream error:', error);
    return NextResponse.json(
      { error: 'Failed to load homepage video' },
      { status: 500 }
    );
  }
}

