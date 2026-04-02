import React from 'react';

/**
 * Plantilla Base del Sistema (V13.0)
 * Unifica la jerarquía de DOM para que las páginas de la aplicación
 * se comporten de forma idéntica, eliminando divs "fantasma" y 
 * asegurando un scroll nativo predecible sin bloqueos de layout.
 */
const SYSTEM_CHROME_HEIGHT = '64px'; // 64px context header

const SystemPageLayout = ({ 
  header, 
  children, 
  footer, 
  actionBar, 
  className = '', 
  mainClassName = '',
  containerClassName = "w-full max-w-[1600px] mx-auto p-4 md:p-8"
}) => {
  return (
    <div 
      className={`flex flex-col w-full bg-theme-bg isolate ${className}`}
      style={{ '--system-chrome-h': SYSTEM_CHROME_HEIGHT }}
    >
      {header && (
        <header className="flex-none w-full sticky top-0 z-50 shadow-md bg-theme-base border-b border-border-master flex flex-col relative isolate">
          {header}
        </header>
      )}

      {/* MAIN CONTENT: Deixa que el scroll el gestione l'AppLayout pare */}
      <main 
          className={`flex-1 w-full relative min-w-0 pt-2 pb-6 ${mainClassName}`}
      >
         {containerClassName ? (
             <div className={containerClassName}>
                {children}
             </div>
         ) : children}
      </main>

      {/* ACTION BAR INFERIOR: En bloc al final, es mou amb l'scroll normalment pacificant problemes de PWA */}
      {actionBar && (
        <div 
          className="w-full sticky bottom-0 mt-auto z-40 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] bg-theme-base border-t border-[rgba(255,255,255,0.05)] isolate"
        >
            {actionBar}
        </div>
      )}

      {footer && (
        <footer className="flex-none w-full shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] z-[55] bg-theme-bg/95 backdrop-blur-xl">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default SystemPageLayout;
