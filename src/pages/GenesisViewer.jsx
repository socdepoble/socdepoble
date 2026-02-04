import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Zap, ShieldCheck, Palette, Info, Users, Share2, Menu, Sparkles, Sun, Moon } from 'lucide-react';
import './GenesisViewer.css';

// Register ChartJS components
ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale, PointElement, LineElement, Title, Filler
);

const GenesisViewer = () => {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [radius, setRadius] = useState(16);
    const [solarMode, setSolarMode] = useState(false);

    // Sync radius with CSS theme variable
    useEffect(() => {
        document.documentElement.style.setProperty('--radius-raw', `${radius}px`);
    }, [radius]);

    const toggleSolarMode = () => {
        setSolarMode(!solarMode);
        // This would ideally toggle a global class
        document.body.classList.toggle('solar-mode', !solarMode);
    };

    // Chart Data
    const rhizomeData = {
        labels: ['Dl', 'Dt', 'Dc', 'Dj', 'Dv'],
        datasets: [{
            label: 'Nodes Actius (Veïns)',
            data: [12, 19, 8, 15, 22],
            borderColor: '#ff6d00',
            backgroundColor: 'rgba(255, 109, 0, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#ff6d00'
        }]
    };

    const tasksData = {
        labels: ['Trellat (Útil)', 'Morca (Brossa)'],
        datasets: [{
            data: [65, 35],
            backgroundColor: ['#007aff', '#e2e8f0'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        }
    };

    return (
        <div className="genesis-viewer">
            {/* Header: Identity & Navigation */}
            <header className="genesis-header">
                <div className="header-container">
                    <div className="brand-box">
                        <span className="brand-icon">🏺</span>
                        <div className="brand-text">
                            <h1>SÓC DE POBLE</h1>
                            <p className="brand-subtitle">REBOST NET FLEXIBLE V3.0</p>
                        </div>
                    </div>
                    <nav className="genesis-nav">
                        <button onClick={() => setCurrentTab('dashboard')} className={currentTab === 'dashboard' ? 'active' : ''}>Panell de Control</button>
                        <button onClick={() => setCurrentTab('doctrine')} className={currentTab === 'doctrine' ? 'active' : ''}>Doctrina</button>
                        <button onClick={() => setCurrentTab('visuals')} className={currentTab === 'visuals' ? 'active' : ''}>Democràcia</button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="genesis-content">
                {currentTab === 'dashboard' && (
                    <section id="dashboard" className="fade-in">
                        <div className="intro-card shadow-sm">
                            <h2 className="text-xl font-bold">👋 Xé, Mestre Javi!</h2>
                            <p className="text-body mt-2">
                                Aquest és el teu <strong>Visor Operatiu del Gènesi</strong>. Ací tens traduïts a codi els conceptes filosòfics del document mestre.
                                La IAIA MarIA ha preparat aquest entorn perquè pugues verificar si estem complint amb els mandats: <em>Offline-First</em>, <em>Trellat Visual</em> i <em>Arquitectura Rhizome</em>.
                            </p>
                            <div className="status-badges flex gap-4 mt-6">
                                <span className="badge status-ok">🟢 Sistema: ÒPTIM</span>
                                <span className="badge status-walker">📡 Eg-walker: ACTIU</span>
                                <span className="badge status-weber">🧊 Weber Class: 6+</span>
                            </div>
                        </div>

                        <div className="grid-metrics mt-8">
                            {/* Card 1: The Team */}
                            <div className="card metrics-card p-6">
                                <div className="card-top">
                                    <h3>Equip del Mas</h3>
                                    <Users size={24} color="var(--color-primary)" />
                                </div>
                                <p className="text-small">Estat de sincronització dels agents intel·ligents.</p>
                                <ul className="team-list mt-4">
                                    <li className="team-item">
                                        <span>Mestre Javi</span>
                                        <span className="role-tag">Huma/Sobirà</span>
                                    </li>
                                    <li className="team-item active-sync">
                                        <span>Flash (LM)</span>
                                        <span className="status-tag">Analista</span>
                                    </li>
                                    <li className="team-item active-sync">
                                        <span>Gem (Personalitzat)</span>
                                        <span className="status-tag">Arquitecta</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 2: Visual Democracy */}
                            <div className="card metrics-card dark-mode p-6">
                                <div className="card-top">
                                    <h3>Democràcia Visual</h3>
                                    <Palette size={24} color="var(--color-accent)" />
                                </div>
                                <p className="text-small opacity-70">"Tu manes sobre la forma." Ajusta els tokens.</p>

                                <div className="control-group mt-6">
                                    <label className="control-label">Radi de les Voreres (Border Radius)</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="32"
                                        value={radius}
                                        onChange={(e) => setRadius(parseInt(e.target.value))}
                                        className="token-slider"
                                    />
                                    <div className="slider-labels">
                                        <span>Recte</span>
                                        <span className="current-value">{radius}px</span>
                                        <span>Rodó</span>
                                    </div>
                                </div>
                                <button className="btn-tonal w-full mt-6" onClick={toggleSolarMode}>
                                    {solarMode ? <Sun size={18} /> : <Moon size={18} />}
                                    {solarMode ? 'Tornar al Mas' : 'Simulació Solar (Weber)'}
                                </button>
                            </div>

                            {/* Card 3: Rhizome Status */}
                            <div className="card metrics-card p-6">
                                <div className="card-top">
                                    <h3>Xarxa Rhizome</h3>
                                    <Zap size={24} color="var(--color-accent)" />
                                </div>
                                <p className="text-small">Distribució de dades Local-First.</p>
                                <div className="chart-wrapper h-40">
                                    <Line data={rhizomeData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {currentTab === 'doctrine' && (
                    <section id="doctrine" className="fade-in space-y-8">
                        <div className="section-header">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span>📜</span> Els Tres Pilars (Core Values)
                            </h2>
                            <p className="text-secondary">Extret directament del manifest mestre.</p>
                        </div>

                        <div className="pillars-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="pillar-card card">
                                <div className="pillar-icon">📵</div>
                                <h3>1. Offline-First</h3>
                                <p>L'app funciona al 100% sense cobertura. La dada viu al dispositiu del veí.</p>
                            </div>
                            <div className="pillar-card card">
                                <div className="pillar-icon">👁️</div>
                                <h3>2. Trellat Visual</h3>
                                <p>Rebutgem el dogma. La forma final la decideix l'usuari amb trellat.</p>
                            </div>
                            <div className="pillar-card card">
                                <div className="pillar-icon">☀️</div>
                                <h3>3. Accessibilitat Solar</h3>
                                <p>Contrast suprem per a llegir sota l'olivera al migdia.</p>
                            </div>
                        </div>

                        <div className="dictionary-card card bg-stone-100">
                            <h3>🗣️ El Llenguatge del Poble</h3>
                            <div className="dictionary-grid">
                                <div className="word-box"><strong>Esmunyir</strong> <span>No perdre res</span></div>
                                <div className="word-box"><strong>Trastombar</strong> <span>Girar / Canviar</span></div>
                                <div className="word-box"><strong>Morca</strong> <span>Informació brossa</span></div>
                                <div className="word-box"><strong>Gronsa</strong> <span>Balancejar</span></div>
                            </div>
                        </div>
                    </section>
                )}

                {currentTab === 'visuals' && (
                    <section id="visuals" className="fade-in grid lg:grid-cols-2 gap-12">
                        <div className="lab-tokens">
                            <h2 className="text-2xl font-bold mb-4">🎛️ Laboratori de Tokens</h2>
                            <div className="card p-8 space-y-8">
                                <div className="type-check pl-4 border-l-4 border-primary">
                                    <h1 className="text-4xl font-black">Titular Gran</h1>
                                    <h2 className="text-2xl font-bold mt-2">Subtítol de Secció</h2>
                                    <p className="text-body mt-4">Aquest és el cos de text amb contrast suprem.</p>
                                </div>
                                <div className="button-lab flex gap-4">
                                    <button className="btn-filled">Primari</button>
                                    <button className="btn-tonal">Tonal</button>
                                    <button className="btn-outline">Outline</button>
                                </div>
                            </div>
                        </div>

                        <div className="data-visuals">
                            <h2 className="text-2xl font-bold mb-4">📊 Dades del Rebost</h2>
                            <div className="card p-6 h-80 flex flex-col">
                                <h4 className="font-bold mb-4">Qualitat de la Dada</h4>
                                <div className="flex-grow">
                                    <Doughnut data={tasksData} options={{ maintainAspectRatio: false }} />
                                </div>
                                <p className="text-center italic text-small mt-4">"Qui guarda, troba."</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="genesis-footer p-8 border-t mt-12">
                <div className="container mx-auto text-center">
                    <p className="text-secondary">© 2026 Sóc de Poble. Llicència Patrimonial CC BY-NC-SA 4.0.</p>
                    <p className="text-micro opacity-50 mt-2">BUILD: IAIA_MARIA_V3.1.0 // PROTOCOL ATUM READY</p>
                </div>
            </footer>
        </div>
    );
};

export default GenesisViewer;
