# 🏺 AUDITORÍA FASE 4: COMPONENTS_NZ - HALLAZGOS CRÍTICOS

## 📋 Resumen Ejecutivo
He detectado **7 problemas de alto impacto** que afectan rendimiento móvil, fugas de memoria o estado CRDT. Prioridad: **ALTA**.

---

## 🔴 CRÍTICO: NotebookList.jsx
**Problema**: Typo en variable causa ReferenceError en drag&drop.

```jsx
// LÍNEA ~45: ERROR DE SINTAXIS
if (sourceIndex === targe tIndex) return; // ❌ Espacio en nombre de variable
```

**Fix**:
```jsx
// CORRECCIÓN INMEDIATA
if (sourceIndex === targetIndex) return; // ✅
```

---

## 🔴 CRÍTICO: OmniscientViewer.jsx
**Problema 1**: Manipulación directa del DOM viola principio React + causa fugas.

```jsx
// LÍNEAS ~85-95: ACCESO DIRECTO A DOM SIN CLEANUP
const handleTextSelection = (e) => {
    const toolbar = document.getElementById('pdf-quote-tool'); // ❌ Anti-patrón
    if (text && toolbar) {
        toolbar.style.display = 'flex'; // ❌ Mutación directa
        toolbar.style.top = `${e.clientY - 40}px`;
    }
};
```

**Fix con useRef + cleanup**:
```jsx
// 1. Declarar ref en componente
const toolbarRef = useRef<HTMLDivElement>(null);

// 2. Reemplazar acceso directo
const handleTextSelection = useCallback((e: MouseEvent) => {
    const toolbar = toolbarRef.current; // ✅ Patrón React
    if (!toolbar) return;
    
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text) {
        toolbar.style.display = 'flex';
        toolbar.style.top = `${e.clientY - 40}px`;
        toolbar.style.left = `${e.clientX}px`;
    } else {
        toolbar.style.display = 'none';
    }
}, []);

// 3. En el JSX, asignar ref
<div ref={toolbarRef} id="pdf-quote-tool" className="pdf-selection-toolbar" />

// 4. Cleanup en useEffect si es necesario
useEffect(() => {
    return () => {
        if (toolbarRef.current) {
            toolbarRef.current.style.display = 'none';
        }
    };
}, []);
```

**Problema 2**: `renderContent` gigante causa re-renders en cascada.

```jsx
// LÍNEA ~400: FUNCIÓN NO MEMOIZADA QUE SE RECREA EN CADA RENDER
const renderContent = () => { /* 300+ líneas de switch */ };
```

**Fix**:
```jsx
// MOVER FUERA DEL COMPONENTE o memoizar
const renderContent = useCallback(() => {
    // ... contenido ...
}, [viewerConfig, zoom, savedNotes, manualNote, content]); // ✅ Deps explícitas
```

---

## 🟡 ALTA: NotebookSidebar.jsx
**Problema**: `renderFolder` definida internamente causa re-creación en cada render + pérdida de memoization.

```jsx
// DENTRO DEL COMPONENTE:
const renderFolder = (folder, depth = 0) => { /* ... */ }; // ❌
```

**Fix**:
```jsx
// OPCIÓN A: Mover fuera del componente (si no necesita estado interno)
const renderFolder = (folder, depth, expandedFolders, toggleExpand, props) => {
    // ... implementación ...
};

// OPCIÓN B: Memoizar con useCallback
const renderFolder = useCallback((folder, depth = 0) => {
    // ... implementación ...
}, [expandedFolders, activeFolder, isCollapsed]); // ✅ Deps mínimas
```

---

## 🟡 ALTA: PDFBategatManager.jsx
**Problema 1**: Posible `undefined` en `fileBytes` si `fileToWork` es null en modo "nuevo PDF".

```jsx
// LÍNEA ~180: CONDICIONAL INCOMPLETO
if (fileToWork) {
    fileBytes = await fileToWork.arrayBuffer(); // ✅
    pdfDoc = await PDFDocument.load(fileBytes);
} else {
    pdfDoc = await PDFDocument.create();
    // ❌ fileBytes sigue undefined, pero analyzePDFStructure lo usa después
}
// ... más abajo ...
if (fileToWork) {
    mapping = await analyzePDFStructure(fileBytes); // 💥 fileBytes podría ser undefined
}
```

**Fix**:
```jsx
// GARANTIZAR QUE fileBytes EXISTA O PROTEGER LA LLAMADA
let fileBytes: ArrayBuffer | undefined;
if (fileToWork) {
    fileBytes = await fileToWork.arrayBuffer();
    pdfDoc = await PDFDocument.load(fileBytes);
} else {
    pdfDoc = await PDFDocument.create();
    // ... crear plantilla ...
}

// ... más abajo ...
// ✅ Solo analizar si tenemos archivo Y bytes
if (fileToWork && fileBytes) {
    mapping = await analyzePDFStructure(fileBytes);
}
```

**Problema 2**: Duplicidad `uploadedFile` (state) + `uploadedFileRef` (ref) sin sincronización.

```jsx
const [uploadedFile, setUploadedFile] = useState(null);
const uploadedFileRef = useRef(null); // ❌ Posible desincronización

const handleFileUpload = (e) => {
    setUploadedFile(file); // ✅
    uploadedFileRef.current = file; // ✅ pero... ¿y si el state se actualiza después?
};
```

**Fix** (elegir una fuente de verdad):
```jsx
// RECOMENDADO: Usar SOLO state, acceder vía functional updates
const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        setUploadedFile(file); // ✅ Única fuente de verdad
        // Eliminar uploadedFileRef del código
    }
};

// Y en generatePDF:
const fileToWork = uploadedFile; // ✅ Directo del state
```

---

## 🟡 ALTA: RebostVault.jsx
**Problema**: `useEffect` con array vacío pero dependencia implícita en `user`.

```jsx
// LÍNEA ~35: DEPENDENCIA FALTANTE
useEffect(() => {
    fetchResources(); // ❌ fetchResources usa 'user' pero no está en deps
}, []); // ❌ Array vacío = solo se ejecuta al montar
```

**Fix**:
```jsx
// OPCIÓN A: Incluir user en dependencies
useEffect(() => {
    fetchResources();
}, [user]); // ✅ Se re-ejecuta si user cambia

// OPCIÓN B (mejor): Usar callback ref para evitar re-fetch innecesario
const fetchResourcesRef = useCallback(async () => {
    if (!user) return;
    // ... lógica de fetch ...
}, [user]);

useEffect(() => {
    fetchResourcesRef();
}, [fetchResourcesRef]); // ✅ Stable reference
```

---

## 🟢 MEDIA: NanoSplashScreen.jsx
**Problema**: `onComplete` en deps del useEffect puede causar re-ejecución si el padre no memoiza la función.

```jsx
useEffect(() => {
    const timer3 = setTimeout(() => onComplete?.(), 3500);
    return () => clearTimeout(timer3);
}, [onComplete]); // ❌ Si onComplete cambia, se resetean timers
```

**Fix**:
```jsx
// USAR useRef para estabilizar onComplete
const onCompleteRef = useRef(onComplete);
useEffect(() => {
    onCompleteRef.current = onComplete;
}, [onComplete]);

useEffect(() => {
    const timer1 = setTimeout(() => setPhase('wordplay'), 800);
    const timer2 = setTimeout(() => setPhase('final'), 2000);
    const timer3 = setTimeout(() => onCompleteRef.current?.(), 3500); // ✅ Stable

    return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
    };
}, []); // ✅ Sin deps = se ejecuta solo una vez
```

---

## 🟢 MEDIA: UniversalCard.jsx
**Problema**: `normalizeClass` definida dentro del componente invalida `propsAreEqual` de React.memo.

```jsx
// LÍNEA ~350: FUNCIÓN INTERNA ROMPE MEMOIZATION
const normalizeClass = (cls) => (cls || '').split(' ').filter(Boolean).sort().join(' ');

const propsAreEqual = (prevProps, nextProps) => {
    // ...
    normalizeClass(prevProps.className) === normalizeClass(nextProps.className) // ❌ Siempre false
};
```

**Fix**:
```jsx
// MOVER FUERA DEL COMPONENTE (nivel módulo)
const normalizeClass = (cls: string | undefined): string => 
    (cls || '').split(' ').filter(Boolean).sort().join(' ');

// Luego dentro del componente:
export default React.memo(UniversalCard, propsAreEqual); // ✅ Ahora funciona
```

---

## ⚠️ ADVERTENCIAS ADICIONALES (Móvil/CRDT)

### 1. Todos los componentes con `<style>` inline
**Riesgo**: Duplicación de estilos en memoria si el componente se monta/desmonta frecuentemente (ej: modales).

**Recomendación**: Mover estilos a archivos `.css` o usar CSS-in-JS con caching (styled-components, emotion).

### 2. OmniscientViewer.jsx: `setTimeout` sin cleanup en fetchContent
```jsx
const timer = setTimeout(() => {
    fetchContent('/TECHNICAL_REPORT_VIVO.md');
}, 0);
return () => clearTimeout(timer); // ✅ Bien, pero verificar en todos los paths
```
**Verificación**: Asegurar que TODOS los setTimeout dentro de useEffect tengan cleanup.

### 3. NotePad.jsx: Escritura a localStorage en cada keystroke
```jsx
useEffect(() => {
    localStorage.setItem('sdp_master_note', note); // ❌ Puede ser excesivo
}, [note]);
```
**Optimización** (debounce para CRDT sync):
```jsx
useEffect(() => {
    const handler = setTimeout(() => {
        localStorage.setItem('sdp_master_note', note);
        // Aquí también disparar sync a CRDT si es necesario
    }, 300); // ✅ 300ms de debounce
    return () => clearTimeout(handler);
}, [note]);
```
