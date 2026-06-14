const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/core/services/supabaseService.js');
let content = fs.readFileSync(targetPath, 'utf8');

// Replace normalizeProfile
content = content.replace(/normalizeProfile\(profile\) \{[\s\S]*?\n    \},/, `normalizeProfile(profile) {\n        return profileService.normalizeProfile(profile);\n    },`);

// Replace normalizeStorageUrl
content = content.replace(/normalizeStorageUrl\(url\) \{[\s\S]*?\n    \},/, `normalizeStorageUrl(url) {\n        return profileService.normalizeStorageUrl(url);\n    },`);

// Replace getProfile
content = content.replace(/async getProfile\(id\) \{[\s\S]*?\n    \},/, `async getProfile(id) {\n        return profileService.getProfile(id);\n    },`);

// Replace upsertProfile
content = content.replace(/async upsertProfile\(userId, data\) \{[\s\S]*?\n    \},/, `async upsertProfile(userId, data) {\n        return profileService.upsertProfile(userId, data);\n    },`);

// Replace updateProfile
content = content.replace(/async updateProfile\(userId, updates\) \{[\s\S]*?\n    \},/, `async updateProfile(userId, updates) {\n        return profileService.updateProfile(userId, updates);\n    },`);

// Replace getPublicProfile
content = content.replace(/async getPublicProfile\(userId\) \{[\s\S]*?\n    \},/, `async getPublicProfile(userId) {\n        return profileService.getPublicProfile(userId);\n    },`);

// Replace getUserByUsername
content = content.replace(/async getUserByUsername\(username\) \{[\s\S]*?\n    \},/, `async getUserByUsername(username) {\n        return profileService.getUserByUsername(username);\n    },`);

// Replace updateProfileBio
content = content.replace(/async updateProfileBio\(userId, bio\) \{[\s\S]*?\n    \},/, `async updateProfileBio(userId, bio) {\n        return profileService.updateProfileBio(userId, bio);\n    },`);

// Replace getAllCitizens
content = content.replace(/async getAllCitizens\(\) \{[\s\S]*?\n    \},/, `async getAllCitizens() {\n        return profileService.getAllCitizens();\n    },`);

// Replace updateUserRole
content = content.replace(/async updateUserRole\(userId, role\) \{[\s\S]*?\n    \},/, `async updateUserRole(userId, role) {\n        return profileService.updateUserRole(userId, role);\n    },`);

// Replace searchProfiles
content = content.replace(/async searchProfiles\(query\) \{[\s\S]*?\n    \},/, `async searchProfiles(query) {\n        return profileService.searchProfiles(query);\n    },`);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Refactoring applied successfully.');
