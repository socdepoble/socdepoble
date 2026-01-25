import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Users, Shield, ArrowLeft, Loader2, UserCheck, Store, Plus, Layout, Settings, Bell } from 'lucide-react';
import { logger } from '../utils/logger';
import { pushService } from '../services/pushService';
import { pushNotifications } from '../services/pushNotifications';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { isSuperAdmin, isAdmin, setImpersonatedProfile, setActiveEntityId } = useAuth();
    const [personas, setPersonas] = useState([]);
    const [entities, setEntities] = useState([]);
    const [lexicon, setLexicon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || 'gent';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [pData, eData, lData, sData] = await Promise.all([
                    supabaseService.getAllPersonas(),
                    supabaseService.getAdminEntities(),
                    supabaseService.getLexiconTerms(),
                    supabaseService.getAdminStats()
                ]);
                setPersonas(pData || []);
                setEntities(eData || []);
                setLexicon(lData || []);
                setStats(sData);
            } catch (error) {
                logger.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isSuperAdmin, navigate]);

    const handleImpersonate = (item, type = 'user') => {
        if (type === 'user') {
            setImpersonatedProfile(item);
            setActiveEntityId(null);
            alert(`Ara estàs actuant com a: ${item.full_name}`);
        } else {
            setImpersonatedProfile(null);
            setActiveEntityId(item.id);
            alert(`Ara estàs gestionant l'entitat: ${item.name}`);
        }
        navigate('/');
    };

    const renderAvatar = (url, name) => {
        if (!url) return <div className="avatar-placeholder">{name?.charAt(0)}</div>;
        if (url.length < 5) return <span className="emoji-avatar">{url}</span>;
        return <img src={url} alt={name} className="avatar-img" />;
    };

    // Dashboard Mode vs Module Mode
    const [subModule, setSubModule] = useState(null); // null = Dashboard, 'identities', 'lexicon', 'stats', 'proposals'

    // Return to dashboard handler
    const goHome = () => {
        setSubModule(null);
        setActiveTab('gent'); // Reset identities tab default
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <Loader2 className="spinner" />
                <p>Carregant sistema de control...</p>
            </div>
        );
    }

    // MAIN DASHBOARD VIEW
    if (!subModule) {
        return (
            <div className="admin-container">
                <header className="admin-header">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="title-area">
                        <h1><Shield size={24} /> PANELL DE CONTROL</h1>
                        <p>Benvingut, {isSuperAdmin ? 'Super Admin' : 'Administrador'}</p>
                    </div>
                </header>

                <div className="admin-content">
                    {/* LIVE STATUS CARD */}
                    <div className="status-card glow-border mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                                Estat del Sistema (En Viu)
                            </h2>
                            <span className="text-xs text-gray-400">v1.3.1</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="stat-mini">
                                <span className="label text-gray-400 text-xs">Usuaris Totals</span>
                                <p className="val text-2xl font-bold text-white">{stats?.totalUsers || '-'}</p>
                            </div>
                            <div className="stat-mini">
                                <span className="label text-gray-400 text-xs">Nous (24h)</span>
                                <p className="val text-2xl font-bold text-yellow-400">+{stats?.newUsers24h || 0}</p>
                            </div>
                            <div className="stat-mini col-span-2">
                                <span className="label text-gray-400 text-xs">Últim Registre</span>
                                <p className="val text-sm font-medium text-white truncate">
                                    {stats?.latestUser ? `👋 ${stats.latestUser.full_name}` : 'Cap recent'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="dashboard-card" onClick={() => setSubModule('identities')}>
                            <div className="dash-icon blue"><Users size={32} /></div>
                            <h3>Gestió d'Identitats</h3>
                            <p>Control de veïns, grups, empreses i entitats.</p>
                            <span className="dash-badge">{personas.length + entities.length} actius</span>
                        </div>

                        <div className="dashboard-card purple" onClick={() => setSubModule('lexicon')}>
                            <div className="dash-icon purple"><Layout size={32} /></div>
                            <h3>Diccionari Local</h3>
                            <p>Gestió del lèxic i paraules clau del poble.</p>
                            <span className="dash-badge">{lexicon.length} termes</span>
                        </div>

                        <div className="dashboard-card green" onClick={() => setSubModule('proposals')}>
                            <div className="dash-icon green"><Settings size={32} /></div>
                            <h3>Bústia de Propostes</h3>
                            <p>Noves funcionalitats i suggeriments.</p>
                            <span className="dash-badge">Futur</span>
                        </div>

                        <div className="dashboard-card red" onClick={() => setSubModule('broadcast')}>
                            <div className="dash-icon red"><Bell size={32} /></div>
                            <h3>Centre de Difusió</h3>
                            <p>Notificacions i Newsletter.</p>
                            <span className="dash-badge">Admin</span>
                        </div>

                        <div className="dashboard-card orange" onClick={() => alert('Pròximament: Estadístiques detallades')}>
                            <div className="dash-icon orange"><Store size={32} /></div>
                            <h3>Estadístiques</h3>
                            <p>Mètriques d'ús i activitat de la xarxa.</p>
                            <span className="dash-badge">En construcció</span>
                        </div>
                    </div>
                </div>
                );
    }

    const groups = entities.filter(e => e.type === 'grup');
    const businesses = entities.filter(e => e.type === 'empresa');
    const officials = entities.filter(e => e.type === 'entitat');

                // SUB-MODULE VIEWS
                if (params.get('view') === 'report') {
        return (
                <div className="admin-container" style={{ background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
                    <header className="admin-header" style={{ marginBottom: '20px' }}>
                        <button onClick={() => navigate('/admin')} className="back-btn">
                            <ArrowLeft size={24} /> Tancar Informe
                        </button>
                        <div className="title-area">
                            <h1>📄 INFORME TÈCNIC</h1>
                            <p>Document Confidencial - Grup de Treball</p>
                        </div>
                    </header>
                    <div className="admin-content" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <img src="/assets/avatars/iaia.png" alt="IAIA" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                            <h2 style={{ marginTop: '10px' }}>UNITAT TÈCNICA ANTIGRAVITY</h2>
                            <span style={{ background: '#FFD700', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>TOP SECRET</span>
                        </div>

                        <div className="markdown-body">
                            <h1>📋 INFORME D'INCIDÈNCIA: OPERACIÓ "RESCAT"</h1>
                            <p><strong>Per a:</strong> Damià & Equip de Direcció<br />
                                <strong>De:</strong> Unitat Tècnica (Antigravity & GPT-OSS)<br />
                                <strong>Data:</strong> 25 de Gener de 2026<br />
                                <strong>Assumpte:</strong> Resolució del conflicte de versions (v1.1.8 persistent) i bucle d'autenticació.</p>
                            <hr />
                            <h2>1. Resum Executiu</h2>
                            <p>El sistema "Sóc de Poble" ha experimentat una incidència crítica durant les últimes 4 hores on els usuaris (especialment en dispositius mòbils/Safari) quedaven atrapats en una versió antiga de l'aplicació (<code>v1.1.8</code>), impedint l'accés a les noves funcionalitats i causant un bucle de reinicis. <strong>La incidència ha estat completament resolta.</strong> La versió actual en producció és la <strong>v1.3.1</strong>.</p>

                            <h2>2. Descripció del Problema</h2>
                            <ul>
                                <li><strong>Símptomes:</strong> Pantalla blanca, títol de pestanya incorrecte, bucle infinit de "recarregant sessió" en entrar al mode de rescat (codi 123456).</li>
                                <li><strong>Impacte:</strong> Els canvis que fèiem (arreglar errors) no arribaven als dispositius perquè els navegadors estaven "aferrats" a la versió antiga de forma agressiva.</li>
                            </ul>

                            <h2>3. Causa Arrel (Diagnòstic)</h2>
                            <p>Després d'una auditoria profunda (Protocol "Elite Team"), hem identificat dos factors:</p>
                            <ol>
                                <li><strong>Caché "Zombie":</strong> El mecanisme de l'aplicació que guarda dades per funcionar sense internet (Service Worker) no s'adonava que hi havia una nova versió i seguia servint l'antiga.</li>
                                <li><strong>Error de Desplegament (Factor Humà/IA):</strong> El codi específic dissenyat per "matar" aquesta caché antiga es va quedar en l'entorn de proves i no es va enviar al servidor central fins a l'últim moment.</li>
                            </ol>

                            <h2>4. Solució Aplicada</h2>
                            <p>Hem executat una intervenció d'emergència en tres passos:</p>
                            <ul>
                                <li>✅ <strong>Protocol "Terra Cremada":</strong> Hem injectat un codi especial a l'arrencada de l'app que detecta versions antigues i força al navegador a esborrar-ho tot i baixar la nova versió.</li>
                                <li>✅ <strong>Blindatge del Login:</strong> Hem reprogramat el sistema d'autenticació per a ser immune als errors de "fals tancament de sessió" durant les demos.</li>
                                <li>✅ <strong>Activació "Màgia de Poble":</strong> Hem aprofitat el desplegament per activar el "Simulador de Vida" (IAIA + Nano Banana), que ara es pot controlar des del Panell d'Admin.</li>
                            </ul>

                            <h2>5. Estat Actual</h2>
                            <ul>
                                <li><strong>Versió:</strong> v1.3.1 (Estable)</li>
                                <li><strong>Accés:</strong> Restaurat.</li>
                                <li><strong>Recomanació:</strong> La pròxima vegada que obriu l'app, s'actualitzarà automàticament. Si persisteix algun problema, l'eina <code>/tools/rescue.html</code> segueix disponible com a salvavides.</li>
                            </ul>
                            <hr />
                            <p><em>Fi de l'Informe.</em></p>
                        </div>
                    </div>
                </div>
                );
    }

                return (
                <div className="admin-container">
                    <header className="admin-header">
                        <button onClick={goHome} className="back-btn">
                            <ArrowLeft size={24} />
                        </button>
                        <div className="title-area">
                            <h1>
                                {subModule === 'identities' && 'Gestió d\'Identitats'}
                                {subModule === 'lexicon' && 'Diccionari Local'}
                                {subModule === 'proposals' && 'Propostes'}
                            </h1>
                            <p>Panell de Control &gt; {subModule}</p>
                        </div>
                    </header>

                    {/* IDENTITY MANAGEMENT MODULE */}
                    {subModule === 'identities' && (
                        <>
                            <nav className="admin-tabs">
                                <button className={activeTab === 'gent' ? 'active' : ''} onClick={() => setActiveTab('gent')}>
                                    <Users size={18} /> Gent ({personas.length})
                                </button>
                                <button className={activeTab === 'grups' ? 'active' : ''} onClick={() => setActiveTab('grups')}>
                                    <Users size={18} /> Grups ({groups.length})
                                </button>
                                <button className={activeTab === 'empreses' ? 'active' : ''} onClick={() => setActiveTab('empreses')}>
                                    <Store size={18} /> Empreses ({businesses.length})
                                </button>
                                <button className={activeTab === 'entitats' ? 'active' : ''} onClick={() => setActiveTab('entitats')}>
                                    <Shield size={18} /> Entitats ({officials.length})
                                </button>
                            </nav>

                            <div className="admin-content">
                                {activeTab === 'gent' && (
                                    <div className="persona-grid">
                                        {personas.length === 0 && <p className="empty-msg">No s'han trobat persones.</p>}
                                        {personas.map(p => (
                                            <div key={p.id} className="persona-card">
                                                <div className="persona-avatar">{renderAvatar(p.avatar_url, p.full_name)}</div>
                                                <div className="persona-info">
                                                    <h3>{p.full_name}</h3>
                                                    <p>@{p.username}</p>
                                                    <span className="location-tag">{p.role === 'vei' ? 'Veí' : p.role}</span>
                                                </div>
                                                {isSuperAdmin && (
                                                    <button className="impersonate-btn" onClick={() => handleImpersonate(p, 'user')}>
                                                        ACTUAR COM
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'grups' && (
                                    <div className="entity-grid">
                                        {groups.length === 0 && <p className="empty-msg">No s'han trobat grups.</p>}
                                        {groups.map(e => (
                                            <div key={e.id} className="persona-card entity">
                                                <div className="persona-avatar">{renderAvatar(e.avatar_url, e.name)}</div>
                                                <div className="persona-info">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description || 'Grup social/cultural'}</p>
                                                </div>
                                                <button className="impersonate-btn" onClick={() => handleImpersonate(e, 'entity')}>
                                                    GESTIONAR
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'empreses' && (
                                    <div className="entity-grid">
                                        {businesses.length === 0 && <p className="empty-msg">No s'han trobat empreses.</p>}
                                        {businesses.map(e => (
                                            <div key={e.id} className="persona-card entity work">
                                                <div className="persona-avatar">{renderAvatar(e.avatar_url, e.name)}</div>
                                                <div className="persona-info">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description || 'Comerç local / Empresa'}</p>
                                                </div>
                                                <button className="impersonate-btn" onClick={() => handleImpersonate(e, 'entity')}>
                                                    GESTIONAR
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'entitats' && (
                                    <div className="entity-grid">
                                        {officials.length === 0 && <p className="empty-msg">No s'han trobat entitats.</p>}
                                        {officials.map(e => (
                                            <div key={e.id} className="persona-card entity official">
                                                <div className="persona-avatar">{renderAvatar(e.avatar_url, e.name)}</div>
                                                <div className="persona-info">
                                                    <h3>{e.name}</h3>
                                                    <p>{e.description || 'Entitat institucional'}</p>
                                                </div>
                                                <button className="impersonate-btn" onClick={() => handleImpersonate(e, 'entity')}>
                                                    GESTIONAR
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* LEXICON MODULE */}
                    {subModule === 'lexicon' && (
                        <div className="admin-content">
                            <div className="lexicon-admin">
                                <div className="admin-section-header">
                                    <h3>Gestió del Lèxic Local</h3>
                                    <button className="add-btn" onClick={() => alert('Pròximament: Afegir terme')}>
                                        <Plus size={16} /> Nou Terme
                                    </button>
                                </div>
                                <div className="lexicon-grid">
                                    {lexicon.length === 0 && <p className="empty-msg">No hi ha termes al lèxic.</p>}
                                    {lexicon.map(term => (
                                        <div key={term.id} className="lexicon-item-card">
                                            <div className="term-main">
                                                <span className="term-word">{term.term}</span>
                                                <span className="term-town">{term.towns?.name || 'Comú'}</span>
                                            </div>
                                            <p className="term-def">{term.definition}</p>
                                            <div className="term-footer">
                                                <span className="term-cat">{term.category || 'General'}</span>
                                                <div className="term-actions">
                                                    <button className="icon-btn"><Settings size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROPOSALS MODULE */}
                    {subModule === 'proposals' && (
                        <div className="admin-content">
                            <div className="proposals-section text-center p-8 bg-white/50 rounded-xl">
                                <div className="empty-state-icon text-4xl mb-4">🚀</div>
                                <h3 className="text-xl font-bold mb-2">Bústia de Noves Implementacions</h3>
                                <p className="text-gray-600 mb-6">Aquest espai està reservat per al futur. Ací podrem gestionar les noves idees que vagen sorgint.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <h4 className="font-bold flex items-center gap-2">🛒 E-Commerce Local</h4>
                                        <p className="text-sm text-gray-500 mt-1">Gestió centralitzada de comandes per a botigues.</p>
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded mt-2 inline-block">Pendent</span>
                                    </div>
                                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <h4 className="font-bold flex items-center gap-2">📢 Ban Municipal 2.0</h4>
                                        <p className="text-sm text-gray-500 mt-1">Sistema d'alertes via WhatsApp/Push per ajuntaments.</p>
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded mt-2 inline-block">Pendent</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BROADCAST MODULE */}
                    {subModule === 'broadcast' && (
                        <div className="admin-content">
                            <BroadcastManager user={personas.find(p => p.id === useAuth().user?.id)} allUsers={personas} />
                        </div>
                    )}
                </div>
                );
};

                // --- SUBCOMPONENTS ---

                const BroadcastManager = ({user, allUsers}) => {
    const [title, setTitle] = useState('🌟 Nova Versió 1.3.0 Disponible!');
                const [body, setBody] = useState('Hem millorat el rendiment i solucionat errors. Actualitza ara!');
                const [sending, setSending] = useState(false);

    const handleTestPush = async () => {
        if (!user) return alert('No puc enviar-te push perquè no trobe el teu usuari.');
                try {
                    setSending(true);
                const success = await pushNotifications.triggerNotification(user.id, {
                    title: "🔔 Test de Push",
                body: "Si llegeixes això, el sistema funciona perfectament.",
                icon: "/icon-192.png",
                tag: "test-push",
                url: "/admin"
            });
                if (success) alert('✅ Notificació enviada! Revisa el teu mòbil/centre de notificacions.');
                else alert('❌ Error enviant. Revisa els logs.');
        } catch (e) {
                    console.error(e);
                alert('Error: ' + e.message);
        } finally {
                    setSending(false);
        }
    };

    const handleBroadcastPush = async () => {
        if (!window.confirm(`⚠️ SEGUR? Això enviarà una alerta a TOTS els usuaris (${allUsers.length}).`)) return;

                try {
                    setSending(true);
                let count = 0;
            // MVP Loop: Send one by one (idealment això es faria al backend en batch)
            // Filtrem usuaris "reals" o amb ID vàlid
            const targets = allUsers.filter(u => u.id && u.id !== 'demo-user');

                for (const target of targets) {
                    // Persist notification in DB (for Archive)
                    await supabaseService.createNotification({
                        user_id: target.id,
                        type: 'system', // or 'iaia_broadcast'
                        content: body, // The message
                        related_url: '/chats', // Default Action
                        meta: {
                            is_iaia: true,
                            context_message: body
                        }
                    });

                // Fire and One-way
                pushNotifications.triggerNotification(target.id, {
                    title: title,
                body: body,
                icon: "/icon-192.png",
                tag: "version-update",
                url: "/chats",
                data: {
                    isIAIA: true, // Trigger interactive logic
                message: body
                    }
                });
                count++;
            }
                alert(`✅ Broadcast iniciat per a ${count} usuaris (Persistit & Push).`);
        } catch (e) {
                    alert('Error: ' + e.message);
        } finally {
                    setSending(false);
        }
    };

    const handleCopyEmails = () => {
        // Filter out emails that look fake or demo
        const emails = allUsers
            .map(u => u.email)
            .filter(e => e && e.includes('@') && !e.includes('example.com') && !e.includes('playground.local'))
                .join(', ');

                navigator.clipboard.writeText(emails);
                alert(`✅ ${emails.split(', ').length} emails copiats al porta-retalls!`);
    };

                return (
                <div className="broadcast-container">
                    <div className="broadcast-card glass">
                        <div className="card-header-simple">
                            <h3>📲 Push Notifications</h3>
                            <span className="badge-beta">Beta</span>
                        </div>

                        <div className="form-group-admin">
                            <label>Títol de l'Alerta</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>

                        <div className="form-group-admin">
                            <label>Missatge</label>
                            <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} />
                        </div>

                        <div className="broadcast-actions">
                            <button className="btn-secondary" onClick={handleTestPush} disabled={sending}>
                                {sending ? <Loader2 className="spin" /> : '🔔 Provar en el meu mòbil'}
                            </button>
                            <button className="btn-primary-danger" onClick={handleBroadcastPush} disabled={sending}>
                                🚀 ENVIAR A TOTS
                            </button>
                        </div>
                    </div>

                    <div className="broadcast-card glass">
                        <div className="card-header-simple">
                            <h3>💌 Newsletter Email</h3>
                        </div>
                        <p className="card-desc">Copia tots els correus dels usuaris registrats per a enviar la newsletter de l'actualització des del teu gestor de correu preferit.</p>

                        <button className="btn-outline-primary full-width" onClick={handleCopyEmails}>
                            📋 Copiar Llista de Correus (CCO)
                        </button>
                    </div>

                    <div className="broadcast-card glass" style={{ borderColor: '#FFD700' }}>
                        <div className="card-header-simple">
                            <h3>✨ Màgia de Poble (IAIA + NanoBanana)</h3>
                        </div>
                        <p className="card-desc">Invoca a la IAIA i a Nano Banana perquè donen vida al poble (Posts, Mercat, Xats).</p>

                        <button className="btn-primary full-width" onClick={async () => {
                            if (!window.confirm("Vols despertar a tot el poble? Això generarà activitat aleatòria.")) return;
                            try {
                                alert("🍌 Nano Banana està pintant el poble... Espera uns segons!");
                                await import('../services/iaiaService').then(m => m.iaiaService.wakeUpNanoBanana());
                                alert("✨ Màgia completada! Revisa el Mur, el Mercat i els Xats.");
                            } catch (e) {
                                alert("Error màgic: " + e.message);
                            }
                        }} style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', color: 'black', fontWeight: 'bold' }}>
                            🍌✨ GENERAR VIDA
                        </button>

                        <button className="btn-secondary full-width" onClick={async () => {
                            if (!window.confirm("Publicar l'informe d'incidència al grup de treball?")) return;
                            try {
                                const iaia = await import('../services/iaiaService').then(m => m.iaiaService);
                                // We point to a hosted version or a local path if we had the PDF. Since it's MD, we point to the repo raw or create a viewer link.
                                // For MVP: We point to the GitHub raw URL or a placeholder.
                                // User document: INCIDENT_REPORT_RESCUE.md
                                // We can encode it in data URI but it's too big.
                                // We will link to: /admin?view=report (We can add a simple viewer in Admin)
                                await iaia.publishInternalReport(
                                    "Informe Incidència: Rescat v1.3.1",
                                    "Resum executiu sobre la resolució del conflicte de versions i el bucle de login.",
                                    "/admin?view=report" // Self-link to Admin viewer
                                );
                                alert("✅ Informe publicat al Mur (Confidencial)");
                            } catch (e) {
                                alert("Error: " + e.message);
                            }
                        }} style={{ marginTop: '10px', background: '#333', color: '#FFF' }}>
                            📁 PUBLICAR INFORME TÈCNIC
                        </button>
                    </div>
                </div>
                );
};

                export default AdminPanel;
