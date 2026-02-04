import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Search, Archive, AlertCircle, Share2, Grid, List, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    const { user, isPlayground } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isImporting, setIsImporting] = useState(false);
    const [importStats, setImportStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchResources();
    }, [user]);

    const fetchResources = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Priority 1: Supabase
            const { data, error } = await supabaseService.supabase
                .from('resources')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error && error.code !== '42P01') throw error; // 42P01 = table not found

            let finalResources = data || [];

            // Priority 2: Injected Mocks (Raindrop/Notion)
            if (finalResources.length === 0) {
                const { raindropService } = await import('../services/raindropService');
                const raindropMocks = await raindropService.getCollection();
                const notionMocks = notionService.getMockVolume(5);
                finalResources = [...raindropMocks, ...notionMocks];
            }

            setResources(finalResources);
        } catch (err) {
            logger.warn('[Rebost] Error obtenint recursos, usant mocks:', err);
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
                // WordPress or Blogger
                try {
                    if (text.includes('xmlns:wp="http://wordpress.org/export/')) {
                        items = historicalRecoveryService.parseWordPressXML(text);
                    } else if (text.includes('type="text/html"') && text.includes('<entry>')) {
                        items = historicalRecoveryService.parseBloggerXML(text);
                    } else {
                        throw new Error('Fitxer XML no reconegut com a WordPress o Blogger.');
                    }
                } catch (xmlErr) {
                    alert('Error parsejant el fitxer XML: ' + xmlErr.message);
                    setIsImporting(false);
                    return;
                }
            } else {
                alert('Format no suportat. Usa HTML (Raindrop), JSON (Notion) o XML (WordPress/Blogger).');
                setIsImporting(false);
                return;
            }

            if (items.length === 0) {
                alert('No s\'han trobat dades vàlides al fitxer.');
                setIsImporting(false);
                return;
            }

            const result = await migrationService.importToRebost(items, user.id);

            // Simulem el "refinament" de MArIA per a donar sensació premium
            setIsImporting(true); // Ens mantenim en càrrega un moment més
            setTimeout(() => {
                setImportStats(result);
                setIsImporting(false);
                fetchResources();
            }, 1500);

        } catch (err) {
            logger.error('[Rebost] Error en la importació:', err);
            alert('Error important: ' + err.message);
            setIsImporting(false);
        }
    };

    const handleExport = async () => {
        if (resources.length === 0) {
            alert('No hi ha res a exportar encara, el rebost és buit.');
            return;
        }
        await migrationService.exportRebostData(resources);
    };

    const handleShare = async (resource) => {
        const confirmShare = window.confirm(`Vols "trastombar" aquest recurs (${resource.title}) al poble? Serà visible per a altres veïns.`);
        if (!confirmShare) return;

        try {
            const { error } = await supabaseService.supabase
                .from('resources')
                .update({ is_public: true, scope: 'public' })
                .eq('id', resource.id);

            if (error) throw error;
            fetchResources();
            alert('¡Recurs publicat al poble amb èxit! 🌍');
        } catch (err) {
            logger.error('[Rebost] Error compartint:', err);
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.semantic_tags && r.semantic_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    if (loading && resources.length === 0) return <StatusLoader message="Obrint el Rebost..." />;

    return (
        <div className="rebost-vault animate-in">
            <header className="rebost-header">
                <div className="rebost-title-section">
                    <button className="rebost-back-btn" onClick={onClose} aria-label="Tornar">
                        <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                    <Archive size={24} className="text-terracotta" />
                    <div>
                        <h2>El Rebost Sobirà</h2>
                        <p>El teu magatzem privat de coneixement</p>
                    </div>
                </div>

                <div className="rebost-actions">
                    <div className="iron-integrity-badge" title="Arquitectura de Ferro: Referències Inmutables Actives">
                        <ShieldCheck size={14} />
                        <span>Veritat de Ferro</span>
                    </div>
                    <button className="btn-export-sovereign" onClick={handleExport} title="Exporta tota la teua memòria">
                        <Share2 size={18} />
                        <span>Exportació Total</span>
                    </button>
                    <button className="btn-import" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={18} />
                        <span>Importar (Raindrop/Notion/Blogs)</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".html,.json,.xml"
                        onChange={handleFileSelect}
                    />
                </div>
            </header>

            {importStats && (
                <div className="import-success-banner">
                    <CheckCircle2 size={18} />
                    <span>¡Importació bategada! S'han afegit {importStats.successful} recursos al teu rebost.</span>
                    <button onClick={() => setImportStats(null)}>×</button>
                </div>
            )}

            <div className="rebost-tools">
                <div className="rebost-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Cerca al teu rebost..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="rebost-stats-chip">
                    <strong>{resources.length}</strong> recursos guardats
                </div>
            </div>

            {isImporting ? (
                <div className="rebost-loading-state">
                    <StatusLoader type="loading" message="Processant arxiu i enriquir dades amb MArIA..." />
                </div>
            ) : filteredResources.length > 0 ? (
                <div className="resource-grid-masonry">
                    {filteredResources.map(resource => (
                        <ResourceCard
                            key={resource.id || resource.uuid}
                            resource={resource}
                            onShare={handleShare}
                        />
                    ))}
                </div>
            ) : (
                <div className="rebost-empty-state">
                    <AlertCircle size={48} opacity={0.3} />
                    <h3>El rebost està buit</h3>
                    <p>Importa el teu Raindrop o afig recursos manualment.</p>
                </div>
            )}
        </div>
    );
};

export default RebostVault;
