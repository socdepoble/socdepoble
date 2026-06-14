import { useCallback } from 'react';
import { supabase } from '../supabaseClient';

function cleanHtmlComments(html) {
  return html
    .replace(/<!-- HERO_FORMAT: (.*?) -->\n?/g, '')
    .replace(/<!-- HERO_POSITION: (.*?) -->\n?/g, '')
    .replace(/<!-- HERO_IMAGE: (.*?) -->\n?/g, '')
    .replace(/<!-- LOGO_LIGHT: (.*?) -->\n?/g, '')
    .replace(/<!-- LOGO_DARK: (.*?) -->\n?/g, '');
}

function buildFinalHtml(cleanHtml, meta) {
  return `<!-- HERO_FORMAT: ${meta.heroFormat} -->\n<!-- HERO_POSITION: ${meta.heroPosition} -->\n<!-- HERO_IMAGE: ${meta.heroImage} -->\n<!-- LOGO_LIGHT: ${meta.logoLight} -->\n<!-- LOGO_DARK: ${meta.logoDark} -->\n${cleanHtml}`;
}

export function useUniversalPageSave({
  canEdit,
  actions,
  startCritical,
  atomicYSave,
  pageData,
  routeSlug,
  localSubtitle
}) {
  return useCallback(async (updatedHtml) => {
    if (!canEdit) return;
    const endCritical = startCritical('save-document');
    actions.setSaving(true);

    try {
      const cleanHtml = cleanHtmlComments(updatedHtml);
      const finalHtml = buildFinalHtml(cleanHtml, {
        heroFormat: pageData.heroFormat,
        heroPosition: pageData.heroPosition,
        heroImage: pageData.heroImage,
        logoLight: pageData.logoLight,
        logoDark: pageData.logoDark
      });

      if (window.yDocRef?.current && window.indexedDBProvider) {
        await atomicYSave(window.yDocRef.current, window.indexedDBProvider);
      }

      const payload = {
        slug: routeSlug,
        title: pageData.title || 'Pàgina Sense Títol',
        subtitle: localSubtitle || '',
        html_content: finalHtml,
        published_at: new Date().toISOString()
      };

      const syncPromise = pageData.pageId 
        ? supabase.from('cms_pages').update(payload).eq('id', pageData.pageId)
        : supabase.from('cms_pages').insert([payload]).select().single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 5000)
      );

      await Promise.race([syncPromise, timeoutPromise]);
      pageData.fetchPageContent(routeSlug);
      actions.setEditing(false);
    } catch (err) {
      console.warn('[Trellat] Sync pendent:', err);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          if ('sync' in reg) reg.sync.register('trellat-sync-pending');
        });
      }
    } finally {
      actions.setSaving(false);
      endCritical();
    }
  }, [canEdit, routeSlug, pageData, localSubtitle, actions, atomicYSave, startCritical]);
}
