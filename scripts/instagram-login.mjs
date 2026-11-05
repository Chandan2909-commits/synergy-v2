#!/usr/bin/env node
import { recordInstagramLogin } from './instagram-engine.mjs';

console.log('================================================================');
console.log('SYNERGY INSTAGRAM SESSION RECORDER (Playwright)');
console.log('================================================================');
console.log('This script will launch Chrome so you can log in manually to Instagram.');
console.log('Once logged in, your session state will be safely saved to storage/instagram/auth.json\n');

recordInstagramLogin((msg) => console.log(msg))
  .then((res) => {
    console.log('\nSUCCESS! Session saved at:', res.authPath);
    console.log('You can now run automated posts safely from Synergy Content Studio & Templates!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\nERROR:', err.message);
    process.exit(1);
  });

