import React from 'react';
import './ManualPage.css';
import { BookOpen, CheckCircle, AlertTriangle, Heart } from 'lucide-react';

const ManualPage = () => {
    return (
        <div className="manual-page-container">
            <header className="manual-header">
                <BookOpen size={48} className="manual-icon" />
                <h1>Manual d'Usuari Didàctic</h1>
                <p className="version-tag">v1.5.4-Genius-Absolut</p>
            </header>

            <section className="manual-section">
                <h2>Benvingut a Sóc de Poble</h2>
                <p>Estàs en un lloc dissenyat per a la connexió real. Aquest manual t'ajudarà a entendre què latega en cada racó de l'App.</p>
            </section>

            <section className="manual-status-grid">
                <div className="status-card stable">
                    <div className="card-header">
                        <CheckCircle size={24} />
                        <h3>Funcions Estables</h3>
                    </div>
                    <ul>
                        <li><strong>Mur (Feed)</strong>: Notícies i vida del poble.</li>
                        <li><strong>Mercat</strong>: Comerç local i artesania.</li>
                        <li><strong>IAIA</strong>: Guia virtual i assistència.</li>
                        <li><strong>Pobles</strong>: Memòria històrica de cada vila.</li>
                    </ul>
                </div>

                <div className="status-card experimental">
                    <div className="card-header">
                        <AlertTriangle size={24} />
                        <h3>En Proves (Lab)</h3>
                    </div>
                    <ul>
                        <li><strong>Lector de PDF</strong>: Lectura de cultura local.</li>
                        <li><strong>JARVIS</strong>: Control del sistema per veu.</li>
                        <li><strong>Notificacions</strong>: Sistema de bategada push.</li>
                    </ul>
                </div>
            </section>

            <section className="manual-section philosophy">
                <div className="philosophy-box">
                    <Heart size={32} className="heart-icon" />
                    <h3>Filosofia: Treball en sintonia</h3>
                    <p>Sóc de Poble es construeix entre tots. No som una corporació, som una comunitat. Qualsevol error que trobes ajuda a millorar el sistema per al proper veí.</p>
                </div>
            </section>

            <footer className="manual-footer">
                <p>Creat amb trellat i memòria rural.</p>
            </footer>
        </div>
    );
};

export default ManualPage;
