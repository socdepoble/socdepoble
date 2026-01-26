import React, { useEffect, useState } from 'react';
import './NanoSplashScreen.css';
import { Leaf, Cpu, Sparkles } from 'lucide-react';

const NanoSplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('logo'); // logo, wordplay, final

    useEffect(() => {
        const timer1 = setTimeout(() => setPhase('wordplay'), 800);
        const timer2 = setTimeout(() => setPhase('final'), 2000);
        const timer3 = setTimeout(() => onComplete?.(), 3500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    const words = [
        { main: 'VIdA', sub: 'Vitalitat Rural' },
        { main: 'SAbIdurIA', sub: 'Saviesa Compartida' },
        { main: 'AlegrIA', sub: 'Proximitat Humana' },
        { main: 'GuIA', sub: 'Llanterna de Futur' }
    ];

    return (
        <div className="nano-splash">
            <div className="splash-background">
                <div className="blob orange"></div>
                <div className="blob cyan"></div>
                <div className="blob earth"></div>
            </div>

            <div className="splash-fixed-branding">
                <img src="/logo.png" alt="Sóc de Poble" className="splash-main-logo" />
            </div>

            <div className={`splash-content phase-${phase}`}>
                {phase === 'logo' && (
                    <div className="nano-logo-container animate-in">
                        <div className="nano-icon">
                            <Leaf className="leaf-icon" size={40} />
                            <Cpu className="cpu-icon" size={20} />
                        </div>
                        <h1>NANO</h1>
                    </div>
                )}

                {phase === 'wordplay' && (
                    <div className="word-cascade">
                        {words.map((w, i) => (
                            <div key={i} className="word-item" style={{ animationDelay: `${i * 0.3}s` }}>
                                <span className="word-main">
                                    {w.main.split('').map((char, index) => (
                                        <span key={index} className={char === 'I' || char === 'A' ? 'highlight' : ''}>
                                            {char}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {phase === 'final' && (
                    <div className="final-branding animate-in">
                        <div className="tagline">Arrels que miren al futur.</div>
                        <Sparkles className="sparkle" size={40} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NanoSplashScreen;
