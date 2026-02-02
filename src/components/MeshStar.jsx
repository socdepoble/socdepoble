import React from 'react';
import './MeshStar.css';

/**
 * [SACRED TECH] MeshStar: Estrella Fractal de Ganxet
 * Visualitza la salut de la xarxa Mesh inspirada en els coixins tradicionals.
 * @param {string} status - 'offline', 'connecting', 'synced'
 * @param {number} hops - Nombre de salts/capes detectades (1-3)
 */
const MeshStar = ({ status = 'offline', hops = 1 }) => {
    // Generem els punts de l'estrella de 8 puntes
    const getStarPath = (radius, innerRadius = null) => {
        const points = [];
        const inner = innerRadius || radius * 0.4;
        for (let i = 0; i < 16; i++) {
            const r = i % 2 === 0 ? radius : inner;
            const angle = (Math.PI * i) / 8;
            points.push(`${50 + r * Math.sin(angle)},${50 - r * Math.cos(angle)}`);
        }
        return `M ${points.join(' L ')} Z`;
    };

    return (
        <div className={`mesh-star-container ${status}`}>
            <svg viewBox="0 0 100 100" className="mesh-star-svg">
                {/* Capa 3: Xarxa Global (Exterior) */}
                <path
                    d={getStarPath(45)}
                    className={`star-layer global ${hops >= 3 ? 'active' : ''}`}
                />

                {/* Capa 2: Veïns (Intermitja) */}
                <path
                    d={getStarPath(32)}
                    className={`star-layer neighbors ${hops >= 2 ? 'active' : ''}`}
                />

                {/* Capa 1: Bluetooth/Local (Interior) */}
                <path
                    d={getStarPath(20)}
                    className={`star-layer local ${hops >= 1 ? 'active' : ''}`}
                />

                {/* El Centre: El Dispositiu (Local-First) */}
                <circle cx="50" cy="50" r="6" className="star-core" />
            </svg>

            {status === 'offline' && (
                <div className="mesh-star-status-tag">MODE SOBIRÀ</div>
            )}
        </div>
    );
};

export default MeshStar;
