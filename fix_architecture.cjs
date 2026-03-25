const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      if (fs.statSync(dirFile).isDirectory()) {
         filelist = walkSync(dirFile, filelist);
      } else {
         filelist.push(dirFile);
      }
    } catch (err) {
      if (err.code === 'OOM' || err.code === 'EMFILE') throw err;
    }
  });
  return filelist;
};

const marketMethods = ['getMarketCategories', 'getMarketItems', 'getMarketFavorites', 'createMarketItem', 'toggleMarketFavorite'];
const chatMethods = ['getConversations', 'getMessages', 'sendMessage', 'markMessagesAsRead', 'deleteMessage', 'createConversation', 'uploadVoiceMessage', 'transcribeAudio'];
const authMethods = ['getRedirectUrl', 'signUp', 'signIn', 'resetPasswordForEmail', 'signOut', 'signInWithGoogle', 'signInWithOtp', 'resendOtp', 'verifyOtp', 'deleteCurrentUser'];

const files = walkSync('./src').filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let needsMarket = false;
  let needsChat = false;
  let needsAuth = false;

  marketMethods.forEach(method => {
    const regex = new RegExp(`supabaseService\\.${method}(?!\\w)`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `marketService.${method}`);
      needsMarket = true;
    }
  });
  chatMethods.forEach(method => {
    const regex = new RegExp(`supabaseService\\.${method}(?!\\w)`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `chatService.${method}`);
      needsChat = true;
    }
  });
  authMethods.forEach(method => {
    const regex = new RegExp(`supabaseService\\.${method}(?!\\w)`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `authService.${method}`);
      needsAuth = true;
    }
  });

  if (needsMarket || needsChat || needsAuth) {
    const fileDepth = file.split('/').length - 2; 
    let prefix = fileDepth <= 1 ? './services/' : '../'.repeat(fileDepth - 1) + 'services/';
    if (fileDepth === 0) prefix = './services/';

    const hasMarketImport = /import\s+{.*marketService.*}\s+from/.test(content);
    const hasChatImport = /import\s+{.*chatService.*}\s+from/.test(content);
    const hasAuthImport = /import\s+{.*authService.*}\s+from/.test(content);

    let importsToAdd = [];
    if (needsMarket && !hasMarketImport) importsToAdd.push(`import { marketService } from '${prefix}marketService';`);
    if (needsChat && !hasChatImport) importsToAdd.push(`import { chatService } from '${prefix}chatService';`);
    if (needsAuth && !hasAuthImport) importsToAdd.push(`import { authService } from '${prefix}authService';`);

    if (importsToAdd.length > 0) {
      const importBlock = importsToAdd.join('\n') + '\n';
      // Insert after the last import
      const lastImportMatch = [...content.matchAll(/^import\s+.*from\s+.*$/gm)].pop();
      if (lastImportMatch) {
        const insertPos = lastImportMatch.index + lastImportMatch[0].length;
        content = content.slice(0, insertPos) + '\n' + importBlock + content.slice(insertPos);
      } else {
        content = importBlock + '\n' + content;
      }
    }
    
    // Check if supabaseService is now completely unused
    if (!content.includes('supabaseService.') && content.includes('import { supabaseService }')) {
      content = content.replace(/import\s+{\s*supabaseService\s*}\s+from\s+['"][^'"]+['"];?\n?/g, '');
      // Handle comma separated imports: import { supabaseService, x } ...
      content = content.replace(/,\s*supabaseService\b|\bsupabaseService\s*,\s*/g, '');
    }

    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});
console.log(`Refactoring complete. Updated ${changedFiles} files.`);
