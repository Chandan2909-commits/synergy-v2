import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import {
  getScheduledPosts,
  addScheduledPost,
  removeScheduledPost,
  updateScheduledPost,
  ensureStorageDir,
} from '../../../../../../../scripts/instagram-engine.mjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = getScheduledPosts();
    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve scheduled posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, slides = [], caption = '', scheduledFor, platforms = ['instagram'] } = body;

    if (!slides || slides.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one slide image is required to schedule a post.' },
        { status: 400 }
      );
    }

    if (!scheduledFor) {
      return NextResponse.json(
        { success: false, error: 'A scheduled date and time is required.' },
        { status: 400 }
      );
    }

    const postId = id || `sched-ig-${Date.now()}`;
    const isCloud = Boolean(
      process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY
    );

    // Save slides to persistent scheduled uploads directory
    const baseStorage = isCloud
      ? path.join('/tmp', 'storage', 'instagram', 'scheduled', postId)
      : path.resolve(process.cwd(), 'storage', 'instagram', 'scheduled', postId);

    fs.mkdirSync(baseStorage, { recursive: true });

    const slidePaths: string[] = [];
    slides.forEach((dataUrl: string, idx: number) => {
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(baseStorage, `slide_${idx + 1}.png`);
      fs.writeFileSync(filePath, buffer);
      slidePaths.push(filePath);
    });

    const newPost = {
      id: postId,
      title: title || 'Scheduled Multi-Slide Carousel',
      slides, // Keep preview data URLs
      slidePaths, // Local paths for Playwright execution
      caption,
      scheduledFor,
      status: 'scheduled' as const,
      platform: 'instagram',
      platforms,
      createdAt: new Date().toISOString(),
    };

    addScheduledPost(newPost);

    return NextResponse.json({
      success: true,
      post: newPost,
      message: `Post successfully scheduled for ${new Date(scheduledFor).toLocaleString()}!`,
    });
  } catch (err: any) {
    console.error('[Schedule API Error]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to schedule post' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });
    }

    removeScheduledPost(id);
    return NextResponse.json({ success: true, message: `Scheduled post ${id} removed.` });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to remove scheduled post' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, error } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });
    }

    const updated = updateScheduledPost(id, {
      status,
      error: error || undefined,
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update scheduled post' },
      { status: 500 }
    );
  }
}
