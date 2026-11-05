import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const zipPath = path.resolve(process.cwd(), 'public', 'downloads', 'synergy-social-assistant.zip');

    if (!fs.existsSync(zipPath)) {
      return NextResponse.json({ error: 'Extension bundle not found.' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(zipPath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="synergy-social-assistant.zip"',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to download extension' }, { status: 500 });
  }
}
