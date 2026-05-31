import React, { createContext, useContext } from 'react';

// 1. Context per definir l'entorn del sistema
const SystemEnvironmentContext = createContext({
    env: 'root' // 'root' | 'embedded'
});

export const useSystemEnvironment = () => useContext(SystemEnvironmentContext);

// 2. Contenidor Arrel (Per a pàgines principals com Mur, Mercat, etc.)
// Aquest contenidor s'assegura que la pàgina ocupe el 100% de la pantalla
// i tinga el seu propi scroll independent, prevenint que s'apegue a dalt
// o perda els marges.
export const RootPageContainer = React.forwardRef(({ children, className = '' }, ref) => {
    return (
        <SystemEnvironmentContext.Provider value={{ env: 'root' }}>
            {/* L'ús de 100dvh assegura que als mòbils no es menge la barra de navegació inferior,
                i flex-1 min-h-0 permet que els fills puguen fer scroll internament si cal. */}
            <div ref={ref} className={`root-page-container flex flex-col w-full h-[100dvh] isolate relative overflow-hidden bg-[var(--bg-app)] ${className}`}>
                {children}
            </div>
        </SystemEnvironmentContext.Provider>
    );
});
RootPageContainer.displayName = 'RootPageContainer';

// 3. Contenidor Incrustat (Per a pestanyes, modals, etc.)
// Aquest contenidor NO força alçades fixes ni scrolls, delegant en el pare
// la gestió de l'espai. Al mateix temps, avisa als seus components fills
// (com l'UniversalGrid) que estan en un espai reduït.
export const EmbeddedContainer = ({ children, className = '' }) => {
    return (
        <SystemEnvironmentContext.Provider value={{ env: 'embedded' }}>
            <div className={`embedded-container w-full h-full relative ${className}`}>
                {children}
            </div>
        </SystemEnvironmentContext.Provider>
    );
};
