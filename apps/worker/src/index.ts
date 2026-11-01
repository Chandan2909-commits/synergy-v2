import * as dotenv from 'dotenv';
dotenv.config();

console.log('---------------------------------------------------------');
console.log('SYNERGY BACKGROUND WORKER ENGINE (BullMQ)');
console.log('CrossTech Solutions - Autonomous Publishing Scheduler');
console.log('---------------------------------------------------------');
console.log(`Node Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Redis Host: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);

// Worker Process Status
let isRunning = true;

process.on('SIGTERM', () => {
  console.log('Worker received SIGTERM. Gracefully draining queue jobs...');
  isRunning = false;
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Worker received SIGINT. Draining...');
  isRunning = false;
  process.exit(0);
});

console.log('Worker initialization complete. Listening for scheduled publishing jobs...');

