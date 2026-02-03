import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { wikipediaService } from '../services/wikipediaService';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import TownGallery from '../components/TownGallery';
import WikiPulseSheet from '../components/WikiPulseSheet';
import { ArrowLeft, Landmark, Info, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { logger } from '../utils/logger';
import './Towns.css';

const AyuntamientoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [town, setTown] = useState(null);
    const [shieldUrl, setShieldUrl] = useState(null);
    const [wikiData, setWikiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const allTowns = await supabaseService.getTowns();
                const isUuid = id.includes('-');
                const found = allTowns.find(t => isUuid ? t.uuid === id : t.id === parseInt(id));
                setTown(found);

                if (found) {
                    // [SAVIESA UNIVERSAL] Carreguem escut i dades de Wikipedia
                    const [shield, wiki] = await Promise.all([
                        wikipediaService.getTownShield(found.name),
                        wikipediaService.getTownSummary(found.name)
                    ]);
                    setShieldUrl(shield);
                    setWikiData(wiki);
                }
            } catch (error) {
                logger.error('[AyuntamientoPage] Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6">
            <div className="animate-pulse flex flex-col items-center">
                <Landmark size={48} className="text-primary mb-4" />
                <p className="font-bold tracking-widest">OBRINT LA SEU ELECTRÒNICA...</p>
            </div>
        </div>
    );

    if (!town) return <div className="p-20 text-center">Ajuntament no trobat</div>;

    return (
        <div className="ayuntamiento-page animate-in">
            <ProfileHeaderPremium
                type="official"
                title={`Ajuntament de ${town.name}`}
                subtitle="Seu Electrònica i Institucional"
                avatarUrl={shieldUrl || town.logo_url}
                coverUrl={town.image_url}
                badges={['Oficial', 'Verificat']}
                onBack={() => navigate(-1)}
            />

            <main className="ayunt-content p-4 space-y-6">
                {/* AVIS DE DUALITAT */}
                <div className="dual-portal-notice institution-glass border border-blue-500/30 p-4 rounded-2xl flex items-start gap-4">
                    <div className="icon-wrapper text-blue-400">
                        <Landmark size={32} />
                    </div>
                    <div className="text-sm">
                        <h4 className="font-black text-blue-400 mb-1 uppercase tracking-tighter">Espai Institucional</h4>
                        <p className="opacity-80">Estàs a la pàgina oficial de l'Ajuntament. Per a veure les publicacions dels veïns, el mercat i el batec del carrer, visita el Mur del Poble.</p>
                        <Link
                            to={`/pobles/${id}`}
                            className="inline-flex items-center gap-2 mt-3 p-2 px-4 bg-primary text-black font-black rounded-lg text-xs"
                        >
                            <MessageCircle size={14} /> ANAR AL MUR DEL POBLE
                        </Link>
                    </div>
                </div>

                {/* MEMORIA WIKIMEDIA */}
                <section className="institutional-wiki-section">
                    <div className="section-header-compact flex items-center gap-2 mb-4 opacity-50">
                        <ShieldCheck size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Identitat Municipal (Wikipedia)</h3>
                    </div>

                    <div className="wiki-card-institutional glass-clean p-6 border-l-4 border-blue-500 rounded-r-2xl bg-white/5">
                        {shieldUrl && (
                            <div className="shield-display w-24 h-24 mx-auto mb-6">
                                <img src={shieldUrl} alt={`Escut de ${town.name}`} className="w-full h-full object-contain" />
                                <p className="text-[10px] text-center mt-2 opacity-50 italic">Escut via Wikimedia Commons</p>
                            </div>
                        )}
                        <p className="text-sm leading-relaxed opacity-90 italic">
                            {wikiData?.extract || `L'ajuntament de ${town.name} és l'òrgan de govern i administració d'aquest municipi de la Comunitat Valenciana.`}
                        </p>
                        {wikiData?.page_url && (
                            <a
                                href={wikiData.page_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-blue-400 font-bold mt-4"
                            >
                                <ExternalLink size={14} /> CONSULTAR ARXIU HISTÒRIC
                            </a>
                        )}
                    </div>
                </section>

                {/* BANDO MUNICIPAL SIMULAT */}
                <section className="bando-actualitat">
                    <div className="section-header-compact flex items-center gap-2 mb-4 opacity-50">
                        <Info size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Últims Bandos i Avisos</h3>
                    </div>

                    <div className="bando-item p-4 bg-white/5 border border-white/10 rounded-2xl mb-4">
                        <span className="text-[10px] font-bold text-blue-400 block mb-1">AVUI • 09:30</span>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Tràmits de la Seu Electrònica</h4>
                        <p className="text-xs opacity-70">Recordem que la majoria de tràmits es poden realitzar de forma telemàtica mitjançant certificat digital.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AyuntamientoPage;
