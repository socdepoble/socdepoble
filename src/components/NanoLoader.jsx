import React from 'react';
import { Leaf, Cpu } from 'lucide-react';
import './NanoSplashScreen.css'; // Reuse splash styles fo efficiency

const NanoLoader = ({ message = "Carregant Sóc de Poble..." }) => {
    return (
        <div className="nano-splash loader-only">
            <div className="splash-background">
                <div className="blob orange"></div>
                <div className="blob cyan"></div>
            </div>

            <div className="loader-content">
                <div className="nano-logo-container animate-pulse">
                    <div className="nano-icon">
                        <Leaf className="leaf-icon" size={40} />
                        <Cpu className="cpu-icon" size={20} />
                    </div>
                </div>
                <p className="loader-message">{message}</p>
            </div>

            <style>{`
                .loader-only { background: rgba(10, 15, 30, 0.9); z-index: 1000; }
                .loader-content { text-align: center; }
                .loader-message { margin-top: 15px; font-family: 'Inter', sans-serif; color: #00f2ff; font-weight: 500; font-size: 0.9rem; }
                .animate-pulse { animation: loader-pulse 1.5s infinite ease-in-out; }
                @keyframes loader-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default NanoLoader;
