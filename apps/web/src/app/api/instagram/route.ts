import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import {
  checkVelocityStatus,
  publishToInstagram,
  ensureStorageDir,
} from '../../../../../../scripts/instagram-engine.mjs';

export const dynamic = 'force-dynamic';

// GET: Check status of auth session and daily velocity limit
export async function GET() {
  try {
    const status = checkVelocityStatus();
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to check Instagram automation status',
      },
      { status: 500 }
    );
  }
}

// POST: Execute Instagram post with compiled slides and caption
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slides = [], caption = '', headless = false, force = false, stealthMode = true } = body;

    if (!slides || slides.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one slide image is required.' },
        { status: 400 }
      );
    }

    // Save base64 slides to temporary directory
    const tempDir = path.resolve(process.cwd(), '..', '..', '.temp-instagram-uploads', `post-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const imagePaths: string[] = [];
    slides.forEach((dataUrl: string, idx: number) => {
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(tempDir, `slide_${idx + 1}.png`);
      fs.writeFileSync(filePath, buffer);
      imagePaths.push(filePath);
    });

    const logs: string[] = [];
    const handleProgress = (msg: string) => {
      logs.push(msg);
      console.log(`[Instagram Automation] ${msg}`);
    };

    // Execute bulletproof posting engine
    const result = await (publishToInstagram as any)({
      imagePaths,
      caption: caption || 'Automated multi-slide carousel via Synergy AI Engine! #marketing #synergy',
      headless: Boolean(headless),
      force: Boolean(force),
      stealthMode: Boolean(stealthMode),
      onProgress: handleProgress,
    });

    return NextResponse.json({
      success: true,
      result,
      logs,
      message: 'Post successfully published to Instagram!',
    });
  } catch (err: any) {
    console.error('[Instagram API Error]', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'An error occurred during Instagram automated publishing.',
      },
      { status: 400 }
    );
  }
}
