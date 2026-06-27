import { useState, useEffect, useCallback, useMemo } from 'react';
import { parseSimpleMarkdown } from '../../utils/markdownParser';
import { useUnifiedDocumentStore } from '../../../hooks/useUnifiedDocumentStore';
import { useBidirectionalSupabaseSync } from '../../../hooks/useBidirectionalSupabaseSync';
import useImageInterceptor, { insertAtCursor } from '../../../hooks/useImageInterceptor';
import useCIDRenderer from '../../../hooks/useCIDRenderer';
import { useUnifiedExporter } from '../../hooks/useUnifiedExporter.js';

const BlockPreview = ({ block }) => {
  const [resolvedText, loading] = useCIDRenderer(block.content);
  const html = parseSimpleMarkdown(resolvedText);
  return (
    <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
};


export default function UnifiedEditor({ docId = 'draft', initialData = null }) {
  const { document, updateDocument, saveDocument } = useUnifiedDocumentStore(docId, initialData);
  const { enqueueChange, syncToSupabase } = useBidirectionalSupabaseSync(docId, document, updateDocument, saveDocument);

  // Focus Mode (Double Page Maketup)
  const [focusMode, setFocusMode] = useState(false);

  // Initialize blocks directly onto document if they don't exist
  useEffect(() => {
    if (!document.blocks || document.blocks.length === 0) {
      updateDocument({
        blocks: [{ id: 'section-0', type: 'section', title: 'Intro', content: '' }]
      });
    }
  }, [document.blocks, updateDocument]);

  const blocks = useMemo(() => document.blocks || [], [document.blocks]);
  const [activeBlock, setActiveBlock] = useState(blocks.length > 0 ? blocks[0].id : null);

  if (!activeBlock && blocks.length > 0) {
    setActiveBlock(blocks[0].id);
  }

  const { exportToAffinity, exportToEPUB, exportState } = useUnifiedExporter(docId, blocks, document.title);

  useEffect(() => {
    if (exportState.status === 'error') {
      alert(`Error en exportar: ${exportState.error}`);
    } else if (exportState.status === 'final') {
      alert("Exportació completada feliçment (11/10) 😎");
    }
  }, [exportState.status, exportState.error]);

  const { handlers: interceptorHandlers } = useImageInterceptor({
    docId,
    insertToTextarea: (md) => {
      const activeTextarea = window.document.querySelector('textarea:focus');
      if (activeTextarea) {
        insertAtCursor(activeTextarea, md);
      } else {
        const targetTa = window.document.querySelector(`textarea[aria-label="Editor ${activeBlock}"]`);
        if (targetTa) {
          insertAtCursor(targetTa, md);
        } else if (activeBlock) {
           updateBlock(activeBlock, { content: (blocks.find(b => b.id === activeBlock)?.content || '') + '\n' + md });
        }
      }
    }
  });

  const _syncChanges = useCallback((newBlocks, newTitle = undefined) => {
    const textContent = newBlocks.map(b => `## ${b.title}\n\n${b.content}`).join('\n\n');
    const update = { blocks: newBlocks, content: textContent };
    if (newTitle !== undefined) update.title = newTitle;
    
    updateDocument(update);
    enqueueChange({ payload: update });
  }, [updateDocument, enqueueChange]);

  const updateBlock = useCallback((blockId, patch) => {
    const newBlocks = blocks.map(b => b.id === blockId ? { ...b, ...patch } : b);
    _syncChanges(newBlocks);
  }, [blocks, _syncChanges]);

  const addSection = useCallback(() => {
    const idx = blocks.length;
    const newBlock = { id: `section-${idx}`, type: 'section', title: `Section ${idx+1}`, content: '' };
    const newBlocks = [...blocks, newBlock];
    _syncChanges(newBlocks);
    setActiveBlock(newBlock.id);
  }, [blocks, _syncChanges]);

  const removeBlock = useCallback((blockId) => {
    const newBlocks = blocks.filter(b => b.id !== blockId);
    _syncChanges(newBlocks);
    if (activeBlock === blockId && newBlocks.length > 0) setActiveBlock(newBlocks[0].id);
  }, [blocks, activeBlock, _syncChanges]);

  // Eliminem htmlCache manual, useCIDRenderer gestiona la memòria cache neta i elèctrica

  return (
    <div className={`unified-editor-root w-full mx-auto p-4 transition-all duration-500 ${focusMode ? 'max-w-[1800px] px-8' : 'max-w-[1200px]'}`} {...interceptorHandlers}>
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            className="bg-transparent text-lg font-bold focus:outline-none"
            value={document.title || ''}
            onChange={e => _syncChanges(blocks, e.target.value)}
            placeholder="Títol del document"
            aria-label="Títol"
          />
          <button
            onClick={addSection}
            className="px-3 py-1 rounded-md bg-[var(--theme-accent-primary)] text-white text-sm"
          >
            + Secció
          </button>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`px-3 py-1 rounded-md text-sm transition-colors border ${focusMode ? 'bg-white text-black border-transparent font-bold tracking-wide' : 'bg-transparent text-white/70 border-white/20 hover:text-white'}`}
          >
            {focusMode ? '📖 Sortir Doble Pàgina' : '📖 Maquetar Doble Pàgina'}
          </button>
        </div>
        <div className="text-sm text-theme-text/70 hidden sm:block">Guardat: {document.lastSaved ? new Date(document.lastSaved).toLocaleString() : 'Mai'}</div>
      </header>

      <main className="flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)]">
        
        {!focusMode && (
          <aside className="w-full md:w-1/3 flex flex-col gap-3 h-full overflow-hidden shrink-0 animate-in slide-in-from-left duration-300">
            <nav className="bg-black/10 rounded-lg p-2 overflow-auto flex-1 custom-scrollbar">
              {blocks.map(b => (
                <button
                  key={b.id}
                  onClick={() => setActiveBlock(b.id)}
                  className={`w-full text-left px-3 py-2 rounded-md mb-2 ${activeBlock === b.id ? 'bg-white/6 ring-1 ring-[var(--theme-accent-primary)]' : 'hover:bg-white/3'}`}
                >
                  <div className="text-sm font-semibold">{b.title || 'Secció sense títol'}</div>
                  <div className="text-xs text-theme-text/60 truncate">{(b.content || '').split('\n')[0]}</div>
                </button>
              ))}
            </nav>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={exportToAffinity} className="w-full px-3 py-2 rounded-md bg-blue-600/80 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-500/80 ring-1 ring-white/20">
                {exportState.status === 'idle' || exportState.status === 'final' || exportState.status === 'error' ? '📐 Exportar a Affinity (MCP)' : `Streaming... ${exportState.progress}%`}
              </button>
              <button onClick={exportToEPUB} className="w-full px-3 py-2 rounded-md bg-[var(--theme-accent-primary)] text-white font-semibold flex items-center justify-center gap-2">
                📦 Exportar EPUB3 (11/10)
              </button>
              <div className="flex gap-2">
                <button onClick={() => syncToSupabase()} className="flex-1 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">Força Sync</button>
                <button onClick={() => saveDocument(document)} className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/10 transition-colors">Guardat Local</button>
              </div>
            </div>
          </aside>
        )}

        <section className={`transition-all duration-500 flex flex-col gap-4 h-full ${focusMode ? 'w-full' : 'w-full md:w-2/3'}`}>
          {blocks.map(block => {
            if (activeBlock !== block.id) return null;
            return (
            <article key={block.id} className="block-card bg-[var(--glass-bg, rgba(255,255,255,0.04))] rounded-xl p-3 border border-white/6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <input
                  className="bg-transparent font-semibold text-sm focus:outline-none w-2/3"
                  value={block.title}
                  onChange={e => updateBlock(block.id, { title: e.target.value })}
                  placeholder="Títol de la secció"
                />
                <button onClick={() => removeBlock(block.id)} className="text-red-400 hover:text-red-300 transition-colors text-sm font-bold bg-white/5 px-2 py-1 rounded">Esborra</button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
                <div className={`editor-pane transition-all duration-500 h-full ${focusMode ? 'md:w-1/3' : 'md:w-1/2'}`}>
                  <textarea
                    aria-label={`Editor ${block.id}`}
                    value={block.content}
                    onChange={e => updateBlock(block.id, { content: e.target.value })}
                    className="editor-textarea w-full h-full bg-black/20 text-theme-text p-4 font-mono text-sm resize-none focus:outline-none border border-white/10 rounded-lg custom-scrollbar shadow-inner"
                    placeholder="Escriu Markdown..."
                  />
                </div>

                <div className={`preview-pane transition-all duration-500 h-full p-6 overflow-auto custom-scrollbar rounded-lg shadow-xl shadow-black/50 ${focusMode ? 'md:w-2/3 bg-[#F3F4F6] text-[#111827] ring-1 ring-black/5 flex justify-center' : 'md:w-1/2 bg-transparent text-white/90 border-l border-white/10'}`}>
                  {focusMode ? (
                     <div className="prose prose-sm prose-slate max-w-none bg-white rounded-md p-10 shadow-[0_0_15px_rgba(0,0,0,0.05)] min-h-full w-full max-w-[1200px] columns-2 gap-16 column-rule-1 column-rule-solid column-rule-gray-200">
                        <BlockPreview block={block} />
                     </div>
                  ) : (
                     <BlockPreview block={block} />
                  )}
                </div>
              </div>
            </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
