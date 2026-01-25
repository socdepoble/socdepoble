import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import './LegalNotice.css';

const LegalNotice = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-container">
            <header className="legal-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={24} />
                </button>
                <h1>Aspectes Legals</h1>
            </header>

            <div className="legal-content">
                <section className="legal-section">
                    <Shield className="legal-icon" size={48} />
                    <h2>Avís Legal i Política de Privacitat</h2>
                    <p className="last-update">Última actualització: 25 de Gener de 2026</p>
                </section>

                <section className="legal-section">
                    <h3>1. Informació General</h3>
                    <p>
                        En compliment amb el deure d'informació disposat en la Llei 34/2002 de Serveis de la Societat de la Informació i el Comerç Electrònic (LSSI-CE) d'11 de juliol, es faciliten a continuació les següents dades d'informació general d'aquest lloc web:
                    </p>
                    <ul>
                        <li><strong>Titular:</strong> Francisco Javier Llinares García</li>
                        <li><strong>DNI:</strong> 21476359V</li>
                        <li><strong>Direcció:</strong> Calle Sant Isidre Llaurador, 16</li>
                        <li><strong>Activitat:</strong> Plataforma social i de dinamització rural</li>
                        <li><strong>Email de contacte:</strong> hola@socdepoble.com</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h3>2. Protecció de Dades (RGPD)</h3>
                    <p>
                        De conformitat amb el que disposa el Reglament (UE) 2016/679 (RGPD) i la Llei Orgànica 3/2018 de Protecció de Dades Personals i garantia dels drets digitals (LOPDGDD), us informem que:
                    </p>
                    <ul>
                        <li><strong>Responsable:</strong> Les dades recollides seran tractades per "Sóc de Poble".</li>
                        <li><strong>Finalitat:</strong> Gestionar el registre d'usuaris, permetre la interacció social, geolocalització per a serveis locals i enviament de notificacions rellevants.</li>
                        <li><strong>Legitimació:</strong> El consentiment exprés de l'usuari en registrar-se.</li>
                        <li><strong>Conservació:</strong> Les dades es conservaran mentre es mantinga la relació o durant els anys necessaris per complir amb les obligacions legals.</li>
                        <li><strong>Drets:</strong> Podeu exercir els drets d'accés, rectificació, supressió, limitació i portabilitat enviant un email a hola@socdepoble.com.</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h3>3. Geolocalització i Privacitat</h3>
                    <p>
                        Aquesta aplicació utilitza serveis de geolocalització per oferir funcionalitats basades en la proximitat (veure comerços propers, esdeveniments locals).
                        La ubicació <strong>NO es comparteix amb tercers</strong> amb finalitats publicitàries. L'usuari pot desactivar la geolocalització en qualsevol moment des dels ajustos del seu dispositiu.
                    </p>
                </section>

                <section className="legal-section">
                    <h3>4. Ús de la IA (IAIA Agent)</h3>
                    <p>
                        La plataforma utilitza sistemes d'Intel·ligència Artificial ("La IAIA") per moderar contingut i dinamitzar converses.
                        Les converses amb l'agent d'IA poden ser processades per millorar la qualitat del servei, però mai s'utilitzaran per identificar personalment l'usuari fora de la plataforma.
                        Els continguts generats per la IA són revisats per evitar biaixos, però l'usuari accepta que poden contenir errors puntuals.
                    </p>
                </section>

                <section className="legal-section">
                    <h3>5. Propietat Intel·lectual</h3>
                    <p>
                        El codi font, els dissenys gràfics, les imatges, les fotografies, els sons, les animacions, el programari, els textos, així com la informació i els continguts que es recullen en "Sóc de Poble" estan protegits per la legislació espanyola sobre els drets de propietat intel·lectual i industrial.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default LegalNotice;
