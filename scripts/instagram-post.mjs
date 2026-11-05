#!/usr/bin/env node
import { publishToInstagram, checkVelocityStatus } from './instagram-engine.mjs';
import path from 'path';
import fs from 'fs';

console.log('================================================================');
console.log('SYNERGY INSTAGRAM AUTOMATED PUBLISHER');
console.log('================================================================');

const status = checkVelocityStatus();
console.log(`Session Auth Present: ${status.hasAuthSession ? 'YES' : 'NO'}`);
console.log(`Posts Today: ${status.postsCountToday} / ${status.maxDaily} allowed`);

if (!status.hasAuthSession) {
  console.error('\n⚠️ Please run "npm run ig:login" first to capture your login session.\n');
  process.exit(1);
}

// Check for test image or arguments
const args = process.argv.slice(2);
let imagePaths = [];
let caption = 'Automated publication test from Synergy AI Content Engine! #marketing #automation #synergy';

if (args.length > 0) {
  imagePaths = args.map((a) => path.resolve(process.cwd(), a));
} else {
  // Check default photo.jpg or sample image
  const samplePath = path.resolve(process.cwd(), 'photo.jpg');
  if (fs.existsSync(samplePath)) {
    imagePaths = [samplePath];
  }
}

if (imagePaths.length === 0) {
  console.log('\nUsage: node scripts/instagram-post.mjs [path-to-image-1.png] [path-to-image-2.png] ...');
  console.log('Or use the "⚡ Auto-Post to Instagram" button directly inside Content Studio or Templates in Synergy web UI!');
  process.exit(0);
}

console.log('\nPublishing images:', imagePaths);
console.log('Caption:', caption);

publishToInstagram({
  imagePaths,
  caption,
  headless: false, // Visible so user can watch Playwright execute
  stealthMode: true,
  onProgress: (msg) => console.log(msg),
})
  .then((res) => {
    console.log('\n🎉 COMPLETED:', res.message);
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ FAILED:', err.message);
    process.exit(1);
  });

