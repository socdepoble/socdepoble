// ✅ GESTIÓN DE CACHE SIN CONDICIONES DE CARRERA
export class ColumnCacheManager {
  constructor() {
    this._cache = new Map();
    this._pending = new Map();
    this._initialized = false;
  }

  async initialize() {
    if (this._initialized) return;
    
    const columns = [
      'cv_visible', 'cv_mercat_visible', 'cv_mur_visible',
      'cv_xat_visible', 'cv_agenda_visible', 'profiles_has_premium'
    ];

    for (const col of columns) {
      const val = localStorage.getItem(`cp_${col}`);
      this._cache.set(col, val === 'true' ? true : val === 'false' ? false : null);
    }

    this._initialized = true;
  }

  async get(key) {
    if (this._cache.has(key)) return this._cache.get(key);
    
    if (this._pending.has(key)) {
      return await this._pending.get(key);
    }
    
    const promise = (async () => {
      const val = localStorage.getItem(`cp_${key}`);
      const result = val === 'true' ? true : val === 'false' ? false : null;
      this._cache.set(key, result);
      this._pending.delete(key);
      return result;
    })();
    
    this._pending.set(key, promise);
    return await promise;
  }

  async set(key, value) {
    localStorage.setItem(`cp_${key}`, String(value));
    this._cache.set(key, value);
    if (this._pending.has(key)) this._pending.delete(key);
    
    window.dispatchEvent(new CustomEvent('column-visibility-change', { 
      detail: { key, value } 
    }));
  }

  async toggle(key) {
    const current = await this.get(key);
    await this.set(key, !current);
    return !current;
  }

  clear() {
    this._cache.clear();
    this._pending.clear();
    this._initialized = false;
  }
}

export const columnCache = new ColumnCacheManager();
