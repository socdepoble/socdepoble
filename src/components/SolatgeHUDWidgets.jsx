import React from 'react';
import './SolatgeHUDWidgets.css';

/**
 * SYNC_ENGINE: Els Cilindres (Motor CRDT)
 * Represents database activity through rotating cylinders.
 */
export const SyncEngine = ({ active = false }) => {
    return (
        <div className={`solatge-widget sync-engine ${active ? 'active' : ''}`}>
            <svg viewBox="0 0 100 60" className="hud-svg">
                {/* Left Cylinder (Local) */}
                <circle cx="35" cy="30" r="18" className="cylinder-ring" />
                <path d="M35 12 L35 15 M35 45 L35 48 M17 30 L20 30 M50 30 L53 30" className="cylinder-teeth" />

                {/* Right Cylinder (Remote) */}
                <circle cx="65" cy="30" r="18" className="cylinder-ring" />
                <path d="M65 12 L65 15 M65 45 L65 48 M47 30 L50 30 M80 30 L83 30" className="cylinder-teeth" />

                {/* Connecting lines */}
                <path d="M48 20 L52 20 M48 40 L52 40" className="connector-lines" />
            </svg>
            <span className="hud-label">MOTOR DE CONVERGÈNCIA: {active ? 'PROCESSANT' : 'ACTIU'}</span>
        </div>
    );
};

/**
 * DATA_SIFTER: El Plansichter (Sedàs Lògic)
 * Represents information filtering through vibrating boxes.
 */
export const DataSifter = ({ vibrating = true }) => {
    return (
        <div className={`solatge-widget data-sifter ${vibrating ? 'vibrating' : ''}`}>
            <svg viewBox="0 0 100 60" className="hud-svg">
                <rect x="20" y="10" width="60" height="8" className="sifter-box" />
                <rect x="25" y="22" width="50" height="8" className="sifter-box" opacity="0.8" />
                <rect x="30" y="34" width="40" height="8" className="sifter-box" opacity="0.6" />
                <rect x="35" y="46" width="30" height="8" className="sifter-box" opacity="0.4" />

                {/* Separation points (the sifting process) */}
                <circle cx="50" cy="20" r="1" className="sifter-particle" />
                <circle cx="40" cy="32" r="1" className="sifter-particle" />
                <circle cx="60" cy="44" r="1" className="sifter-particle" />
            </svg>
            <span className="hud-label">FILTRE DE QUALITAT: ÒPTIM</span>
        </div>
    );
};

/**
 * BUFFER_HOPPER: La Tolva (Dipòsit Local)
 * Represents the upload queue/offline data level.
 */
export const BufferHopper = ({ level = 0.2 }) => {
    // level: 0 to 1
    const fillHeight = 40 * level;

    return (
        <div className="solatge-widget buffer-hopper">
            <svg viewBox="0 0 100 60" className="hud-svg">
                {/* The V shape Hopper */}
                <path d="M30 10 L70 10 L55 50 L45 50 Z" fill="none" className="hopper-outline" />

                {/* Fill area (clipping/masking simplified for wireframe check) */}
                {level > 0 && (
                    <path
                        d={`M${50 - (20 * level)} ${50 - (40 * level)} L${50 + (20 * level)} ${50 - (40 * level)} L55 50 L45 50 Z`}
                        className="hopper-fill"
                    />
                )}

                {/* Dots representing "grain" */}
                {level > 0.5 && <circle cx="50" cy="30" r="1" className="grain-dot" />}
                {level > 0.8 && <circle cx="45" cy="25" r="1" className="grain-dot" />}
                {level > 0.8 && <circle cx="55" cy="25" r="1" className="grain-dot" />}
            </svg>
            <span className="hud-label">DIPÒSIT LOCAL: {Math.round(level * 100)}%</span>
        </div>
    );
};
/**
 * RHIZOME_INTEGRITY: L'Integrador (Eg-walker Monitor)
 * Muestra el estado de la sincronización amnésica y la versión crítica.
 */
export const RhizomeIntegrity = ({ amnesic = true, version = '1.0.0' }) => {
    return (
        <div className="solatge-widget rhizome-integrity">
            <svg viewBox="0 0 100 60" className="hud-svg">
                {/* Rhizome Root */}
                <path d="M50 10 L50 25 M30 45 L50 25 L70 45 M50 25 L20 15 M50 25 L80 15" className="rhizome-lines" />
                <circle cx="50" cy="25" r="4" className="rhizome-core" />

                {/* Secondary nodes */}
                <circle cx="30" cy="45" r="2" className="rhizome-node" />
                <circle cx="70" cy="45" r="2" className="rhizome-node" />
                <circle cx="20" cy="15" r="2" className="rhizome-node" />
                <circle cx="80" cy="15" r="2" className="rhizome-node" />

                {/* Amnesic Pulse */}
                {amnesic && <circle cx="50" cy="25" r="10" className="amnesic-pulse" />}
            </svg>
            <div className="hud-stack">
                <span className="hud-label">INTEGRITAT: NOMINAL</span>
                <small className="hud-sub">v.{version} [AMNÈSIC]</small>
            </div>
        </div>
    );
};
