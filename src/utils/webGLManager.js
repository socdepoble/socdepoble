/**
 * Sóc de Poble - WebGL Resource Manager
 * Grau Fossilitzat (Preparat per a Micro-frontends 3D)
 * Evita fuites de VRAM trackejant textures, buffers i forçant pèrdua de context.
 */

export const WebGLResourceManager = (() => {
  const resources = new WeakMap(); 
  // Usa WeakMap perquè si el contenidor DOM desapareix, s'allibere la memòria automàticament.

  return {
    register(el) {
      if (!resources.has(el)) {
        resources.set(el, { textures: new Set(), buffers: new Set(), rafIds: new Set() });
      }
      return resources.get(el);
    },

    trackTexture(el, tex) {
      this.register(el).textures.add(tex);
    },

    trackBuffer(el, buf) {
      this.register(el).buffers.add(buf);
    },

    trackRaf(el, id) {
      this.register(el).rafIds.add(id);
    },

    disposeAll(el, glContext = null, renderer = null) {
      const r = resources.get(el);
      if (!r) return;

      // 1. Alliberar recursos
      r.textures.forEach(t => { 
        try { t.delete ? t.delete() : t.dispose?.(); } catch(e) { /* ignore */ } 
      });
      r.buffers.forEach(b => { 
        try { b.delete ? b.delete() : b.dispose?.(); } catch(e) { /* ignore */ } 
      });
      
      // 2. Cancel·lar animacions pendents
      r.rafIds.forEach(id => cancelAnimationFrame(id));

      // 3. Forçar pèrdua de context WebGL (Vital per a iOS/Safaris vells)
      if (renderer && renderer.forceContextLoss) {
        try { renderer.forceContextLoss(); renderer.dispose(); } catch(e) { /* ignore */ }
      } else if (glContext) {
        try {
          const loseExt = glContext.getExtension('WEBGL_lose_context');
          if (loseExt) loseExt.loseContext();
        } catch(e) { /* ignore */ }
      }

      resources.delete(el);
      console.log('💎 [WebGL Manager] Recursos i VRAM alliberats per al contenidor.');
    }
  };
})();
