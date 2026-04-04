# 🚨 SUPER PROMPT: AUDITORÍA DESTRUCTIVA DE UI Y STACKING CONTEXT 🚨

**A LA ATENCIÓN DE:** Mistral Large, OpenAI Codex, GPT-4o, Anthropic Claude 3.
**ASUNTO:** Solapamiento Crítico de `SystemActionBar` y `FullCalendar` en Sóc de Poble.

## CONTEXTO DE LA MISIÓN
Estamos integrando una barra unificada "Nivel Dios" (`SystemActionBar`) en el layout global `SystemPageLayout` para que todas las páginas tengan controles estáticos. Al aplicarla a la página de calendario (`MasterCalendar.jsx`), **la UI colapsa**.
El header global (buscador `ContextualHeader` + `SystemActionBar`) se amontona o solapa con los controles de navegación del calendario (`headerToolbar` de FullCalendar).
El usuario experimenta un "choque de trenes visual", con botones estrujados y paddings inconsistentes.

## TU OBJETIVO
Realizar una auditoría destructiva y radical sobre el código adjunto. Analiza el comportamiento de Flexbox, los contextos de apilamiento (z-index), los atributos `contain`, `sticky`, y `min-h-[100dvh]`.
Propón **únicamente** la corrección de código responsable de este solapamiento.

---

## 🛠️ CÓDIGO INYECTADO (SNAPSHOT)

### 1. SystemPageLayout.jsx
(Plantilla base que envuelve todo. Ojo al header `sticky top-0`)
```jsx
const SystemPageLayout = ({ header, children }) => {
  return (
    <div className="flex flex-col w-full h-full min-h-[100dvh] bg-theme-bg overflow-hidden isolate">
      {header && (
        <header className="flex-none w-full sticky top-0 z-[2000] shadow-md bg-theme-base border-b border-border-master flex flex-col">
          {header}
          <SystemActionBar />
        </header>
      )}
      <main className="flex-1 w-full min-h-0 overflow-y-auto custom-scrollbar relative">
         {children}
      </main>
    </div>
  );
};
```

### 2. ContextualHeader.jsx
(La barra de búsqueda principal que se inyecta en la prop `header`)
```jsx
// Bug Conocido Eliminado por Antigravity: Tenía sticky top-0 interno que colisionaba con el padre. Se ha ajustado a 'relative z-10'.
<div className="relative z-10 bg-[#F97316] dark:bg-[#4F46E5] w-full h-[64px] min-h-[64px] max-h-[64px] flex items-center justify-between px-3 shadow-md">
...
```

### 3. MasterCalendar.jsx y su .fc-header-toolbar
```jsx
<SystemPageLayout header={<ContextualHeader />}>
    <div className="flex-1 min-h-[600px] relative w-full mb-8">
        <FullCalendar
            headerToolbar={{ left: 'prev,next today Settings create', right: 'dayGridMonth,timeGridWeek...' }}
            height="auto"
            contentHeight="auto"
        />
    </div>
</SystemPageLayout>
```

## INSTRUCCIONES PARA LA IA
1. Analiza por qué la inserción de `<SystemActionBar />` debajo de `{header}` en un Flex Column obliga al `FullCalendar` a colisionar con su barra de herramientas.
2. ¿Qué margen de CSS o padding necesita `.fc-header-toolbar` para ser visible correctamente en este Layout M3?
3. Da el Snippet directo de solución en CSS / Tailwind.

¡Adelante!
