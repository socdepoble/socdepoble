import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, callback);
    else callback(p);
  });
}

walk('./src', file => {
  if (!/\.(js|jsx|ts|tsx)$/.test(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/z-\[var\(--z-fixed,100\)]/g, 'z-[100]')
    .replace(/z-\[var\(--z-sticky,200\)]/g, 'z-sticky')
    .replace(/z-\[var\(--z-overlay,9998\)]/g, 'z-overlay')
    .replace(/z-\[var\(--z-drawer,900\)]/g, 'z-[900]')
    .replace(/z-\[var\(--z-modal,500\)]/g, 'z-modal')
    .replace(/h-\[env\(safe-area-inset-top,0px\)\+56px\]/g, 'h-[calc(env(safe-area-inset-top,0px)+56px)]')
    .replace(/pt-\[env\(safe-area-inset-top,0px\)\]/g, 'pt-safe-top')
    .replace(/top-\[max\(env\(safe-area-inset-top\),0\.5rem\)\]/g, 'top-[max(env(safe-area-inset-top),0.5rem)]')
    .replace(/rounded-\[var\(--radius-mestre,2rem\)]/g, 'rounded-mestre')
    .replace(/rounded-\[length:var\(--sp-radius-mestre,28px\)]/g, 'rounded-mestre')
    .replace(/rounded-\[var\(--radius-base\)]/g, 'rounded-base')
    .replace(/rounded-\[var\(--radius-genesis\)]/g, 'rounded-genesis')
    .replace(/rounded-\[var\(--radius-tactile\)]/g, 'rounded-tactile')
    .replace(/z-\[var\(--z-max\)]/g, 'z-max')
    .replace(/z-\[var\(--z-nav\)]/g, 'z-nav')
    .replace(/z-\[var\(--z-sidebar\)]/g, 'z-sidebar')
    .replace(/pt-\[max\(env\(safe-area-inset-top\),1rem\)\]/g, 'pt-[max(env(safe-area-inset-top),1rem)]'); // Just in case
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed', file);
  }
});
