import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useUI } from '../context/UIContext';
import hapticService from '../services/hapticService';
import cameraService from '../services/CameraService';
import './AmphoraFAB.css';

/**
 * [MASTER] AmphoraFAB - El Botó de l'Àmfora 🏺
 * Gestió de permisos Just-in-Time i obertura del CreationHub.
 */
const AmphoraFAB = () => {
    const { setIsCreateModalOpen } = useUI();
    const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

    const handleClick = async () => {
        hapticService.batec();

        // Protocol de Privacitat: Només comprovem si tenim permisos si anem a usar la càmera
        // Però per al CreationHub general, només obrim el modal.
        // El permís real es demanarà dins del CaptureStudio si l'usuari tria foto.
        setIsCreateModalOpen(true);
    };

    return (
        <div className="amphora-fab-container">
            <button
                className="amphora-fab-btn"
                onClick={handleClick}
                aria-label="Crear nou bategat"
            >
                <div className="amphora-icon">🏺</div>
                <div className="plus-badge">
                    <Plus size={16} strokeWidth={3} />
                </div>
            </button>
        </div>
    );
};

export default AmphoraFAB;
