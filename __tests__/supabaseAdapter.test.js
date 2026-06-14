// __tests__/supabaseAdapter.test.js
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => {
      return {
        from: (table) => ({
          select: function (cols) { this._cols = cols; return this; },
          eq: function (k, v) { this._filter = { k, v }; return this; },
          limit: function (n) { this._limit = n; return this; },
          upsert: function (payload, opts) { return Promise.resolve({ data: [payload], error: null }); },
          insert: function (payload) { return Promise.resolve({ data: [payload], error: null }); },
          delete: function () { return { match: () => Promise.resolve({ data: [], error: null }) }; },
          or: function () { return Promise.resolve({ data: [], error: null }); }
        })
      };
    })
  };
});

const { initSupabase, fetchProfileById, fetchProfileByUsername, fetchAllProfiles, updateProfileRecord, searchProfilesRaw } = require('../src/core/services/supabase/supabaseAdapter.js');

describe('supabaseAdapter', () => {
  beforeAll(() => {
    initSupabase({ url: 'https://example.supabase.co', key: 'test-key' });
  });

  test('fetchProfileById returns null when no data', async () => {
    const res = await fetchProfileById('nonexistent');
    expect(res).toBeNull();
  });

  test('fetchProfileByUsername returns null when no data', async () => {
    const res = await fetchProfileByUsername('nouser');
    expect(res).toBeNull();
  });

  test('fetchAllProfiles returns array', async () => {
    const rows = await fetchAllProfiles({ limit: 10 });
    expect(Array.isArray(rows)).toBe(true);
  });
});
