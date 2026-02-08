import React, { useRef, useEffect, useState } from 'react';
import { Heading1, Heading2, Type, List, ListOrdered, Undo, Redo, Sparkles, Loader2 } from 'lucide-react';
import { iaiaService } from '../services/iaiaService';
import { hapticService } from '../services/hapticService';
import './MasterEditor.css';

const MasterEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [isThinking, setIsThinking] = React.useState(false);

    // Initial content setup
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
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
                <div className="toolbar-divider" />
                <button
                    type="button"
                    className={`editor-tool iaia-btn ${isThinking ? 'thinking' : ''}`}
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
                onInput={handleInput}
                onBlur={handleInput}
                placeholder={placeholder}
            />
        </div>
    );
};

export default MasterEditor;
