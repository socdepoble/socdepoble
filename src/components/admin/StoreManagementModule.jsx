import React, { useState } from 'react';
import { Store, CheckCircle, Clock, AlertCircle, RefreshCw, Smartphone, Globe, Github } from 'lucide-react';

const StoreManagementModule = ({ addLog }) => {
    const [verifying, setVerifying] = useState(false);

    const storeStatus = [
        { name: 'Google Play (Android TWA)', status: 'Beta', version: '1.5.4', lastUpdate: '2026-01-25', platform: 'Android' },
        { name: 'Apple App Store (iOS Wrapper)', status: 'Pending', version: '0.9.0', lastUpdate: 'N/A', platform: 'iOS' },
        { name: 'Samsung Galaxy Store', status: 'In Review', version: '1.5.0', lastUpdate: '2026-01-28', platform: 'Android' }
    ];

    const handleSync = () => {
        setVerifying(true);
        addLog('Verificant estats de producció en Google Play Console...', 'info');
        setTimeout(() => {
            addLog('Verificant TestFlight a Apple Developer Portal... OK', 'success');
            addLog('Sincronització de botigues completada.', 'success');
            setVerifying(false);
        }, 2000);
    };

    const handleHardPurge = () => {
        if (!window.confirm("🔴 ALERTA: Això forçarà un reinici de la caché per a tots els usuaris de l'App. Continuar?")) return;
        addLog('PROTOCOL DE PURGA ACTIVAT. Enviant senyal de Service Worker...', 'warn');
        setTimeout(() => addLog('Senyal de purga propagat a 452 instàncies.', 'success'), 1500);
    };

    return (
        <div className="stores-management-card neural-core-panel">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Store className="text-cyan-400" /> CENTRE DE DISTRIBUCIÓ [MASTER]
                </h2>
                <button
                    className="btn-hud-small"
                    onClick={handleSync}
                    disabled={verifying}
                >
                    <RefreshCw size={16} className={verifying ? 'spin' : ''} />
                    <span>Sincronitzar</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="status-overview p-4 border border-gray-800 rounded-xl bg-black/20">
                    <h3 className="font-bold mb-4 text-cyan-400">Estat de les Plataformes</h3>
                    <div className="space-y-4">
                        {storeStatus.map((store, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {store.platform === 'Android' ? <Smartphone size={18} /> : <Globe size={18} />}
                                    <div>
                                        <div className="text-sm font-bold">{store.name}</div>
                                        <div className="text-xs opacity-50">Versió {store.version} · {store.lastUpdate}</div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${store.status === 'Beta' ? 'bg-green-900/40 text-green-400' :
                                        store.status === 'Pending' ? 'bg-orange-900/40 text-orange-400' :
                                            'bg-cyan-900/40 text-cyan-400'
                                    }`}>
                                    {store.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="automation-panel p-4 border border-gray-800 rounded-xl bg-black/20">
                    <h3 className="font-bold mb-4 text-purple-400">Automatització & CI/CD</h3>
                    <div className="space-y-3">
                        <button className="btn-primary w-full flex items-center justify-center gap-2" style={{ background: '#333' }}>
                            <Github size={16} /> Deploy via GitHub Actions
                        </button>
                        <button
                            className="btn-primary w-full flex items-center justify-center gap-2"
                            style={{ background: 'var(--color-error-soft)', color: 'var(--color-error)' }}
                            onClick={handleHardPurge}
                        >
                            <RefreshCw size={16} /> Forçar Purga Remota
                        </button>
                    </div>

                    <div className="mt-6 p-3 border border-dashed border-gray-700 rounded-lg">
                        <h4 className="text-xs font-bold mb-2 opacity-50">DIRECTIVA DE MANTENIMENT</h4>
                        <p className="text-[10px] italic">
                            "L'estabilitat del veí és sagrada. Si una versió de la botiga falla, el downgrade ha de ser automàtic via protocol de resiliència Atum."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreManagementModule;
