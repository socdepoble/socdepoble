import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Search, Archive, AlertCircle, Share2, Grid, List, CheckCircle2, ShieldCheck } from 'lucide-react';
import { migrationService } from '../services/MigrationService';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import ResourceCard from './ResourceCard';
import StatusLoader from './StatusLoader';
import { logger } from '../utils/logger';
import './RebostVault.css';

/**
 * RebostVault [PRIVATE VAULT]
 * Magatzem sobirà per a recursos personals i importacions de Raindrop.
 */
const RebostVault = () => {
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
            // A producció usaríem una crida a la taula resources
            // En playground o si la taula no existeix, simulem/fallback
            const { data, error } = await supabaseService.supabase
                .from('resources')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResources(data || []);
        } catch (err) {
            logger.warn('[Rebost] Error obtenint recursos, usant mocks:', err);
            // Fallback mock dades per a la demo si cal
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
            } else {
                alert('Format no suportat. Usa l\'exportació HTML de Raindrop.');
                setIsImporting(false);
                return;
            }

            if (items.length === 0) {
                alert('No s\'han trobat enllaços al fitxer.');
                setIsImporting(false);
                return;
            }

            const result = await migrationService.importToRebost(items, user.id);
            setImportStats(result);
            fetchResources();
        } catch (err) {
            logger.error('[Rebost] Error en la importació:', err);
            alert('Error important: ' + err.message);
        } finally {
            setIsImporting(false);
        }
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
        r.semantic_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading && resources.length === 0) return <StatusLoader message="Obrint el Rebost..." />;

    return (
        <div className="rebost-vault animate-in">
            <header className="rebost-header">
                <div className="rebost-title-section">
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
                    <button className="btn-import" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={18} />
                        <span>Importar Raindrop</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".html"
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
                            key={resource.id}
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
