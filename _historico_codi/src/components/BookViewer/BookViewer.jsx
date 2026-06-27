import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { parseSimpleMarkdown } from '../../utils/markdownParser';
import { exportToIDML, sendToAffinityMCP } from '../../../lib/export/idmlExporter';
import { useUnifiedDocumentStore } from '../../../hooks/useUnifiedDocumentStore';
import { useBidirectionalSupabaseSync } from '../../../hooks/useBidirectionalSupabaseSync';
import { useIAIASpeech } from '../../../hooks/useIAIASpeech';
import useCIDRenderer from '../../../hooks/useCIDRenderer';

export const BookViewer = ({ postId, initialData }) => {
  const { document, updateDocument, triggerManualExport, lastSaved } = useUnifiedDocumentStore(postId, initialData);
  const { enqueueChange } = useBidirectionalSupabaseSync(postId, document, updateDocument, () => {});
  const { speak, pause, resume, stop, isSpeaking } = useIAIASpeech();

  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  const [resolvedContent, loadingCids] = useCIDRenderer(document.content);

  // DIVIDIR EN SECTIONS (paginació lògica virtual)
  const sections = useMemo(() => {
    const html = parseSimpleMarkdown(resolvedContent || '');
    const tempDiv = window.document.createElement('div');
    tempDiv.innerHTML = html;

    const parsed = [];
    let current = { id: 'intro', title: document.title || 'Inici', html: '' };

    Array.from(tempDiv.children).forEach((el) => {
      if (el.tagName.startsWith('H') || el.tagName === 'SECTION') {
        if (current.html) parsed.push({ ...current });
        current = {
          id: el.id || `sec-${parsed.length}`,
          title: el.textContent,
          html: el.outerHTML,
        };
      } else {
        current.html += el.outerHTML;
      }
    });
    if (current.html) parsed.push(current);
    return parsed.length ? parsed : [{ id: 'full', title: 'Contingut complet', html }];
  }, [resolvedContent, document.title]);

  // OBSERVER PER VIRTUALITZACIÓ (només renderitza el que es veu)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.sectionId;
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(id));
          }
        });
      },
      { rootMargin: '300px 0px' } // carrega anticipadament 2 seccions
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const attachObserver = useCallback((node) => {
    if (node && observerRef.current) observerRef.current.observe(node);
  }, []);

  // PROGRESS
  const progress = useMemo(() => {
    if (sections.length === 0) return 0;
    const visibleCount = Array.from(visibleSections).length;
    return Math.round((visibleCount / sections.length) * 100);
  }, [visibleSections, sections.length]);

  return (
    <div className="book-viewer flex flex-col h-full w-full bg-[#FDFCF9] text-[#111827] overflow-hidden relative">
      {/* CONTROLS GLASS (només aquí) */}
      <div className="glass-controls fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/10 backdrop-blur-3xl px-6 py-3 rounded-3xl border border-white/10 shadow-xl">
        <button onClick={() => window.history.back()} className="font-bold text-sm">← Tornar</button>
        <div className="w-48 h-2 bg-black/10 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="font-mono text-xs text-red-600/80">{progress}% llegit</span>
        <button
          onClick={async () => {
            const result = await triggerManualExport();
            const a = window.document.createElement('a');
            a.href = result.url;
            a.download = result.filename;
            a.click();
            enqueueChange({ payload: { content: document.content } }); // marca com a dirty
          }}
          className="font-bold text-sm px-5"
        >
          📦 EPUB
        </button>
        <button
          onClick={async () => {
            const result = await exportToIDML(document);
            const a = window.document.createElement('a');
            a.href = result.url;
            a.download = result.filename;
            a.click();
            // Enviam asíncron al port local d'Affinity MCP
            sendToAffinityMCP(document);
          }}
          className="font-bold text-sm px-5 border-l border-white/20"
        >
          🏛️ Affinity MCP
        </button>
        
        {/* IAIA VEUS */}
        <button
          onClick={() => {
            if (isSpeaking) {
               pause();
            } else {
               const currentSectionText = sections.find(s => visibleSections.has(s.id))?.html || document.content;
               const plainText = currentSectionText.replace(/<[^>]+>/g, ' '); // neteja HTML
               speak(plainText);
            }
          }}
          className="font-bold text-sm flex items-center gap-1"
        >
          {isSpeaking ? '⏸️ Pause' : '🔊 IAIA Llegeix'}
        </button>
        {isSpeaking && (
          <>
            <button onClick={resume} className="text-sm border border-black/20 rounded-md px-2">▶️</button>
            <button onClick={stop} className="text-sm border border-black/20 rounded-md px-2">⏹️</button>
          </>
        )}
      </div>

      {/* COS DE LECTURA: PAPER RÚSTIC PUR + PAGINACIÓ HÍBRIDA */}
      <div 
        className={`flex-1 overflow-auto w-full px-6 md:px-12 py-16 max-w-3xl mx-auto prose prose-stone leading-relaxed text-[1.1rem] snap-y snap-mandatory scroll-smooth transition-opacity duration-300 ${loadingCids ? 'opacity-50' : 'opacity-100'}`}
        style={{ 
          fontFamily: 'var(--sdp-font-sans)',
          background: '#FDFCF9',           // Paper rústic exacte
        }}
      >
        {sections.map((section) => (
          <section
            key={section.id}
            ref={attachObserver}
            data-section-id={section.id}
            id={section.id}
            className="mb-16 scroll-mt-20 snap-start break-inside-avoid"
            style={{ breakInside: 'avoid' }}   // evita trencar columnes
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
        ))}
      </div>

      {/* FOOTER INFO */}
      <div className="text-center text-xs opacity-60 py-4 font-mono border-t border-black/10">
        Última guardada: {lastSaved ? new Date(lastSaved).toLocaleString('ca-ES') : '—'} • Mode Paper Rústic
      </div>
    </div>
  );
};
