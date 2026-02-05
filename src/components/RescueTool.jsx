import React from 'react';

const RescueTool = () => {
    const [status, setStatus] = React.useState('En espera...');
    const hasAutoRan = React.useRef(false);

    React.useEffect(() => {
        if (!hasAutoRan.current) {
            hasAutoRan.current = true;
            // Silent background cleanup on mount
            const silentClean = async () => {
                if ('serviceWorker' in navigator) {
                    const regs = await navigator.serviceWorker.getRegistrations();
                    for (const reg of regs) await reg.unregister();
                }
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(k => caches.delete(k)));
                }
            };
            silentClean();
        }
    }, []);

    const performRescue = async () => {
        setStatus('Iniciant protocol de neteja...');
        try {
            // 1. Clear Storage
            localStorage.clear();
            sessionStorage.clear();

            // 2. Clear Caches
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
            }

            // 3. Kill Service Workers
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (const reg of regs) {
                    await reg.unregister();
                }
            }

            setStatus('TOT NET. REINICIANT...');
            setTimeout(() => {
                window.location.href = '/login?fresh=true';
            }, 1500);
        } catch (e) {
            setStatus('ERROR: ' + e.message);
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui', textAlign: 'center'
        }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛠️</div>
            <h1 style={{ color: '#00f2ff' }}>EINA DE RESCAT (React Mode)</h1>
            <p style={{ maxWidth: '400px', marginBottom: '30px', color: '#aaa' }}>
                Si veus això, el Service Worker t'ha redirigit incorrectament.
                No passa res. Prem el botó per arreglar-ho des d'aquí.
            </p>
            <button
                onClick={performRescue}
                style={{
                    background: '#ff0055', color: 'white', border: 'none', padding: '15px 30px',
                    borderRadius: '0px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)'
                }}
            >
                ⚡ EXECUTAR NETEJA NUCLEAR
            </button>
            <div style={{ marginTop: '20px', fontFamily: 'monospace', color: '#00ff9d' }}>{status}</div>
        </div>
    );
};

export { RescueTool };
export default RescueTool;
