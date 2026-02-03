import React from 'react';
import { Beaker, Lock, Users, Globe, Newspaper, Zap, Plus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LabsTab = ({ profile, setProfile, user, isPlayground, isAdmin }) => {
    const navigate = useNavigate();

    return (
        <div className="tab-pane-fade-in labs-pane">
            {/* Beta Tester Section */}
            <div className="profile-section-card beta-tester-card">
                <div className="section-header">
                    <div className="section-icon-bg beta">
                        <Beaker size={20} />
                    </div>
                    <div className="section-title-stack">
                        <h3>Vols ser Beta Tester?</h3>
                        <p>Ajuda'ns a bategar el poble!</p>
                    </div>
                    <div className="section-action">
                        <label className="switch">
                            <input
                                id="beta-tester-toggle-labs"
                                name="beta-tester-toggle-labs"
                                type="checkbox"
                                checked={profile?.is_beta_tester || false}
                                onChange={async (e) => {
                                    const val = e.target.checked;
                                    setProfile(prev => ({ ...prev, is_beta_tester: val }));
                                    // Supabase update would go here if not playground
                                }}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>

                <div className="beta-explanation" style={{ marginTop: '12px' }}>
                    <p>Com a <strong>Beta Tester</strong>, ajudes a bategar el poble trobant errors i proposant millores directament a l'equip tècnic.</p>
                </div>
                <button
                    className="btn-news-vitamin"
                    onClick={() => navigate('/mur')}
                    style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '12px', background: 'rgba(0, 242, 255, 0.1)', border: '1px solid var(--hud-accent)', color: 'var(--hud-accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <Newspaper size={18} /> Últimes Novetats Vitaminades 🐭💊
                </button>
            </div>

            {/* CÀPSULA DEL TEMPS [PILLAR 5] */}
            <div className="profile-section-card time-capsule-card" style={{ marginTop: '16px', border: '1px solid #FFD700', background: 'rgba(255, 215, 0, 0.05)' }}>
                <div className="section-header">
                    <div className="section-icon-bg" style={{ background: '#FFD700' }}>
                        <Lock size={20} color="black" />
                    </div>
                    <div className="section-title-stack">
                        <h3>Càpsula del Temps</h3>
                        <p style={{ color: '#B45309' }}>Protocol Long Now (Sobirania Total)</p>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ background: '#000', color: '#FFD700', fontSize: '12px', padding: '8px 16px' }}
                        onClick={() => {
                            import('../../../services/rhizomeManager').then(({ rhizomeManager }) => {
                                rhizomeManager.generateTimeCapsule();
                                alert('🏺¡Càpsula bategada! El teu historial i identitats estan segellats en un fitxer sobirà al teu dispositiu.');
                            });
                        }}
                    >
                        BATEGAR EXPORTACIÓ
                    </button>
                </div>
                <div className="beta-explanation" style={{ fontSize: '11px', opacity: 0.8, marginTop: '10px' }}>
                    Exporta tota la teua activitat en un format lliure que podràs obrir d'ací a 50 anys, fins i tot si el núvol desapareix. Tu ets l'amo.
                </div>
            </div>

            {/* CUSTÒDIA SOCIAL [PILLAR 3] */}
            <div className="profile-section-card social-custody-card" style={{ marginTop: '16px', border: '1px solid #10B981', background: 'rgba(16, 185, 129, 0.05)' }}>
                <div className="section-header">
                    <div className="section-icon-bg" style={{ background: '#10B981' }}>
                        <Users size={20} color="white" />
                    </div>
                    <div className="section-title-stack">
                        <h3>Custòdia Social (Padrins)</h3>
                        <p style={{ color: '#047857' }}>La teua xarxa de seguretat humana</p>
                    </div>
                </div>

                <div className="padrins-list" style={{ marginTop: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
                        <button
                            className="add-padrin-btn"
                            style={{ minWidth: '100px', height: '100px', borderRadius: '15px', border: '2px dashed #10B981', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10B981', padding: '10px' }}
                            onClick={() => {
                                const name = prompt('Nom del Padrin/a:');
                                if (name) {
                                    import('../../../services/paymentService').then(({ paymentService }) => {
                                        paymentService.addPadrin({ name, role: 'Padrí Confiança' });
                                        window.location.reload();
                                    });
                                }
                            }}
                        >
                            <Plus size={24} />
                            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>AFEGIR PADRÍ</span>
                        </button>
                    </div>
                </div>
                <div className="beta-explanation" style={{ fontSize: '11px', opacity: 0.8, marginTop: '10px' }}>
                    Si perds el dispositiu, els teus Padrins poden bategar la restauració del teu <strong>xlog</strong>. La teua comunitat és la teua millor còpia de seguretat.
                </div>
            </div>

            {/* Federació de Poble (Moved from redundant card) */}
            <div className="profile-section-card federation-node-card" style={{ marginTop: '16px', border: '1px solid #00f2ff', background: 'rgba(0, 242, 255, 0.05)' }}>
                <div className="section-header">
                    <div className="section-icon-bg" style={{ background: '#00f2ff' }}>
                        <Globe size={20} color="black" />
                    </div>
                    <div className="section-title-stack">
                        <h3>Sincronització Federada</h3>
                        <p style={{ color: '#0891b2' }}>Connectivitat Bategant</p>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ background: '#00f2ff', color: 'black', fontSize: '10px', padding: '8px 16px' }}
                        onClick={() => {
                            const node = prompt('A quin Node de la Federació vols connectar-te?', 'La Torre');
                            if (node) alert(`Sincronitzant amb el Node ${node.toUpperCase()}...`);
                        }}
                    >
                        CANVIAR NODE
                    </button>
                </div>
                <div className="beta-explanation" style={{ fontSize: '11px', opacity: 0.8, marginTop: '10px' }}>
                    Actualment connectat al <strong>NODE LA TORRE (PILOT)</strong>. Les teues dades es bateguen pel Rhizome local de forma sobirana.
                </div>
            </div>
        </div>
    );
};

export default LabsTab;
