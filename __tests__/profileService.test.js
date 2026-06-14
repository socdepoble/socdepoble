// __tests__/profileService.test.js
jest.mock('../src/core/services/supabase/supabaseAdapter.js', () => {
  return {
    fetchProfileById: jest.fn(async (id) => {
      if (id === 'p1') return { id: 'p1', username: 'alice', full_name: 'Alice', avatar_url: '/a.png', bio: 'hola' };
      return null;
    }),
    fetchProfileByUsername: jest.fn(async (username) => {
      if (username === 'bob') return { id: 'p2', username: 'bob', full_name: 'Bob', avatar_url: '/b.png' };
      return null;
    }),
    fetchAllProfiles: jest.fn(async ({ limit }) => {
      return [{ id: 'p1', username: 'alice' }, { id: 'p2', username: 'bob' }].slice(0, limit || 2);
    }),
    updateProfileRecord: jest.fn(async (payload) => [payload]),
    upsertProfileRecord: jest.fn(async (payload) => [payload]),
    updateProfileBioRecord: jest.fn(async (id, bio) => [{ id, bio }]),
    searchProfilesRaw: jest.fn(async (q, opts) => [{ id: 'p1', username: 'alice' }])
  };
});

// Use dynamic import or require for ES modules if needed, but since it's jest mock it should work.
const profileService = require('../src/core/services/supabase/profileService.js');

describe('profileService', () => {
  test('normalizeProfile maps fields correctly', () => {
    const raw = { id: 'x', username: 'u', full_name: 'Full', avatar_url: '/img.png', bio: 'b', role: 'admin', updated_at: '2020' };
    const p = profileService.normalizeProfile(raw);
    expect(p.id).toBe('x');
    expect(p.fullName).toBe('Full');
    expect(p.avatar).toBe('/img.png');
    expect(p.role).toBe('admin');
  });

  test('getProfile returns normalized profile or null', async () => {
    const p = await profileService.getProfile('p1');
    expect(p).not.toBeNull();
    expect(p.username).toBe('alice');
    const none = await profileService.getProfile('nope');
    expect(none).toBeNull();
  });
});
