import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../adapters/authHooks';
import { UniversalHeader } from '../../components/ui/Header/UniversalHeader';

const GestoriaPage = () => {
    const { user, profile } = useSession();
    const navigate = useNavigate();

    // Mode Foraster temporalment desactivat per forçar el registre i veure les dades
    const isForaster = false;
    const userName = profile?.name || 'Javi Llinares';
    const userAvatar = profile?.avatar || '/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg';
    const qs = isForaster ? '?mode=demo' : `?mode=app&name=${encodeURIComponent(userName)}&avatar=${encodeURIComponent(userAvatar)}`;
    const iframeSrc = `/gestoria/index.html${qs}`;

    useEffect(() => {
        // Escoltem els missatges de l'iframe (postMessage)
        const handleMessage = (event) => {
            // Assegurem que només fem cas si ve del mateix domini
            if (event.origin !== window.location.origin) return;

            if (event.data && event.data.type === 'NAVIGATE') {
                navigate(event.data.path);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

    return (
        <div className="flex flex-col w-full h-full bg-white overflow-hidden">
            {/* L'iframe carregarà el WebComponent complet i la seua pròpia barra superior */}
            {/* Però si volem tindre un contenidor pare segur, podem llevar o deixar el UniversalHeader.
                Com que la gestoria ja té la seua sp-top-bar pròpia, l'iframe a soles ja val. */}
            <iframe 
                src={iframeSrc} 
                className="w-full h-full border-none m-0 p-0"
                title="Gestoria de Poble Plugin"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            />
        </div>
    );
};

export default GestoriaPage;
