# 🔍 AUDITORIA EXTREMA FASE 3 - COMPONENTS UI (PRIMERA MEITAT)

## 🚨 PROBLEMA CRÍTIC SISTÈMIC (AFECTA 15+ COMPONENTS)

### **1. GESTIÓ D'ESTAT EN COMPONENTS VIRTUALITZATS (Virtuoso)**

**Patró detectat:** Ús incorrecte de `useState` local en components que es munten/desmunten constantment per Virtuoso, causant pèrdua d'estat (ex: menus contextuals que no s'obrin).

**Fitxers afectats:**
- `src/components/chat/MessageBubble.jsx`
- `src/components/chat/ChatMessageList.jsx`
- `src/components/chat/ChatInputArea.jsx`

**Codi Actual (Problemàtic):**
```jsx
// MessageBubble.jsx - Línia ~50
const [isActiveMenu, setIsActiveMenu] = useState(false); // ❌ ES PERDRÀ EN RECYCLE

useEffect(() => {
    return () => {
        if (audioRef.current) {
            audioRef.current.pause(); // ❌ Pot cridar-se en component desmuntat
        }
    };
}, []);
```

**Fix:**
```jsx
// MessageBubble.jsx - Línia ~50
// ✅ L'estat del menu ha de vindre del PARE (ChatMessageList)
// El pare manté: const [contextMenuId, setContextMenuId] = useState(null);

// Neteja d'àudio amb ref de muntatge
const isMounted = useRef(true);
useEffect(() => {
    isMounted.current = true;
    return () => {
        isMounted.current = false;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
        }
    };
}, []);

// Reproducció segura
if (isMounted.current) setIsPlaying(true);
```

---

## 📁 PROBLEMES PER COMPONENT/ARXIU

### **2. src/components/chat/ChatInputArea.jsx**

#### **❌ Error 2.1: Re-render Massiu per Estats d'Adjunts**

**Patró detectat:** Els estats `attachedFile` i `attachedFilePreview` estan al component pare (ChatDetail), causant re-renders innecessaris de tota la llista de missatges.

**Codi Actual (Problemàtic):**
```jsx
// ChatInputArea.jsx - Línia ~30
// Els estats venen del pare via props
const { attachedFile, clearAttachment } = useAttachmentManager();
```

**Fix:**
```jsx
// ChatInputArea.jsx - Línia ~30
// ✅ Atraiem els estats d'adjunts AL COMPONENT FILL
const { attachedFile, attachedFilePreview, handleFileSelect, clearAttachment } = useAttachmentManager();

// Això evita que ChatDetail es re-renderitze quan puges un fitxer
```

#### **❌ Error 2.2: Bloqueig de Mobile UI en Pegar Múltiples Imatges**

**Patró detectat:** Ús de `setTimeout` hardcoded per processar imatges enganxades, causant freeze en Androids.

**Codi Actual (Problemàtic):**
```jsx
// ChatInputArea.jsx - Línia ~150
onPaste={(e) => {
    setTimeout(() => { // ❌ TIMEOUT HARDCODED
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                handleFileSelect({ target: { files: [file] } });
                break;
            }
        }
    }, 100);
}}
```

**Fix:**
```jsx
// ChatInputArea.jsx - Línia ~150
onPaste={(e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    // ✅ Ús de rAF per evitar Main Thread Lock
    requestAnimationFrame(() => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                handleFileSelect({ target: { files: [file] } });
                break;
            }
        }
    });
}}
```

---

### **3. src/components/chat/ChatMessageList.jsx**

#### **❌ Error 3.1: Càrrega d'Històric Sense Lock (Duplicació)**

**Patró detectat:** Múltiples crides a `loadOlder` quan l'usuari fa scroll ràpid, causant duplicació de missatges.

**Fix:**
```jsx
// ChatMessageList.jsx - Línia ~40
const isLoadingOlderRef = useRef(false); // ✅ LOCK REF

const loadOlder = useCallback(async () => {
    if (!messages.length || !realChatId || isLoadingOlderRef.current) return;
    isLoadingOlderRef.current = true;
// ...
```

---

### **4. src/components/MasterEditor.jsx**

#### **❌ Error 4.1: ExecCommand Sense Focus Management**
**Fix:** Afegir `editorRef.current.focus();` abans de `document.execCommand`.

#### **❌ Error 4.2: Drag & Drop de Checklist Sense Neteja**
**Fix:** Netejar `.dragging-li, .drag-over-li` window._draggedLi.

---

### **5. src/components/MediaViewerModal.jsx**

#### **❌ Error 5.1: Bloqueig de Body Scroll Incomplet**
**Fix:** Restaurar `originalOverflow` al desmuntar.

---

### **6. src/components/Marketplace.jsx**

#### **❌ Error 6.1: Virtualització Sense Estimació Correcta**
**Fix:** viewMode === 'list' ? 80 : 900 al `estimateSize` de virtualizer.

---

### **7. src/components/IAIAChatSidebar.jsx**

#### **❌ Error 7.1: Redimensionament Sense Límits**
**Fix:** Limitar amplada entre 300 i 800.

---

### **8. src/components/LazyImage.jsx**

#### **❌ Error 8.1: Fuita de Memòria en Imatges**
**Fix:** `img.onload = null; img.onerror = null; img.src = "";`

---

### **9. src/components/MobileBottomNav.jsx**

#### **❌ Error 9.1: Navegació Sense PreventDefault**
**Fix:** `e.preventDefault(); e.stopPropagation();` en `handlePlusClick`.
