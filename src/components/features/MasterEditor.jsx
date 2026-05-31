import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportService } from '../../core/services/exportService';
import { iaiaService } from '../../core/services/iaiaService';
import { hapticService } from '../../core/services/hapticService';
import './MasterEditor.css';
import { Sparkles, Download, FileText, Heading1, Heading2, Type, List, ListOrdered, CheckSquare, Image as ImageIcon, Video, FileCode, BarChart3, Copy, Loader2, Languages, File as FileIcon, ArrowUp } from 'lucide-react';
import IAIACorrectorOverlay from './IAIACorrectorOverlay';
import FloatingIndex from '../ui/FloatingIndex';

const MasterEditor = ({ note, showIndex, onChange, onAIA, placeholder }) => {
    const { t } = useTranslation();
    const editorRef = useRef(null);
    const savedSelectionRef = useRef(null);
    const draggedLiRef = useRef(null);
    const [content, setContent] = useState(note?.content || '');
    const [headings, setHeadings] = useState([]);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isIndexExpanded, setIsIndexExpanded] = useState(true);
    const [isThinking, setIsThinking] = useState(false);
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [corrections, setCorrections] = useState([]);

    const saveSelection = React.useCallback(() => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            savedSelectionRef.current = selection.getRangeAt(0);
        }
    }, []);

    const restoreSelection = React.useCallback(() => {
        if (savedSelectionRef.current && editorRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedSelectionRef.current);
            editorRef.current.focus();
        }
    }, []);

    // Initial content setup
    useEffect(() => {
        if (editorRef.current && note?.content !== undefined && editorRef.current.innerHTML !== note.content) {
            editorRef.current.innerHTML = note.content || '';
        }
    }, [note?.content]);

    // Extract headings for Table of Contents if showIndex is active
    useEffect(() => {
        if (showIndex && editorRef.current) {
            const hElements = editorRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const hList = Array.from(hElements).map((el, i) => {
                if (!el.id) el.id = `heading-${i}`;
                return {
                    id: el.id,
                    text: el.textContent,
                    tagName: el.tagName.toLowerCase(),
                    element: el
                };
            }).filter(h => h.text.trim() !== '');
            setHeadings(hList);
        }
    }, [showIndex, note?.content]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const html = e.clipboardData.getData('text/html');
        const text = e.clipboardData.getData('text/plain');

        if (html) {
            // Create a temporary element to parse the HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;

            // Sanitize function
            const sanitize = (node) => {
                const allowedTags = ['H1', 'H2', 'P', 'B', 'I', 'U', 'UL', 'OL', 'LI', 'BR'];
                const frag = document.createDocumentFragment();

                Array.from(node.childNodes).forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        if (allowedTags.includes(child.tagName)) {
                            const cleanEl = document.createElement(child.tagName);
                            // Preserve only essential structure, no classes or styles
                            cleanEl.innerHTML = sanitize(child).innerHTML;
                            frag.appendChild(cleanEl);
                        } else {
                            // If tag not allowed, keep its children (unwrap)
                            frag.appendChild(sanitize(child));
                        }
                    } else if (child.nodeType === Node.TEXT_NODE) {
                        frag.appendChild(document.createTextNode(child.textContent));
                    }
                });
                const container = document.createElement('div');
                container.appendChild(frag);
                return container;
            };

            const cleanHTML = sanitize(temp).innerHTML;
            editorRef.current.focus();
            document.execCommand('insertHTML', false, cleanHTML || text);
        } else {
            editorRef.current.focus();
            document.execCommand('insertText', false, text);
        }
        handleInput();
    };

    const execCommand = (command, value = null) => {
        if (!editorRef.current) return;
        saveSelection();
        editorRef.current.focus();
        restoreSelection();
        document.execCommand(command, false, value);
        handleInput();
    };

    const insertBlock = (tag) => {
        if (!editorRef.current) return;
        saveSelection();
        editorRef.current.focus();
        restoreSelection();
        document.execCommand('formatBlock', false, tag);
        handleInput();
    };

    const insertChecklist = () => {
        const html = `
            <ul class="checklist-block">
                <li draggable="true">
                    <div class="checklist-drag-handle" contenteditable="false">⋮⋮</div>
                    <input type="checkbox"> 
                    <span class="checklist-text" data-placeholder="Nova tasca"></span>
                    <button class="checklist-item-remove" contenteditable="false" title="Eliminar tasca">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </li>
            </ul>
            <p><br></p>
        `;
        // We insert a block so it doesn't merge with existing text line
        editorRef.current.focus();
        document.execCommand('insertHTML', false, `<div>${html}</div>`);
        handleInput();
    };

    const handleDragStart = (e) => {
        const li = e.target.closest('li');
        if (!li || !li.closest('.checklist-block')) return;
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', li.outerHTML);
        li.classList.add('dragging-li');
        draggedLiRef.current = li;
    };

    const handleDragOver = (e) => {
        const li = e.target.closest('li');
        if (li && li.closest('.checklist-block')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            li.classList.add('drag-over-li');
        }
    };

    const clearDragClasses = React.useCallback(() => {
        document.querySelectorAll('.dragging-li, .drag-over-li').forEach(el => {
            el.classList.remove('dragging-li', 'drag-over-li');
        });
        draggedLiRef.current = null;
    }, []);

    useEffect(() => {
        return () => clearDragClasses();
    }, [clearDragClasses]);

    const handleDragLeave = (e) => {
        const li = e.target.closest('li');
        if (li) li.classList.remove('drag-over-li');
    };

    const handleDrop = (e) => {
        const targetLi = e.target.closest('li');
        const draggedLi = draggedLiRef.current;
        
        if (targetLi && draggedLi && targetLi !== draggedLi && targetLi.closest('.checklist-block')) {
            e.preventDefault();
            const parent = targetLi.parentNode;
            
            // Check if we drop before or after the target
            const rect = targetLi.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            if (e.clientY < midpoint) {
                parent.insertBefore(draggedLi, targetLi);
            } else {
                parent.insertBefore(draggedLi, targetLi.nextSibling);
            }
            
            handleInput();
        }
        
        clearDragClasses();
    };

    const handleRemoveItem = (e) => {
        const li = e.target.closest('li');
        if (li && li.closest('.checklist-block')) {
            hapticService.batec();
            const parent = li.parentNode;
            li.remove();
            // If the list is empty, remove the list itself
            if (parent && parent.children.length === 0) {
                parent.remove();
            }
            handleInput();
        }
    };

    const insertPoll = () => {
        const pollId = `poll-${Date.now()}`;
        const barChartSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
        const html = `
            <div class="poll-block" contenteditable="false" data-poll-id="${pollId}">
                <div class="poll-header">
                    <div class="poll-icon">${barChartSVG}</div>
                    <span contenteditable="true" class="poll-question" data-placeholder="Pregunta de l'enquesta..."></span>
                </div>
                <div class="poll-options">
                    <div class="poll-option-placeholder">Les opcions es bateguen en publicar...</div>
                </div>
                <div class="poll-footer">Enquesta del Poble</div>
            </div>
            <p><br></p>
        `;
        editorRef.current.focus();
        document.execCommand('insertHTML', false, `<div>${html}</div>`);
        handleInput();
    };

    const insertMedia = (type) => {
        let html = '';
        if (type === 'image') {
            const url = prompt('URL de la imatge:');
            if (url) html = `<img src="${url}" style="max-width:100%; border-radius:12px; margin: 16px 0;" />`;
        } else if (type === 'video') {
            const url = prompt('URL del vídeo (YouTube/Vimeo Embed):');
            if (url) html = `<div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; margin: 16px 0;"><iframe src="${url}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe></div>`;
        } else if (type === 'embed') {
            const code = prompt('Codi d\'incrustació (IFrame/PowerPoint):');
            if (code) html = `<div class="embed-block" style="margin: 16px 0;">${code}</div>`;
        }

        if (html) {
            editorRef.current.focus();
            document.execCommand('insertHTML', false, html);
            handleInput();
        }
    };

    const handleIAIACorrector = async () => {
        const text = editorRef.current.innerText;
        if (!text.trim()) return;

        setIsCorrecting(true);
        hapticService.batec();
        try {
            const prompt = `Actua com un expert en filologia i correcció gramatical de la LLENGUA CATALANA. 
            Analitza el text següent i retorna una llista de correccions en format JSON rigorós.
            
            EXTREMADAMENT IMPORTANT: Has de respectar la variant dialectal de l'usuari (Central, VALENCIÀ, Balear, etc.) però corregint errors ortogràfics i gramaticals segons la normativa de l'IEC/AVL.
            
            Cada objecte del JSON ha de tenir: 
            "original" (fragment erroni/millorable), 
            "suggeriment" (text corregit respectant la variant), 
            "explicacio" (per què, fent referència a la variant si escau, p.ex: "En valencià es prefereix 'hui'").
            
            Prioritza: pronoms febles, acentuació diacrítica, concordança, i lèxic genuí de cada territori.
            
            TEXT A CORREGIR:
            "${text}"`;

            const result = await iaiaService.askIAIA(prompt);
            // PROTOCOL v10.33.1: Defensive extraction of JSON block
            const content = result?.text || (typeof result === 'string' ? result : '');
            const jsonMatch = (content && typeof content === 'string') ? content.match(/\[.*\]/s) : null;
            
            if (jsonMatch) {
                const parsedCorrections = JSON.parse(jsonMatch[0]);
                setCorrections(parsedCorrections);
                hapticService.notifySuccess();
            }
        } catch (error) {
            console.error('[MasterEditor] Corrector Error:', error);
            hapticService.notifyError();
        } finally {
            setIsCorrecting(false);
        }
    };

    const applyCorrection = (corr) => {
        const { original, suggeriment } = corr;
        const editor = editorRef.current;
        if (!editor) return;

        // Guardem la selecció actual
        const selection = window.getSelection();
        const savedRange = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;

        // Substituïm al primer TextNode que contingui el text original
        const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
        let node;
        let replaced = false;
        while ((node = walker.nextNode())) {
            if (node.textContent.includes(original)) {
                const parent = node.parentNode;
                const idx = node.textContent.indexOf(original);

                // Dividim el TextNode en 3 parts: before | reemplaç | after
                const before = document.createTextNode(node.textContent.slice(0, idx));
                const replacement = document.createElement('strong');
                replacement.textContent = suggeriment;
                const after = document.createTextNode(node.textContent.slice(idx + original.length));

                parent.insertBefore(before, node);
                parent.insertBefore(replacement, node);
                parent.insertBefore(after, node);
                parent.removeChild(node);
                replaced = true;
                break;
            }
        }

        if (!replaced) {
            // Fallback si no troba text exacte al Node
            const html = editor.innerHTML;
            editor.innerHTML = html.replace(original, `<strong>${suggeriment}</strong>`);
        } else if (savedRange) {
            // Restaurem el cursor a la posició anterior si era vàlida
            try {
                selection.removeAllRanges();
                selection.addRange(savedRange);
            } catch {
                // Range invàlid post-mutació DOM
            }
        }

        setCorrections(prev => prev.filter(c => c.original !== original));
        handleInput();
        hapticService.notifySuccess();
    };

    const handleIAIABatec = async () => {
        const text = editorRef.current.innerText;
        if (!text.trim()) return;

        setIsThinking(true);
        hapticService.batec();
        try {
            // Context simulation for general editor
            const context = {
                detectedObjects: ["text del poble"],
                suggestedTitle: "Crònica del Veïnat",
                suggestedMotto: "Trellat i bona lletra.",
                contextTone: "proller i autèntic"
            };
            const result = await iaiaService.generateMultimediaPublication(context, text);
            onChange(result.content);
            hapticService.notifyAIReady();
        } catch (error) {
            console.error('[MasterEditor] IAIA Error:', error);
            hapticService.notifyError();
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="master-editor-container min-h-0">
            <div 
                className="master-editor-toolbar" 
                onMouseDown={(e) => {
                    // Prevent toolbar buttons from stealing focus 
                    // from the contenteditable to preserve selection
                    if (e.target.tagName !== 'INPUT') {
                        e.preventDefault();
                    }
                }}
            >
                <button
                    type="button"
                    className="editor-tool primary"
                    onClick={() => onAIA && onAIA('assist')}
                    title="Assistència IAIA"
                >
                    <Sparkles size={18} />
                </button>

                <div className="flex items-center gap-1.5 px-2 md:px-4 h-full border-l border-gray-200 dark:border-[#333] relative shrink-0">
                    <button 
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${showExportMenu ? 'bg-[#333] text-white dark:bg-white dark:text-black' : 'text-gray-500 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-[#333] dark:hover:text-white'}`}
                        title="Exportar Nota"
                        onClick={() => setShowExportMenu(!showExportMenu)}
                    >
                        <Download size={20} />
                    </button>
                    
                    {showExportMenu && (
                        <div className="absolute left-0 top-full mt-2 bg-white/90 border-gray-200 dark:bg-[#1e1e1e]/90 dark:border-[#333] backdrop-blur-xl border rounded-2xl shadow-xl z-dropdown overflow-hidden min-w-[220px] origin-top-left animate-in fade-in zoom-in duration-200">
                            <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 dark:border-[#333] dark:bg-[#252525]">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Format d'Exportació</span>
                            </div>
                            <button 
                                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-100 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:bg-[#333] dark:hover:text-white flex items-center gap-3 transition-colors"
                                onClick={() => {
                                    try {
                                        exportService.downloadNoteAsPDF(note);
                                    } catch (err) {
                                        console.error('PDF Export failed:', err);
                                        hapticService.notifyError();
                                    } finally {
                                        setShowExportMenu(false);
                                    }
                                }}
                            >
                                <FileIcon size={16} /> PDF Imprimible
                            </button>
                            <button 
                                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-100 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:bg-[#333] dark:hover:text-white flex items-center gap-3 transition-colors"
                                onClick={() => {
                                    try {
                                        exportService.downloadNoteAsTXT(note);
                                    } catch (err) {
                                        console.error('TXT Export failed:', err);
                                        hapticService.notifyError();
                                    } finally {
                                        setShowExportMenu(false);
                                    }
                                }}
                            >
                                <FileText size={16} /> Text Pla (.txt)
                            </button>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertBlock('H1')}
                    title="Títol (Master)"
                    aria-label="Aplicar format Títol"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertBlock('H2')}
                    title="Subtítol"
                    aria-label="Aplicar format Subtítol"
                >
                    <Heading2 size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertBlock('P')}
                    title="Paràgraf Estàndard"
                    aria-label="Aplicar format Paràgraf"
                >
                    <Type size={18} />
                </button>
                <div className="toolbar-divider" />
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => execCommand('insertUnorderedList')}
                    title="Llista (Bullets)"
                    aria-label="Inserir llista amb pics"
                >
                    <List size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => execCommand('insertOrderedList')}
                    title="Llista Numerada"
                    aria-label="Inserir llista numerada"
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={insertChecklist}
                    title="Llista de Tasques"
                    aria-label="Inserir llista de tasques"
                >
                    <CheckSquare size={18} />
                </button>
                <div className="toolbar-divider" />
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertMedia('image')}
                    title="Insereix Imatge"
                    aria-label="Inserir imatge"
                >
                    <ImageIcon size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertMedia('video')}
                    title="Insereix Vídeo"
                    aria-label="Inserir vídeo"
                >
                    <Video size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertMedia('embed')}
                    title="Codi d'incrustació"
                    aria-label="Inserir codi d'incrustació"
                >
                    <FileCode size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={insertPoll}
                    title="Insereix Enquesta"
                    aria-label="Inserir enquesta"
                >
                    <BarChart3 size={18} />
                </button>
                <div className="toolbar-divider" />
                <button
                    type="button"
                    className="editor-tool share-btn"
                    onClick={() => {
                        const plainText = editorRef.current.innerText;
                        navigator.clipboard.writeText(plainText);
                        alert('Text bategat al porta-retalls per a publicar! 🏺');
                    }}
                    title="Còpia per a Publicació"
                    aria-label="Copiar text per a publicar"
                >
                    <Copy size={18} />
                </button>
                <button
                    type="button"
                    className={`editor-tool ${isCorrecting ? 'thinking' : ''}`}
                    onClick={handleIAIACorrector}
                    disabled={isCorrecting}
                    title="Corrector de l'IAIA (Valencià AVL)"
                    aria-label="Aplicar corrector d'IAIA"
                >
                    {isCorrecting ? <Loader2 size={18} className="spinner" /> : <Languages size={18} />}
                </button>
                <button
                    type="button"
                    className={`editor-tool ${isThinking ? 'thinking' : ''}`}
                    onClick={handleIAIABatec}
                    disabled={isThinking}
                    title="Batec de l'IAIA (Millorar text)"
                    aria-label="Aplicar millora de text IAIA"
                >
                    {isThinking ? <Loader2 size={18} className="spinner" /> : <Sparkles size={18} />}
                </button>
            </div>

            <div
                ref={editorRef}
                className="master-editor-content flex-1 min-h-0 font-sans outline-none overflow-y-auto custom-scrollbar"
                contentEditable
                role="textbox"
                aria-multiline="true"
                aria-label={placeholder || "Àrea de text principal"}
                spellCheck="false"
                onScroll={(e) => setShowScrollTop(e.target.scrollTop > 200)}
                onInput={handleInput}
                onBlur={handleInput}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                onPaste={handlePaste}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={clearDragClasses}
                onClick={(e) => {
                    const removeBtn = e.target.closest('.checklist-item-remove');
                    if (removeBtn) {
                        handleRemoveItem(e);
                    }
                }}
                placeholder={placeholder || t('notebook.placeholder')}
            />

            {showScrollTop && (
                <button
                    onClick={() => editorRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="absolute bottom-6 left-6 p-3 bg-white dark:bg-[#333] text-black dark:text-white rounded-full shadow-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#444] transition-all z-50 animate-in fade-in slide-in-from-bottom-4"
                    title="Pujar a dalt"
                    aria-label="Pujar a dalt"
                >
                    <ArrowUp size={20} />
                </button>
            )}

            {/* Floating Index Atom */}
            {showIndex && <FloatingIndex scrollRef={editorRef} contentSelector=".prose" />}

            <IAIACorrectorOverlay 
                corrections={corrections}
                onApply={applyCorrection}
                onClose={() => setCorrections([])}
            />
        </div>
    );
};

export default MasterEditor;
