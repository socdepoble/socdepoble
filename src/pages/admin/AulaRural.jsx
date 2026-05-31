import './AulaRural.css';

const AulaRural = () => {
    return (
        <div className="aula-rural-container">
            <div role="region" aria-label="Capçalera de Secció" className="aula-header">
                <div className="header-meta">
                    <span className="badge-rural">PATRIMONI DIGITAL</span>
                    <span className="version">AULA RURAL [v1.0]</span>
                </div>
                <h1 className="aula-title">Benvinguts a l'Aula Rural</h1>
                <p className="aula-subtitle">
                    Aprenem com la tecnologia pot salvar el llinatge dels nostres pobles, amb trellat i cor.
                </p>
            </div>

            <section className="aula-manifest">
                <div className="manifest-card">
                    <Heart className="icon-main text-orange-500" />
                    <h2>Utilitat Social: El Cor del Mas</h2>
                    <p>
                        Sóc de Poble és una arquitectura **sense ànim de lucre**. No busquem dades per vendre, sinó dades per florir.
                        Aquesta plataforma és una eina veïnal on tu ets el sobirà de la teua informació.
                        Construïm un procomú digital per a protegir la memòria viva de La Torre de les Maçanes.
                    </p>
                </div>
            </section>

            <div className="aula-grid">
                <div className="didactic-card">
                    <div className="card-header">
                        <Zap size={24} />
                        <h3>Smart City Km 0</h3>
                    </div>
                    <p>
                        La tecnologia Smart City sol ser per a grans capitals. Nosaltres la portem a la vora del barranc.
                        Optimitzem el bategat del poble: gestió de residus, sensors d'aigua i mapatge de necessitats comunitàries.
                    </p>
                    <div className="status-badge">TECNOLOGIA CIUTADANA</div>
                </div>

                <div className="didactic-card">
                    <div className="card-header">
                        <ShieldCheck size={24} />
                        <h3>Sobirania de Dades</h3>
                    </div>
                    <p>
                        En l'Atall Territorial (la +IA), la teua privacitat és sagrada. Utilitzem protocols descentralitzats (Rhizome)
                        perquè la informació del poble es quede al poble.
                    </p>
                    <div className="status-badge">PROTOCOL LOCAL-FIRST</div>
                </div>

                <div className="didactic-card">
                    <div className="card-header">
                        <Sprout size={24} />
                        <h3>Afecte vs Algoritme</h3>
                    </div>
                    <p>
                        Aquí no hi ha algoritmes de manipulació. El "Mur" bategua al ritme de la comunitat real.
                        La IAIA MarIA ens ajuda a trobar el sentit, no a perdre el temps.
                    </p>
                    <div className="status-badge">EL SENY DE LA IAIA</div>
                </div>

                <div className="didactic-card highlighted">
                    <div className="card-header">
                        <Sparkles size={24} />
                        <h3>Properes Llavors (Roadmap)</h3>
                    </div>
                    <ul className="didactic-list">
                        <li><strong>Assemblea Digital:</strong> Vots sobirans per a decisions del poble.</li>
                        <li><strong>Bategat Econòmic:</strong> Moneda local per a mantenir la riquesa al Mas.</li>
                        <li><strong>Memòria Viva:</strong> Arxiu històric interactiu col·laboratiu.</li>
                    </ul>
                </div>
            </div>

            <footer className="aula-footer">
                <div className="footer-content">
                    <Globe size={18} />
                    <span>Projecte d'Arquitectura Social per a la Ruralitat Connectada</span>
                </div>
            </footer>
        </div>
    );
};

export default AulaRural;
