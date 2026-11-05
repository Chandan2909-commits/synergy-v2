import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const scriptPath = path.resolve(process.cwd(), '..', '..', 'scripts', 'instagram-login.mjs');

    // Spawn node process to open Chrome window on desktop
    const child = spawn('node', [scriptPath], {
      detached: true,
      stdio: 'inherit',
      cwd: path.resolve(process.cwd(), '..', '..'),
    });
    child.unref();

    return NextResponse.json({
      success: true,
      message:
        'Launched Instagram Chrome login window! Please check your desktop screen, log in manually to Instagram, and complete 2FA.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to spawn login process' },
      { status: 500 }
    );
  }
}
