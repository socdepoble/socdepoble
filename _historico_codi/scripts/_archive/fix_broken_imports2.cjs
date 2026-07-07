const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    file: 'src/shared/utils/imports/importHistorical.js',
    broken: '../services/supabaseService',
    fix: '../../../core/services/supabaseService'
  },
  {
    file: 'src/shared/components/profile/EntityProfile.jsx',
    broken: '../../core/services/vcardService',
    fix: '../../../core/services/vcardService'
  },
  {
    file: 'src/shared/hooks/useBeforeUnload.js',
    broken: '../utils/idb-queue-manager',
    fix: '../utils/offlineQueue' // Assuming offlineQueue replaced idb-queue-manager
  }
];

filesToFix.forEach(({file, broken, fix}) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(broken)) {
      content = content.replace(broken, fix);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed', broken, 'in', file);
    }
  }
});
