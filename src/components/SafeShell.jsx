import React from 'react';
import './SafeShell.css';

/**
 * [MASTER] SafeShell - Protecció de Safe Areas per a iOS/Android
 * Garanteix que la "Boina Taronja" s'estenga darrere del notch sense tallar contingut.
 */
const SafeShell = ({ children }) => {
    return (
        <div className="safe-shell-container">
            <div className="safe-area-background-top" />
            <main className="safe-shell-main" style={{
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}>
                {children}
            </main>
            <div className="safe-area-background-bottom" />
        </div>
    );
};

export default SafeShell;
