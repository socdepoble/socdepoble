import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading1, Heading2, Type, List, ListOrdered, Undo, Redo, Sparkles, Loader2, Copy, CheckSquare, Image as ImageIcon, Video, FileCode, BarChart3, GripVertical, Download, FileText, File as FileIcon, Trash2, Languages } from 'lucide-react';
import { exportService } from '../services/exportService';
import { iaiaService } from '../services/iaiaService';
import { hapticService } from '../services/hapticService';
import IAIACorrectorOverlay from './IAIACorrectorOverlay';
import './MasterEditor.css';

const MasterEditor = ({ note, onChange, onAIA, placeholder }) => {
    const { t } = useTranslation();
    const editorRef = useRef(null);
    const [isThinking, setIsThinking] = useState(false);
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [corrections, setCorrections] = useState([]);

    // Initial content setup
    useEffect(() => {
        if (editorRef.current && note?.content !== undefined && editorRef.current.innerHTML !== note.content) {
            editorRef.current.innerHTML = note.content || '';
        }
    }, [note?.content]);

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
            document.execCommand('insertHTML', false, cleanHTML || text);
        } else {
            document.execCommand('insertText', false, text);
        }
        handleInput();
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        handleInput();
        editorRef.current.focus();
    };

    const insertBlock = (tag) => {
        // Simple block level insertion
        document.execCommand('formatBlock', false, tag);
        handleInput();
        editorRef.current.focus();
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
        document.execCommand('insertHTML', false, `<div>${html}</div>`);
        handleInput();
    };

    const handleDragStart = (e) => {
        const li = e.target.closest('li');
        if (!li || !li.classList.contains('checklist-block li')) { // This selector check is loose, using parent check
            if (e.target.closest('.checklist-block')) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', li.outerHTML);
                li.classList.add('dragging-li');
                window._draggedLi = li;
            }
        }
    };

    const handleDragOver = (e) => {
        const li = e.target.closest('li');
        if (li && li.closest('.checklist-block')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            li.classList.add('drag-over-li');
        }
    };

    const handleDragLeave = (e) => {
        const li = e.target.closest('li');
        if (li) li.classList.remove('drag-over-li');
    };

    const handleDrop = (e) => {
        const targetLi = e.target.closest('li');
        const draggedLi = window._draggedLi;
        
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
        
        // Cleanup all visual states
        document.querySelectorAll('.dragging-li, .drag-over-li').forEach(el => {
            el.classList.remove('dragging-li', 'drag-over-li');
        });
        window._draggedLi = null;
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
        const html = `
            <div class="poll-block" contenteditable="false" data-poll-id="${pollId}">
                <div class="poll-header">
                    <div class="poll-icon"><BarChart3 size={14} /></div>
                    <span contenteditable="true" class="poll-question" data-placeholder="Pregunta de l'enquesta..."></span>
                </div>
                <div class="poll-options">
                    <div class="poll-option-placeholder">Les opcions es bateguen en publicar...</div>
                </div>
                <div class="poll-footer">Enquesta del Poble</div>
            </div>
            <p><br></p>
        `;
        document.execCommand('insertHTML', false, html);
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
        const html = editorRef.current.innerHTML;
        // This is a simple replacement, might need refinement for complex cases
        const newHtml = html.replace(original, `<strong>${suggeriment}</strong>`);
        editorRef.current.innerHTML = newHtml;
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
        <div className="master-editor-container">
            <div className="master-editor-toolbar">
                <button
                    type="button"
                    className="editor-tool primary"
                    onClick={() => onAIA && onAIA('assist')}
                    title="Assistència IAIA"
                >
                    <Sparkles size={18} />
                </button>

                <div className="flex items-center gap-1.5 px-4 h-full border-l border-white/5 relative">
                    <button 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showExportMenu ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                        title="Exportar Nota"
                        onClick={() => setShowExportMenu(!showExportMenu)}
                    >
                        <Download size={20} />
                    </button>
                    
                    {showExportMenu && (
                        <div className="absolute left-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden min-w-[220px] origin-top-left animate-in fade-in zoom-in duration-200">
                            <div className="px-4 py-2 border-bottom border-white/5 bg-white/5">
                                <span className="text-[10px] uppercase font-black text-orange-500/80 tracking-widest">Format d'Exportació</span>
                            </div>
                            <button 
                                className="w-full px-4 py-3 text-left text-xs font-bold hover:bg-orange-500/10 text-gray-300 hover:text-orange-400 flex items-center gap-3 transition-colors"
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
                                <FileIcon size={14} /> PDF Imprimible
                            </button>
                            <button 
                                className="w-full px-4 py-3 text-left text-xs font-bold hover:bg-orange-500/10 text-gray-300 hover:text-orange-400 flex items-center gap-3 transition-colors"
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
                                <FileText size={14} /> Text Pla (.txt)
                            </button>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertBlock('H1')}
                    title="Títol (Master)"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertBlock('H2')}
                    title="Subtítol"
                >
                    <Heading2 size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertBlock('P')}
                    title="Paràgraf Estàndard"
                >
                    <Type size={18} />
                </button>
                <div className="toolbar-divider" />
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => execCommand('insertUnorderedList')}
                    title="Llista (Bullets)"
                >
                    <List size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => execCommand('insertOrderedList')}
                    title="Llista Numerada"
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={insertChecklist}
                    title="Llista de Tasques"
                >
                    <CheckSquare size={18} />
                </button>
                <div className="toolbar-divider" />
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertMedia('image')}
                    title="Insereix Imatge"
                >
                    <ImageIcon size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertMedia('video')}
                    title="Insereix Vídeo"
                >
                    <Video size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={() => insertMedia('embed')}
                    title="Codi d'incrustació"
                >
                    <FileCode size={18} />
                </button>
                <button
                    type="button"
                    className="editor-tool"
                    onClick={insertPoll}
                    title="Insereix Enquesta"
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
                >
                    <Copy size={18} />
                </button>
                <button
                    type="button"
                    className={`editor-tool ${isCorrecting ? 'thinking' : ''}`}
                    onClick={handleIAIACorrector}
                    disabled={isCorrecting}
                    title="Corrector de l'IAIA (Valencià AVL)"
                >
                    {isCorrecting ? <Loader2 size={18} className="spinner" /> : <Languages size={18} />}
                </button>
                <button
                    type="button"
                    className={`editor-tool ${isThinking ? 'thinking' : ''}`}
                    onClick={handleIAIABatec}
                    disabled={isThinking}
                    title="Batec de l'IAIA (Millorar text)"
                >
                    {isThinking ? <Loader2 size={18} className="spinner" /> : <Sparkles size={18} />}
                </button>
            </div>

            <div
                ref={editorRef}
                className="master-editor-content"
                contentEditable
                spellCheck="false"
                onInput={handleInput}
                onBlur={handleInput}
                onPaste={handlePaste}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={(e) => {
                    const removeBtn = e.target.closest('.checklist-item-remove');
                    if (removeBtn) {
                        handleRemoveItem(e);
                    }
                }}
                placeholder={placeholder || t('notebook.placeholder')}
            />

            <IAIACorrectorOverlay 
                corrections={corrections}
                onApply={applyCorrection}
                onClose={() => setCorrections([])}
            />
        </div>
    );
};

export default MasterEditor;
