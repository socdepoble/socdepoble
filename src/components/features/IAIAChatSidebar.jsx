import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo, lazy } from 'react';
import { geminiService } from '../../core/services/geminiService';
import { pushService } from '../../core/services/pushService';
import { toast } from '../../utils/toast';
import { hapticService } from '../../core/services/hapticService';
import { Loader2, FileText, ImageIcon, ChevronRight, Terminal, Calendar, Download, Mic, Type, Sparkles, Bold, Italic, Link2, Plus, X, Send, Shield } from 'lucide-react';
import Portal from '../ui/Portal';
import './IAIAChatSidebar.css';

const VoiceRecorder = lazy(() => import('../ui/VoiceRecorder'));

const FallbackLoader = () => (
    <div className="h-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#F97316] w-6 h-6" />
    </div>
);

const IAIAChatSidebar = ({ isOpen, onClose, context = "general" }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      text: "Hola mestre! Sóc l'Archon, el mode agent d'execució de la IAIA. En què t'he d'ajudar avui amb aquest tràmit? Puc buscar dades, analitzar documents o fer feina per tu si em deixes!",
      type: 'archon'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [width, setWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(null); // 'poll' | 'list'
  const [inputHeight, setInputHeight] = useState('44px');
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const sidebarRef = useRef(null);
  const menuRef = useRef(null);
  const lastArchonQuestion = useRef(null);
  const isMounted = useRef(true);
  const archonTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const resizeRaf = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
        isMounted.current = false;
        if (archonTimeoutRef.current) clearTimeout(archonTimeoutRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // BATEGAT: Protocol de Permisos de Notificació
  useEffect(() => {
    if (isOpen) {
        const checkPerms = async () => {
            const permission = await pushService.requestPermission();
            if (permission === 'granted') {
                console.log('[Archon] Notificacions habilitades pel Mestre.');
            }
        };
        checkPerms();
    }
  }, [isOpen]);

  // BATEGAT: Protocol d'Expandiment de Camp
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    
    el.style.height = '44px';
    const newHeight = Math.min(el.scrollHeight, 150);
    el.style.height = `${newHeight}px`; // Mutació directa DOM
    
    // Només avisa a React si el contenidor canvia dràsticament per no triggerejar renders a cada lletra
    setInputHeight(prev => prev !== `${newHeight}px` ? `${newHeight}px` : prev);
  }, [input]);

  // BATEGAT: Protocol de Redimensionament Sobirà
  useEffect(() => {
    if (isOpen) {
        document.documentElement.style.setProperty('--iaia-sidebar-width', `${width}px`);
    } else {
        document.documentElement.style.setProperty('--iaia-sidebar-width', '0px');
    }
  }, [width, isOpen]);

  const MIN_SIDEBAR_WIDTH = 300;
  const MAX_SIDEBAR_WIDTH = 800;
  
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    if (resizeRaf.current) {
        cancelAnimationFrame(resizeRaf.current);
        resizeRaf.current = null;
    }
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((e) => {
    if (!isResizing) return;
    
    const clientX = e.clientX;
    const innerWidth = window.innerWidth;
    
    if (resizeRaf.current) return;
    resizeRaf.current = requestAnimationFrame(() => {
        const newWidth = innerWidth - clientX;
        // Calculem la nova amplada amb límits precisos
        const clampedWidth = Math.min(Math.max(newWidth, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
        setWidth(clampedWidth);
        resizeRaf.current = null;
    });
  }, [isResizing]);

  useEffect(() => {
    if (!isResizing) return;
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing, resize, stopResizing]);

  // Persistim l'amplada en localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarWidth');
    if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
            setWidth(parsed);
        }
    }
  }, []);

  useEffect(() => {
    if (!isResizing) { // Guardar nomes en parar
        localStorage.setItem('sidebarWidth', width.toString());
    }
  }, [width, isResizing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsAttachmentMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        requestAnimationFrame(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        });
    }
  }, [messages]);

  const isOnlyEmojis = (str) => {
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    const chars = Array.from(str.trim());
    if (chars.length === 0) return false;
    return chars.every(char => emojiRegex.test(char) || /\s/.test(char));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      let mediaType = 'file';
      if (file.type.startsWith('image')) mediaType = 'image';
      else if (file.type.startsWith('video')) mediaType = 'video';
      else if (file.type === 'application/pdf') mediaType = 'pdf';

      if (selectedFile?.preview) {
         URL.revokeObjectURL(selectedFile.preview);
      }

      setSelectedFile({
        file,
        preview: mediaType === 'image' || mediaType === 'video' ? URL.createObjectURL(file) : null,
        type: mediaType,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
      setIsAttachmentMenuOpen(false);
    }
  };

  useEffect(() => {
     return () => {
         if (selectedFile?.preview) {
             URL.revokeObjectURL(selectedFile.preview);
         }
         if (archonTimeoutRef.current) {
             clearTimeout(archonTimeoutRef.current);
         }
     };
  }, [selectedFile]);

  const attachmentTypes = [
    { id: 'file', label: 'Archivo', icon: <FileText size={20} />, color: '#00A5F4', accept: '*/*' },
    { id: 'media', label: 'Fotos y videos', icon: <ImageIcon size={20} />, color: '#007AFF', accept: 'image/*,video/*' },
    { id: 'contact', label: 'Contacto', icon: <ChevronRight size={20} />, color: '#FF9500' }, // Simplified
    { id: 'poll', label: 'Encuesta', icon: <Terminal size={20} />, color: '#FFCC00' },
    { id: 'event', label: 'Evento', icon: <Calendar size={20} />, color: '#FF2D55' },
  ];

  const handleVoiceSend = async (blob, duration, transcript) => {
    setIsRecording(false);
    if (!blob) return;

    const userMsg = { 
        id: Date.now(), 
        role: 'user', 
        text: transcript || "🎙️ [Nota de Veu Nadiua]",
        isEmojiOnly: false,
        media: null
    };

    setMessages(prev => [...prev, userMsg]);

    try {
        const audioData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const b = reader.result;
                const [meta, data] = b.split(',');
                resolve({ mimeType: meta.split(':')[1].split(';')[0], data });
            };
            reader.readAsDataURL(blob);
        });

        const promptMsg = {
           id: Date.now() + 1,
           role: 'assistant',
           text: "He rebut el teu bategat sonor, mestre. Com vols que l'Archon et responga per mantindre l'Accessibilitat Universal?",
           type: 'audio_preference_prompt',
           pendingAudioData: audioData,
           pendingTranscript: transcript
        };
        
        setMessages(prev => [...prev, promptMsg]);
    } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Ai, el sistema d'àudio fallat al carregar en memòria... Torna-ho a provar." }]);
    }
  };

  const triggerAudioResponse = useCallback(async (promptMsg, preference) => {
      // 1. Transform prompt to processing mode
      setMessages(prev => prev.map(m => m.id === promptMsg.id ? { 
          ...m, 
          type: 'archon', 
          text: "Processant el bategat sonor en la matriu de l'Archon...",
          steps: ["Pujant àudio nadiu a Gemini 1.5 Flash..."] 
      } : m));

      setIsTyping(true);

      try {
          const formatRequirement = preference === 'voice' 
              ? "Has de respondre de forma curta, directa i súper conversacional per a ser sintetitzada per veu (TTS). Actua de forma col·loquial com un assistent personal amic i simpàtic però molt pro."
              : "La resposta ha de ser estructurada, usant llistes Markdown (bullet points) i de forma ordenada per a ser llegida fàcilment.";

          const query = `Context: ${context}. Nota de veu de l'usuari transcrita: ${promptMsg.pendingTranscript}. Instruccions de format: ${formatRequirement}. (Si no n'hi ha transcripció, analitza el Inline Audio).`;
          
          let geminiTimerId;
          const geminiTimeout = new Promise((_, reject) => {
              geminiTimerId = setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 25000); 
          });
          
          if (abortControllerRef.current) abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();

          let response = await Promise.race([
              geminiService.ask('ARCHON', query, null, promptMsg.pendingAudioData, abortControllerRef.current.signal),
              geminiTimeout
          ]);
          clearTimeout(geminiTimerId);
          
          setMessages(prev => prev.map(m => m.id === promptMsg.id ? { 
            ...m, 
            text: response.text,
            type: 'archon',
            steps: [
                "Àudio natiu processat correctament.",
                `Format escollit per Mestre: ${preference === 'voice' ? 'Sintetització de Veu Nadiua' : 'Text Estructurat'}`
            ]
          } : m));

          // En cas de voler resposta per veu nativa, ací vindria l'enllaç amb el TTS (Text-to-Speech)
          if (preference === 'voice') {
              hapticService.notifySuccess(); // A l'espera de TTS implementació profunda
          }

      } catch (err) {
          console.error(err);
          setMessages(prev => prev.map(m => m.id === promptMsg.id ? { ...m, type: 'archon', text: "Ai, m'he travat processant la nota de veu. La pols digital es massa grossa." } : m));
      } finally {
          setIsTyping(false);
          setInputHeight('44px');
      }
  }, [context]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isTyping) return;

    const userMsg = { 
      id: Date.now(), 
      role: 'user', 
      text: input,
      isEmojiOnly: isOnlyEmojis(input),
      media: selectedFile ? { ...selectedFile } : null
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSelectedFile(null);
    setIsTyping(true);

      let geminiTimerId;
      try {
        const query = `Context: ${context}. Usuari diu: ${input}`;
        const geminiTimeout = new Promise((_, reject) => {
            geminiTimerId = setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 15000); // 15 segons
        });

        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        
        const messageId = Date.now() + 1;
        let isFirstChunk = true;

        let response = await Promise.race([
            geminiService.ask('ARCHON', query, null, null, abortControllerRef.current.signal, (chunkText) => {
                setMessages(prev => {
                    const existingMsg = prev.find(m => m.id === messageId);
                    if (existingMsg) {
                        return prev.map(m => m.id === messageId ? { ...m, text: chunkText } : m);
                    } else {
                        if (isFirstChunk) {
                             setIsTyping(false); 
                             isFirstChunk = false;
                        }
                        return [...prev, {
                            id: messageId,
                            role: 'assistant',
                            text: chunkText,
                            type: 'archon',
                            steps: [
                                "Processant riu de dades..."
                            ]
                        }];
                    }
                });
            }),
            geminiTimeout
        ]);
        clearTimeout(geminiTimerId);
        
        // Millora de la resposta simulada (si Gemini no bategat)
        if (response.text.includes("Falta la clau del tractor") || response.text.includes("Soc l'Archon")) {
            const lowInput = input.toLowerCase();
            const isAffirmative = lowInput === "sí" || lowInput === "si" || lowInput.includes("d'acord") || lowInput.includes("per favor") || lowInput.includes("vale");

            if (isAffirmative && lastArchonQuestion.current === 'deed_draft') {
                response.text = "Entès, mestre! M'hi poso ara mateix amb el borrador de les escriptures. T'avisaré en un bategat quan el tingui llest. Pots seguir navegant pel Mas.";
                
                // SIMULACIÓ DE TASCA DE FONS (EXECUCIÓ ARCHON)
                archonTimeoutRef.current = setTimeout(() => {
                    if (!isMounted.current) return;
                    
                    const msg = "Mestre, ja tinc el borrador de les escriptures llest per a pujar a SUMA Online. Vols revisar-lo?";
                    
                    // Notificació de Navegador (API Real)
                    if (Notification.permission === 'granted') {
                        new Notification("👵 IAIA Archon", {
                            body: msg,
                            icon: "/system/master/iaia_archon_icon.png"
                        });
                    }

                    // Notificació visual interna (Toast Premium)
                    toast.success(msg, {
                        duration: 6000,
                        icon: '🏺',
                        style: {
                            border: '2px solid #e879f9',
                            background: '#1a1a1a',
                            color: '#fff',
                            fontWeight: 'bold'
                        }
                    });

                    hapticService.notifyAIReady();
                    
                    // Injecció de missatge al xat si segueix obert
                    setMessages(prev => [...prev, {
                        id: Date.now() + 500,
                        role: 'assistant',
                        text: msg,
                        type: 'archon',
                        steps: ["Tasques de fons completades.", "Fitxer generat al Buffer."]
                    }]);
                }, 5000);

            } else if (lowInput.includes("proaguas") || lowInput.includes("nom")) {
                response.text = "Excel·lent decisió, mestre. Trucar a Proaguas Costa Blanca és fonamental per al subministrament físic, però recorda que aquest rebut és de SUMA. El meu trellat et diu: actualitza la titularitat a la Sede Electrònica de SUMA amb el teu certificat digital; així evitaràs que els impostos es perdin i generin recàrrecs com aquests 6€ de costes. Vols que prepare el borrador de les escriptures per a pujar-les a SUMA?";
                lastArchonQuestion.current = 'deed_draft';
            } else if (lowInput.includes("germà") || lowInput.includes("germans") || lowInput.includes("javi") || lowInput.includes("nando") || lowInput.includes("dividir") || lowInput.includes("pantalla") || lowInput.includes("pagar")) {
                response.text = "He bategat la taula, mestre. Ara el compte del Mas mostra el que és just: San Isidro (89,26€) per a tu i Barrinada (131,43€) per a Nando. He dividit los 6€ de costes a mitges (3€ per u), així que els totals són 92,26€ i 134,43€. Ja bategua amb la realitat de la terra.";
            } else if (lowInput.includes("pagat")) {
                response.text = "Entès, mestre! He registrat el pagament al Protocol d'Herència. Ara mateix estic preparant la petició per a Proaguas Costa Blanca per a tramitar el canvi de titularitat. Vols que genere l'informe d'execució?";
            } else {
                response.text = "Soc l'Archon. He bategat la teua petició. Estic analitzant el tràmit d'herència per a veure quins passos falten. En què més et puc ajudar amb el paperam?";
            }
        }
        
        const finalSteps = [
            "Analitzant context del tràmit...",
            "Verificant permisos de l'usuari...",
            "Executant bategat de dades...",
            "Generant veredicte d'execució."
        ];
        
        setMessages(prev => {
            const existingMsg = prev.find(m => m.id === messageId);
            if (existingMsg) {
                return prev.map(m => m.id === messageId ? { ...m, text: response.text, steps: finalSteps } : m);
            } else {
                return [...prev, { 
                    id: messageId, 
                    role: 'assistant', 
                    text: response.text,
                    type: 'archon',
                    steps: finalSteps
                }];
            }
        });
    } catch {
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Ai, m'he travat una mica... Torna-m'ho a dir!" }]);
    } finally {
      if (geminiTimerId) clearTimeout(geminiTimerId);
      setIsTyping(false);
      setInputHeight('44px');
    }
  };

  const applyFormat = (format) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = input.substring(start, end);
    let formattedText = '';

    if (format === 'bold') formattedText = `*${selectedText}*`;
    else if (format === 'italic') formattedText = `_${selectedText}_`;
    else if (format === 'link') formattedText = `[${selectedText}](url)`;

    const newInput = input.substring(0, start) + formattedText + input.substring(end);
    setInput(newInput);
    
    setTimeout(() => {
        if (!textareaRef.current) return; // ESCUT ANTI-NULL
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + 1, start + 1 + selectedText.length);
    }, 10);
  };

  const renderedMessages = useMemo(() => {
    return messages.map(msg => (
      <div key={msg.id} className={`chat-bubble-wrapper ${msg.role}`}>
        <div className={`chat-bubble ${msg.type === 'archon' ? 'archon-style' : ''} ${msg.isEmojiOnly ? 'emoji-only' : ''}`}>
          {msg.media && (
            <div className="chat-media-preview mb-3 card-radius overflow-hidden border border-white/10 glass-premium">
              {msg.media.type === 'video' ? (
                <video src={msg.media.preview} controls className="w-full max-h-60 object-cover" />
              ) : msg.media.type === 'image' ? (
                <img src={msg.media.preview} alt="Evidence" className="w-full max-h-60 object-cover" />
              ) : (
                <div className="file-bubble flex items-center gap-3 p-4 bg-white/5">
                  <div className="file-icon p-2 bg-orange-500/20 rounded-[20px] text-blue-400">
                    <FileText size={24} />
                  </div>
                  <div className="file-info flex-1">
                    <p className="text-xs font-bold truncate">{msg.media.name}</p>
                    <p className="text-[9px] opacity-40 uppercase">{msg.media.size}</p>
                  </div>
                  <Download size={16} className="opacity-20" />
                </div>
              )}
            </div>
          )}
          {msg.type === 'archon' && (
            <div className="archon-steps mb-3">
                {msg.steps?.map((step, i) => (
                    <div key={i} className="step-line flex items-center gap-2 text-[9px] opacity-40">
                        <Terminal size={10} />
                        <span>{step}</span>
                    </div>
                ))}
            </div>
          )}
          <p className="text-sm leading-relaxed">{msg.text}</p>
          
          {msg.type === 'audio_preference_prompt' && (
            <div className="audio-preference-actions mt-4 flex gap-2">
                <button 
                  onClick={() => triggerAudioResponse(msg, 'voice')} 
                  className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-[28px] text-[11px] font-black uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                >
                    <Mic size={14} className="text-[#F97316]"/> Diga-ho
                </button>
                <button 
                  onClick={() => triggerAudioResponse(msg, 'text')} 
                  className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-[28px] text-[11px] font-black uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                >
                    <Type size={14} className="text-purple-500"/> Escriu-ho
                </button>
            </div>
          )}
        </div>
      </div>
    ));
  }, [messages, triggerAudioResponse]);

  return (
    <Portal>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] touch-none overscroll-none animate-in fade-in duration-300 pointer-events-auto" 
          onClick={onClose} 
        />
      )}
      <div 
          ref={sidebarRef}
          className={`iaia-chat-sidebar relative z-sidebar bg-gray-900 border-l border-white/5 ${isOpen ? 'open' : ''} ${isResizing ? 'resizing' : ''}`}
        style={{ 
          width: (isOpen && typeof window !== 'undefined' && window.innerWidth > 768) 
            ? `${width}px` 
            : (isOpen ? '100%' : '0px'),
          transition: isResizing ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.1s ease-out'
        }}
    >
      {activeModule === 'poll' && <PollManager onClose={() => setActiveModule(null)} />}
      {activeModule === 'list' && <ListManager onClose={() => setActiveModule(null)} />}
      
      <div className="bottom-sheet-handle" />
      {/* DRAG HANDLE: L'Ansa de l'Arxiu */}
      <div 
        className="resize-handle" 
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={width}
        aria-valuemin={MIN_SIDEBAR_WIDTH}
        aria-valuemax={MAX_SIDEBAR_WIDTH}
        tabIndex={0}
        onMouseDown={startResizing}
        onTouchStart={startResizing}
        onKeyDown={(e) => {
          if(e.key === 'ArrowLeft') setWidth(w => Math.max(w - 20, MIN_SIDEBAR_WIDTH));
          if(e.key === 'ArrowRight') setWidth(w => Math.min(w + 20, MAX_SIDEBAR_WIDTH));
        }}
      >
        <div className="handle-line" />
      </div>

      <div 
        className="chat-messages-container flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar" 
        ref={scrollRef}
      >
        {renderedMessages}
        {isTyping && (
            <div className="typing-indicator flex items-center gap-2 p-4 opacity-50">
                <Sparkles size={14} className="animate-spin" />
                <span className="text-[10px] uppercase font-black">L'Archon està bategant...</span>
            </div>
        )}
      </div>

      <footer className="chat-sidebar-footer">
        {parseInt(inputHeight) > 50 && (
          <div className="formatting-toolbar flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-[28px] shadow-2xl animate-in fade-in slide-in-from-bottom-2 mb-3 backdrop-blur-md">
            <button onClick={() => applyFormat('bold')} className="p-2 hover:bg-white/10 rounded-[20px] text-gray-400 hover:text-white transition-colors" title="Negreta">
              <Bold size={16} />
            </button>
            <button onClick={() => applyFormat('italic')} className="p-2 hover:bg-white/10 rounded-[20px] text-gray-400 hover:text-white transition-colors" title="Cursiva">
              <Italic size={16} />
            </button>
            <button onClick={() => applyFormat('link')} className="p-2 hover:bg-white/10 rounded-[20px] text-gray-400 hover:text-white transition-colors" title="Enllaç">
              <Link2 size={16} />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <span className="text-[9px] font-black uppercase tracking-tighter text-fuchsia-500 px-2">Eines del Trellat</span>
          </div>
        )}
        <div className="input-pills flex gap-2 mb-4 overflow-x-auto pb-2">
            <button className="pill-btn" aria-label="Estat Tràmit" onClick={() => setInput("Com està el meu tràmit?")}>Estat Tràmit?</button>
            <button className="pill-btn" aria-label="Analitza documents" onClick={() => setInput("Analitza les escriptures")}>Analitza documentos</button>
            <button className="pill-btn" aria-label="Informe Final" onClick={() => setInput("Fes l'informe final")}>Informe Final</button>
        </div>
        <div className="chat-input-wrapper relative flex items-center gap-2">
          <input 
            id="sidebar-file-upload"
            name="sidebar-file-upload"
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => handleFileChange(e)}
          />
          
          <div className="relative" ref={menuRef}>
            <button 
              className={`plus-btn flex-shrink-0 transition-transform ${isAttachmentMenuOpen ? 'rotate-45' : ''}`}
              aria-label="Obrir menú d'adjunts"
              onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
            >
              <Plus size={20} />
            </button>
            
            {isAttachmentMenuOpen && (
              <div className="absolute bottom-[calc(100%+12px)] left-0 w-56 bg-[#232323] border border-white/5 genesis-radius p-2 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4 flex flex-col gap-1 z-50">
                {attachmentTypes.map(type => (
                  <button 
                    key={type.id}
                    className="flex items-center gap-4 p-3 hover:bg-white/5 card-radius transition-colors text-left"
                    onClick={() => {
                        if (type.id === 'file' || type.id === 'media') {
                            fileInputRef.current.accept = type.accept;
                            fileInputRef.current.click();
                        } else if (type.id === 'poll') {
                            setActiveModule('poll');
                            setIsAttachmentMenuOpen(false);
                        } else if (type.id === 'event') {
                            setActiveModule('list');
                            setIsAttachmentMenuOpen(false);
                        } else {
                            alert(`${type.label} no implementat en aquesta demo.`);
                        }
                    }}
                  >
                    <div className="w-10 h-10 rounded-[28px] flex items-center justify-center text-white" style={{ background: type.color }}>
                      {type.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-200">{type.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-1 relative">
            {isRecording ? (
                <div className="voice-recorder-overlay animate-in slide-in-from-bottom-5 duration-300 w-full bg-[#1a1a1a] shadow-2xl relative z-40 rounded-[28px] overflow-hidden">
                    <Suspense fallback={<FallbackLoader />}>
                        <VoiceRecorder 
                            onSend={handleVoiceSend}
                            onCancel={() => setIsRecording(false)}
                        />
                    </Suspense>
                </div>
            ) : (
                <>
                    {selectedFile && (
                    <div className="absolute bottom-full left-0 mb-4 p-3 bg-[#1a1a1a] border border-white/10 genesis-radius flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 shadow-2xl z-40">
                        <div className="w-12 h-12 bg-white/5 card-radius flex items-center justify-center overflow-hidden">
                            {selectedFile.type === 'image' || selectedFile.type === 'video' ? (
                                <img src={selectedFile.preview} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <FileText size={20} className="text-blue-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-[10px] font-black truncate">{selectedFile.name}</p>
                            <p className="text-[8px] opacity-40 uppercase">{selectedFile.size}</p>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="p-1.5 hover:bg-white/10 rounded-[28px]">
                        <X size={14} />
                        </button>
                    </div>
                    )}

                    <textarea 
                    id="sidebar-chat-input"
                    name="sidebar-chat-input"
                    ref={textareaRef}
                    placeholder="Enviament bategat..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                        }
                    }}
                    className="w-full resize-none py-3 pr-12 pl-4 scroll-smooth"
                    style={{ height: inputHeight }}
                    />
                    
                    {!input.trim() && !selectedFile ? (
                        <button 
                            className="send-btn bg-transparent hover:bg-white/5 text-gray-400 hover:text-[#F97316] transition-colors !pr-[6px]"
                            onClick={() => setIsRecording(true)}
                            title="Nota de Veu"
                        >
                            <Mic size={18} />
                        </button>
                    ) : (
                        <button 
                        className="send-btn"
                        disabled={!input.trim() && !selectedFile}
                        onClick={handleSend}
                        >
                        <Send size={18} />
                        </button>
                    )}
                </>
            )}
          </div>
        </div>
        <div className="footer-status mt-3 flex items-center justify-center gap-2 opacity-30">
            <Shield size={10} />
            <span className="text-[8px] uppercase font-black">Protocol Archon Securitzat</span>
        </div>
      </footer>
    </div>
    </Portal>
  );
};

export default React.memo(IAIAChatSidebar);

