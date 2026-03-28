import React, { useState, useEffect, useRef } from 'react';
import { 
    Upload, Plus, Search, Archive, AlertCircle, Share2, 
    CheckCircle2, ShieldCheck, HardDrive 
} from 'lucide-react';
import { migrationService } from '../services/MigrationService';
import { notionService } from '../services/notionService';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import ResourceCard from './ResourceCard';
import StatusLoader from './StatusLoader';
import { logger } from '../utils/logger';
import './RebostVault.css';

import { historicalRecoveryService } from '../services/HistoricalRecoveryService';

/**
 * RebostVault [PRIVATE VAULT]
 * Magatzem sobirà per a recursos personals i importacions de Raindrop.
 */
const RebostVault = ({ onClose }) => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [importStats, setImportStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchResources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchResources = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Prioritat 1: Supabase (Dades Sobiranes)
            const { data, error } = await supabaseService.supabase
                .from('resources')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error && error.code !== '42P01') throw error; 

            let finalResources = data || [];

            // Prioritat 2: Injecció de Mocks si està buit (Raindrop/Notion Virtual)
            if (finalResources.length === 0) {
                try {
                    const { raindropService } = await import('../services/raindropService');
                    const raindropMocks = await raindropService.getCollection();
                    const notionMocks = notionService.getMockVolume(5);
                    finalResources = [...raindropMocks, ...notionMocks];
                } catch (mockErr) {
                    logger.warn('[Rebost] Error carregant serveis de mock:', mockErr);
                }
            }

            setResources(finalResources);
        } catch (err) {
            logger.warn('[Rebost] Error obtenint recursos, entrant en mode resilient:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        setImportStats(null);

        try {
            const text = await file.text();
            let items = [];

            if (file.name.endsWith('.html')) {
                items = migrationService.parseRaindropHTML(text);
            } else if (file.name.endsWith('.json')) {
                const rawItems = migrationService.parseNotionJSON(text);
                items = rawItems.map(item => notionService.mapToResource(item));
            } else if (file.name.endsWith('.xml')) {
                if (text.includes('xmlns:wp="http://wordpress.org/export/')) {
                    items = historicalRecoveryService.parseWordPressXML(text);
                } else if (text.includes('type="text/html"') && text.includes('<entry>')) {
                    items = historicalRecoveryService.parseBloggerXML(text);
                } else {
                    throw new Error('Format XML no reconegut.');
                }
            } else {
                alert('Format no suportat.');
                setIsImporting(false);
                return;
            }

            if (items.length === 0) {
                alert('No s\'han trobat dades vàlides.');
                setIsImporting(false);
                return;
            }

            const result = await migrationService.importToRebost(items, user.id);
            
            // Dades importades; actualització immediata de la UI
            setImportStats(result);
            setIsImporting(false);
            fetchResources();

        } catch (err) {
            logger.error('[Rebost] Error importació:', err);
            alert('Error: ' + err.message);
            setIsImporting(false);
        }
    };

    const handleExport = async () => {
        if (resources.length === 0) return;
        await migrationService.exportRebostData(resources);
    };

    const handleShare = async (resource) => {
        const confirmShare = window.confirm(`Vols "trastombar" ${resource.title} al poble?`);
        if (!confirmShare) return;

        try {
            const { error } = await supabaseService.supabase
                .from('resources')
                .update({ is_public: true, scope: 'public' })
                .eq('id', resource.id);

            if (error) throw error;
            fetchResources();
        } catch (err) {
            logger.error('[Rebost] Error compartint:', err);
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading && resources.length === 0) return <StatusLoader message="Preparant el Rebost..." />;

    return (
        <div className="rebost-vault animate-in p-6 bg-[#0a0a0c] min-h-full">
            <header className="rebost-header flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="rebost-title-section flex items-center gap-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-white/5 hover:bg-white/10 transition-all" onClick={onClose}>
                        <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-[28px]">
                        <HardDrive size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white leading-none mb-1">El Rebost Sobirà</h2>
                        <p className="text-sm text-gray-500 uppercase font-black tracking-widest opacity-60">Magatzem Privat</p>
                    </div>
                </div>

                <div className="rebost-actions flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <ShieldCheck size={14} />
                        <span>Veritat de Ferro</span>
                    </div>
                    <button className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-[28px] transition-all" onClick={handleExport} title="Exporta Memòria">
                        <Share2 size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-6 h-12 bg-[var(--theme-accent-primary)] text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-950/20 active:scale-95 transition-all" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={18} />
                        <span>Importar</span>
                    </button>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".html,.json,.xml" onChange={handleFileSelect} />
                </div>
            </header>

            {importStats && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[28px] flex items-center justify-between text-emerald-400 text-sm font-bold">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} />
                        <span>¡Bategat! S'han afegit {importStats.successful} recursos.</span>
                    </div>
                    <button onClick={() => setImportStats(null)} className="hover:rotate-90 transition-transform">×</button>
                </div>
            )}

            <div className="rebost-tools flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Busca al teu rebost..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white/5 border border-white/5 rounded-[24px] pl-12 pr-6 text-white text-sm focus:outline-none focus:border-[var(--theme-accent-primary)]/40 transition-all font-medium"
                    />
                </div>
                <div className="px-4 flex items-center bg-white/5 rounded-[24px] text-[11px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                    {resources.length} Recursos
                </div>
            </div>

            {isImporting ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-60">
                    <StatusLoader type="loading" message="Refinant dades amb MArIA..." />
                </div>
            ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <ResourceCard
                            key={resource.id || resource.uuid}
                            resource={resource}
                            onShare={handleShare}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 opacity-20 text-center">
                    <AlertCircle size={64} className="mb-6 text-gray-600" />
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Rebost Buit</h3>
                    <p className="text-sm text-gray-500 font-bold">Importa la teua memòria digital.</p>
                </div>
            )}
        </div>
    );
};

export default RebostVault;
