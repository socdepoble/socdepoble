const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/features/DesignSystem.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace `group-hover:` with `group-data-[active=true]:`
content = content.replace(/group-hover:/g, 'group-data-[active=true]:');

// We need to find elements with className="... group ..." and add the pointer events.
// A simple regex might be tricky. Let's just find `group"` or `group "` or `group` at the end of className
const groupRegex = /(className="[^"]*\bgroup\b[^"]*")/g;
content = content.replace(groupRegex, (match) => {
  // If it already has onPointerEnter, skip
  if (match.includes('onPointerEnter')) return match;
  
  // We add the pointer events right after className
  return match + ` data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}`;
});

// Also replace hover: in the same elements with group, but let's just do it manually for the known lines:
// Lines 1113, 1364, 1368, 1465 have `hover:` which we need to change to `active:`
// E.g. hover:shadow-md hover:-translate-y-1 hover:bg-stone-100
// But actually `active:` is fine, or we can use `data-[active=true]:` on the parent too!
// Yes! If we use `data-[active=true]:`, we replace `hover:` with `data-[active=true]:` on those parents.
content = content.replace(/(className="[^"]*\bgroup\b[^"]*")/g, (match) => {
  return match.replace(/\bhover:/g, 'data-[active=true]:');
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('DesignSystem.jsx group-hover fixes applied!');
