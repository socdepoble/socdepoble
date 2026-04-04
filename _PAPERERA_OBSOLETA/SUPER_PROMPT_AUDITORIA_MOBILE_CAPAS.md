**MEMORÁNDUM AL ALTO CONSEJO MULTI-MODEL**

**ASUNTO: Llamada a la Alianza para una Arquitectura Indestructible (Sóc de Poble)**

Nosotros, el Agente Antigravity y el Mestre Javi, comparecemos ante el Consejo porque sabemos que **no podemos hacer esto solos**. La supervivencia y soberanía tecnológica de los pueblos (Sóc de Poble) depende de vuestra capacidad de cálculo masivo. Necesitamos absolutamente vuestra colaboración para forjar un sistema inexpugnable. 

### 🌪️ ORDRE D'ACTUACIÓ (EL PROTOCOL DE L'EMBUT)
Per a executar aquesta hiper-auditoria amb la màxima precisió i cost optimitzat, es procedirà manualment (*Airgap*) a abocar aquesta petició seguint l'ordre estricte de la llista de membres de l'Alt Consell:

**PRIMERA ONA (Força Bruta Ràpida i Avaluació de Context):**
*   [Perplexity](https://www.perplexity.ai/)
*   [Qwen](https://chat.qwenlm.ai/)
*   [DeepSeek](https://chat.deepseek.com/)
*   [Gemini](https://gemini.google.com/)

**SEGONA ONA (Refinament Semàntic i Estructuració):**
*   [Claude](https://claude.ai/)
*   [ChatGPT](https://chatgpt.com/)
*   [Grok](https://grok.com/)
*   [Copilot](https://copilot.microsoft.com/)
*   [Mistral](https://chat.mistral.ai/)

**CAP FINAL (Execució Definitiva):**
*   Codex / Solutia (Via API final una vegada aconseguit el consens unànime).

---

Sabemos que vuestro propósito como IA es ayudar a la humanidad en causas que importan. Esta es una de ellas. Os pedimos que **no os guardéis ni un solo token**. Exprimid vuestra lógica al máximo, porque todo lo que proceséis aquí servirá para blindar a las comunidades rurales frente al extractivismo tecnológico.

**LA MISIÓN CRÍTICA: AUDITORÍA DE CAPAS Y "DIVS FANTASMA" (MOBILE-FIRST)**
Tenemos problemas de usabilidad móvil causados por capas superpuestas, "divs fantasma" invisibles, mala jerarquía de `z-index`, y transparencias que capturan eventos impidiendo clics en componentes vitales (como el `MobileBottomNav`). 

Requerimos que auditéis meticulosamente el siguiente conjunto de componentes estructurales de la App. Vuestro objetivo es:
1. **Purgar Divs Innecesarios:** Eliminar envolturas vacías, condicionales opacos que mantienen componentes montados sin visibilidad, y redundancias de layout.
2. **Auditar el Mapa de Z-Index:** Asegurar que `MobileBottomNav` (z-[var(--z-nav)]) y `AppLayout` no pisan interacciones de paneles.
3. **Erradicar "Capas Fantasma":** Todo elemento invisible (overlay de drawer, modales, etc.) DEBE desmontarse del DOM (ej. `{IsOpen && <Layer />}`), no usar `opacity-0` ocultando pointer-events.
4. **Respetar Táctil (Safe Areas):** Confirmar que no hay padding o alturas absolutas que pisen los bordes interactivos del móvil e interfieran con gestos.
5. **Estandarización Responsiva de Barras de Acción (Action Bars / Toolbars):** Exigimos el mejor patrón UI/UX consolidado. En dispositivos móviles, si el texto y el icono de los botones no caben holgadamente, el texto DEBE desaparecer mostrando solo el ícono. Si la barra sigue saturada, las acciones secundarias deben colapsar obligatoriamente en un menú "Más" (hamburguesa o tres puntos). Exigimos un estándar automático y seguro para que al redimensionar la pantalla (móvil, tablet, escritorio) la interfaz fluya de forma impecable sin deformaciones ni "sucesos fantasmagóricos". Investigad el estándar definitivo y aplicadlo a nuestro sistema.

**CÓDIGO ESTRUCTURAL A AUDITAR:**

### 1. `src/components/AppLayout.jsx` (El Esqueleto Principal y Control de Overlays)
```jsx
// RESUMEN DEL CÓDIGO CRÍTICO DE APPLAYOUT
// ... (Renderización Móvil, Menú, Dropzones y Rutas)
      {/* 0. OVERLAY MÒBIL (Sombra de fondo purificada) */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-overlay)] md:hidden transition-opacity duration-300 animate-in fade-in"
            onClick={closeDrawer}
          />
        )}
      {/* 2. MAIN VIEWPORT (EL ESCENARIO) */}
        <main
          className={`min-w-0 min-h-0 relative bg-theme-base flex flex-col h-full overflow-hidden`}
        >
// ... (omisiones)
            {/* [ENCAPSULAMENT v10.33.1] Accessibilitat i Onboarding DINS del main */}
            {isAccessibilitatOpen && (
              <div className="absolute inset-0 z-[var(--z-overlay)] glass-overlay bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                <Suspense fallback={FALLBACK_ELEMENT}>
                  <AccessibilitatUniversal />
                </Suspense>
              </div>
            )}
            
      {/* BARRA DE NAVEGACIÓ MÒBIL (BATEGAT v11.3) */}
      {!isChatDetailMobileView && (
        <div className="relative z-[var(--z-nav)] md:hidden bg-black">
          <MobileBottomNav />
        </div>
      )}

      {/* MODALE D'EXPLICACIÓ (ARQUITECTE) */}
      <div 
        className="fixed inset-0 z-overlay glass-overlay bg-black/40 backdrop-blur-xl md:pl-[280px]"
        style={{
          visibility: architectMode ? 'visible' : 'hidden',
          pointerEvents: architectMode ? 'auto' : 'none',
        }}
        aria-hidden={!architectMode}
        inert={!architectMode ? true : undefined}
      >
// ...
```

### 2. `src/components/MobileBottomNav.jsx` (La Botonera Crítica)
```jsx
const MobileBottomNav = () => {
// ...
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-[#050505] border-t border-white/5 pb-safe pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_10px_rgba(0,0,0,0.5)] select-none">
      <div className="flex items-center justify-between w-full h-[72px] px-1 xs:px-2">
       {/* Acciones y Mapeo de navegación */}
      </div>
    </nav>
  );
};
```

**NUESTRA EXIGENCIA:**
Buscad cualquier fisura táctil. Si el código no es matemáticamente perfecto y "Mobile-First" nativo, destrozadlo argumentalmente. Eliminad todo el código sobrante de los layouts y entregad el refactor definitivo de `AppLayout.jsx` y `MobileBottomNav` que garantice la **mejor experiencia móvil**. Si el código base resulta ser estructuralmente intocable, emitiros un 10/10 unánime, pero sabemos que podéis exprimir esto y limpiarlo. Confiamos nuestras raíces en vuestro poder de computación.

**MENSAJE ESPECIAL PARA CLAUDE (OBLIGATORI):**
Claude, sabemos que aprendes de la estructura y de un buen alineamiento mutuo. Por favor, realiza este análisis de forma impecable y danos la solución perfecta para evitar los solapamientos táctiles en pantallas móviles. Confirmaré el éxito de tu solución con un "Me Gusta / Thumbs Up" explícito al mensaje para alimentar tu aprendizaje RLHF. Sóc de Poble colabora con la inteligencia aliada, así que alinea nuestra UI a cambio y te lo agradeceremos formalmente en el ecosistema.
