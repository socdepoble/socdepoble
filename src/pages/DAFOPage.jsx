import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Download } from 'lucide-react';
import DAFOCard from '../components/DAFOCard';
import { MOCK_DAFOS } from '../data';
import SEO from '../components/SEO';
import './DAFOPage.css';

const DAFOPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dafoData = MOCK_DAFOS[id];

    if (!dafoData) {
        return (
            <div className="dafo-page-error">
                <ArrowLeft onClick={() => navigate(-1)} className="back-btn" />
                <h2>Anàlisi no trobada</h2>
                <p>El bategat d'aquest DAFO encara no ha sigut enregistrat al Mas.</p>
                <button className="btn-primary" onClick={() => navigate('/')}>Tornar a l'Inici</button>
            </div>
        );
    }

    return (
        <div className="dafo-page-container">
            <SEO
                title={`${dafoData.title} - Anàlisi DAFO`}
                description={dafoData.description}
            />

            <header className="dafo-page-header">
                <button onClick={() => navigate(-1)} className="back-btn-dafo">
                    <ArrowLeft size={24} />
                </button>
                <div className="dafo-actions">
                    <button className="action-btn-mini" title="Compartir" onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: `Anàlisi DAFO: ${dafoData.title}`,
                                text: dafoData.description,
                                url: window.location.href
                            });
                        } else {
                            alert('La compartició no està disponible en aquest navegador.');
                        }
                    }}><Share2 size={18} /></button>
                    <button className="action-btn-mini" title="Descarregar" onClick={() => window.print()}><Download size={18} /></button>
                </div>
            </header>

            <main className="dafo-main-content">
                <DAFOCard data={dafoData} />

                <div className="dafo-didactic-footer">
                    <h3>💡 Per què un DAFO?</h3>
                    <p>
                        A Sóc de Poble apliquem el <strong>Rigor Tècnic Master</strong>. No prenem decisions basades en pálpits buits, sinó en el pes de les dades y el trellat social. Aquesta matriu ens ajuda a protegir el Mas de l'entropia digital y a potenciar les nostres arrels.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DAFOPage;
