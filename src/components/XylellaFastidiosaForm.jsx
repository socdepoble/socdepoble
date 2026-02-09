import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_VERSION } from '../constants';
import PersonalVault from './PersonalVault';
import './XylellaFastidiosaForm.css';

const VERSION = APP_VERSION;

const XylellaFastidiosaForm = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [step, setStep] = useState(0); // Comencem al pas 0 (Documentació)
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('xylella_form_data');
        const defaultData = {
            nombre_razon: profile?.full_name || '',
            nif_nie: '',
            tipo_perceptor: '1',
            tipo_persona: '4',
            via: '',
            num: '',
            poblacion: profile?.location?.town || '',
            provincia: profile?.location?.province || 'Alicante',
            cp: '',
            email: profile?.email || '',
            telefono: '',
            entidad: '',
            iban: 'ES',
            parcelas: [
                { provincia: 'Alicante', municipio: '', poligono: '', parcela: '', cadastre: '' }
            ],
            autoriza_aeat: true,
            autoriza_atv: true,
            autoriza_identidad: true,
            oposicion_aeat: false,
            oposicion_atv: false,
            declara_no_recuperacion: true,
            declara_informado: true,
            declara_pyme: true,
            oficina_registre: '10SIL- SERVICIOS CENTRALES-SILLA',
            organisme: '10C. Agricultura, Ganadería y Pesca',
            unitat_registre: 'GV10 10SVSAV Servicio de Sanidad Vegetal',
            procediment_nom: 'Ayudas indemnizatorias para la erradicación y el control de la bacteria de cuarentena Xylella fastidiosa',
            codi_procediment: '18932'
        };

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                return { ...defaultData, ...parsed };
            } catch (e) {
                console.error('[XylellaForm] Error carregant persistència:', e);
            }
        }
        return defaultData;
    });

    const [iaiaAdvice, setIaiaAdvice] = useState(() => {
        if (localStorage.getItem('xylella_form_data')) {
            return "Mestre, he recordat les dades que vas posar l'última vegada. L'harmonia és memòria. 🏺✨";
        }
        return "Bon dia! Soc La IAIA. Per a començar, puja els teus papers al Vault i m'ocuparé d'omplir-te la paperassa. ✨👵";
    });
    const [isAutofilled, setIsAutofilled] = useState(false);

    // [MASTER VERSION LOG]
    useEffect(() => {
        console.log(`[Ofici] ${VERSION} bategant...`);
    }, []);

    // [MASTER PERSISTENCE] Guardar dades en cada canvi
    useEffect(() => {
        localStorage.setItem('xylella_form_data', JSON.stringify(formData));
    }, [formData]);

    const handleVaultData = (data) => {
        setFormData(prev => ({
            ...prev,
            ...data,
            // Si hem extret parcel·les, les concatenem o substituïm
            parcelas: data.parcelas ? [...prev.parcelas, ...data.parcelas].filter((v, i, a) => a.findIndex(t => t.cadastre === v.cadastre) === i) : prev.parcelas
        }));
        setIsAutofilled(true);
        setIaiaAdvice("Ja tinc les dades dels teus papers! Revisa que estiga tot bé i seguim avant. ✨🏺");
        // Si hem extret dades crítiques, podem saltar al pas 1 automàticament
        if (data.nif_nie && step === 0) {
            setTimeout(() => setStep(1), 1000);
        }
    };

    const fillWithDossier = () => {
        setFormData({
            ...formData,
            nombre_razon: 'Fernando Luis Llinares García',
            nif_nie: '21670188W',
            via: 'Avenida de España, 11, 2º',
            poblacion: 'Torremanzanas',
            cp: '03107',
            telefono: '635082813',
            entidad: 'Banco Sabadell',
            iban: 'ES6200811336710006675580',
            parcelas: [
                {
                    provincia: 'Alicante',
                    municipio: 'Torremanzanas',
                    poligono: '2',
                    parcela: '31',
                    cadastre: '03132A002000310000TZ'
                }
            ],
            autoriza_aeat: true,
            autoriza_atv: true,
            autoriza_identidad: true,
            declara_no_recuperacion: true,
            declara_informado: true,
            declara_pyme: true
        });
        setIsAutofilled(true);
        setIaiaAdvice("Ja t'ho he omplit tot amb les dades de Nando! Revisa que l'IBAN i l'Apartat H estiguen bé i avant! ✨🏺");
    };

    const handleDownload = () => {
        window.open('/documents/oficials/F97933_NANDO_FINAL.pdf', '_blank');
    };

    const handleDownloadAnnex = () => {
        window.open('/documents/oficials/F3921_NANDO_FINAL.pdf', '_blank');
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const addParcela = () => {
        setFormData({
            ...formData,
            parcelas: [...formData.parcelas, { provincia: 'Alicante', municipio: '', poligono: '', parcela: '', cadastre: '' }]
        });
    };

    const updateAdvice = (field) => {
        const adviceMap = {
            iban: "L'IBAN és el codi del teu compte. Recorda demanar el 'Certificat de Titularitat' al banc, o baixa'l de l'App!",
            parcelas: "L'Apartat H és on posem les terres. Si t'has passat per l'ajuntament, tindràs el full del Cadastre amb el % de propietat.",
            autoriza: "Marca-ho tot en l'Apartat D (Autoritzacions) i no t'oposes a res. Així la Generalitat ho mira tot i et deixa en pau.",
            declaracions: "En l'Apartat G s'ha de marcar tot: declara que no tens altres ajudes i que ets de PIME. Imprescindible!"
        };
        if (adviceMap[field]) setIaiaAdvice(adviceMap[field]);
    };

    return (
        <div className="xylella-form-container animate-in">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate('/ofici')}>
                    <Lucide.ChevronLeft size={24} />
                </button>
                <div className="form-title">
                    <h1>Ayudes Xylella Fastidiosa</h1>
                    <div className="official-badge">SOL·LICITUD D'AJUDES - 18932</div>
                </div>
                <button
                    className={`autofill-sparkle-btn ${isAutofilled ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        fillWithDossier();
                    }}
                    title="Auto-emplenat Màgic (Dossier Nando)"
                    type="button"
                >
                    <Lucide.Wand2 size={24} />
                </button>
            </header>

            <div className="form-iaia-assistant">
                <div className="iaia-avatar-wrapper">
                    <div className="iaia-glow" />
                    <Lucide.Bot size={24} />
                </div>
                <div className="iaia-bubble">
                    <p>{iaiaAdvice}</p>
                </div>
            </div>

            <div className="form-stepper">
                {[0, 1, 2, 3, 4, 5].map(s => (
                    <React.Fragment key={s}>
                        <div className={`step-dot ${step >= s ? 'active' : ''}`} />
                        {s < 5 && <div className={`step-line ${step > s ? 'active' : ''}`} />}
                    </React.Fragment>
                ))}
            </div>

            <div className="form-content-card">
                {step === 0 && (
                    <section className="form-step-view animate-slide-up">
                        <PersonalVault
                            procedureId="xylella-18932"
                            onDataExtracted={handleVaultData}
                        />
                        <div className="form-actions-row">
                            <div />
                            <button className="btn-primary" onClick={handleNext}>
                                ENTRAR AL FORMULARI <Lucide.ArrowRight size={18} />
                            </button>
                        </div>
                    </section>
                )}

                {step === 1 && (
                    <section className="form-step-view animate-slide-up">
                        <div className="step-title">
                            <Lucide.User size={20} />
                            <h2>Sol·licitant i Notificacions</h2>
                        </div>

                        <div className="input-group">
                            <label>Apellidos y Nombre / Razón Social</label>
                            <input
                                type="text"
                                value={formData.nombre_razon}
                                onChange={(e) => setFormData({ ...formData, nombre_razon: e.target.value })}
                            />
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>NIF / NIE</label>
                                <input
                                    type="text"
                                    placeholder="00000000X"
                                    value={formData.nif_nie}
                                    onChange={(e) => setFormData({ ...formData, nif_nie: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Província</label>
                                <input type="text" value={formData.provincia} readOnly />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Domicili (Via, Núm, Pis)</label>
                            <input
                                type="text"
                                value={formData.via}
                                onChange={(e) => setFormData({ ...formData, via: e.target.value })}
                            />
                        </div>

                        <div className="input-row grid-3">
                            <div className="input-group span-2">
                                <label>Població</label>
                                <input
                                    type="text"
                                    value={formData.poblacion}
                                    onChange={(e) => setFormData({ ...formData, poblacion: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>CP</label>
                                <input
                                    type="text"
                                    value={formData.cp}
                                    onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
                                />
                            </div>
                        </div>

                        <button className="btn-primary full-width" onClick={handleNext}> Següent: Autoritzacions </button>
                    </section>
                )}

                {step === 2 && (
                    <section className="form-step-view animate-slide-up">
                        <div className="step-title">
                            <Lucide.Shield size={20} />
                            <h2>Consultes i Autoritzacions (D)</h2>
                        </div>

                        <div className="checkbox-list" onMouseEnter={() => updateAdvice('autoriza')}>
                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={formData.autoriza_aeat}
                                    onChange={(e) => setFormData({ ...formData, autoriza_aeat: e.target.checked })}
                                />
                                <span>Autoritze la consulta de deutes amb l'Agència Tributària Estatal.</span>
                            </label>
                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={formData.autoriza_atv}
                                    onChange={(e) => setFormData({ ...formData, autoriza_atv: e.target.checked })}
                                />
                                <span>Autoritze la consulta amb l'Agència Tributària Valenciana.</span>
                            </label>
                            <label className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={formData.autoriza_identidad}
                                    onChange={(e) => setFormData({ ...formData, autoriza_identidad: e.target.checked })}
                                />
                                <span>Autoritze la consulta de dades d'identitat (NIF/NIE).</span>
                            </label>
                        </div>

                        <div className="form-actions-row">
                            <button className="btn-outline" onClick={handlePrev}> Tornar </button>
                            <button className="btn-primary" onClick={handleNext}> Següent: Banc </button>
                        </div>
                    </section>
                )}

                {step === 3 && (
                    <section className="form-step-view animate-slide-up">
                        <div className="step-title">
                            <Lucide.Landmark size={20} />
                            <h2>Dades Bancàries (E)</h2>
                        </div>

                        <div className="input-group">
                            <label>IBAN (Número de compte)</label>
                            <input
                                type="text"
                                value={formData.iban}
                                onFocus={() => updateAdvice('iban')}
                                onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase().replace(/\s/g, '') })}
                            />
                        </div>

                        <div className="form-actions-row">
                            <button className="btn-outline" onClick={handlePrev}> Tornar </button>
                            <button className="btn-primary" onClick={handleNext}> Següent: Parcel·les </button>
                        </div>
                    </section>
                )}

                {step === 4 && (
                    <section className="form-step-view animate-slide-up">
                        <div className="step-title" onMouseEnter={() => updateAdvice('parcelas')}>
                            <Lucide.Sprout size={20} />
                            <h2>Relació de Parcel·les (H)</h2>
                        </div>

                        <div className="parcela-list">
                            {formData.parcelas.map((p, index) => (
                                <div key={index} className="parcela-item-card">
                                    <div className="input-row grid-3">
                                        <div className="input-group span-2">
                                            <label>Terme Municipal</label>
                                            <input
                                                type="text"
                                                value={p.municipio}
                                                onChange={(e) => {
                                                    const newParcelas = [...formData.parcelas];
                                                    newParcelas[index].municipio = e.target.value;
                                                    setFormData({ ...formData, parcelas: newParcelas });
                                                }}
                                                placeholder="Ej: Alcalalí"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Polígon</label>
                                            <input
                                                type="text"
                                                value={p.poligono}
                                                onChange={(e) => {
                                                    const newParcelas = [...formData.parcelas];
                                                    newParcelas[index].poligono = e.target.value;
                                                    setFormData({ ...formData, parcelas: newParcelas });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>Parcel·la</label>
                                            <input
                                                type="text"
                                                value={p.parcela}
                                                onChange={(e) => {
                                                    const newParcelas = [...formData.parcelas];
                                                    newParcelas[index].parcela = e.target.value;
                                                    setFormData({ ...formData, parcelas: newParcelas });
                                                }}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Ref. Cadastral</label>
                                            <input
                                                type="text"
                                                value={p.cadastre}
                                                onChange={(e) => {
                                                    const newParcelas = [...formData.parcelas];
                                                    newParcelas[index].cadastre = e.target.value;
                                                    setFormData({ ...formData, parcelas: newParcelas });
                                                }}
                                                placeholder="18-20 caràcters"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn-add-parcela" onClick={addParcela}>
                            + Afegir una altra parcel·la
                        </button>

                        <div className="form-actions-row">
                            <button className="btn-outline" onClick={handlePrev}> Tornar </button>
                            <button className="btn-primary" onClick={handleNext}> Finalitzar </button>
                        </div>
                    </section>
                )}

                {step === 5 && (
                    <section className="form-step-view animate-slide-up text-center">
                        <div className="success-icon-wrapper">
                            <Lucide.CheckCircle2 size={64} color="var(--accent-green)" />
                        </div>
                        <h2>Sol·licitud Enllestida!</h2>
                        <p className="final-desc">He generat el model de sol·licitud oficial amb totes les dades. Pots descarregar-lo o guardar-lo al Mas.</p>

                        <div className="final-actions-vertical">
                            <div className="technical-contacts-card">
                                <h3>📞 Contactes Tècnics (Tragsa)</h3>
                                <p><strong>Heber Martínez:</strong> 610 57 10 15</p>
                                <p><strong>Juan Bta. Biosca:</strong> 610 57 15 35</p>
                                <p className="destinacio-hint">Destinar a: 10SVSAV Servei de Sanitat Vegetal (Silla)</p>
                            </div>
                            
                            <div className="official-download-zone">
                                <button className="btn-official-giant" onClick={handleDownload}>
                                    <Lucide.FileText size={28} />
                                    <div className="btn-text-wrapper">
                                        <span className="btn-main-text">IMPRIMIR SOL·LICITUD</span>
                                        <span className="btn-sub-text">MODEL OFICIAL F97933</span>
                                    </div>
                                </button>

                                <button className="btn-official-giant secondary" onClick={handleDownloadAnnex}>
                                    <Lucide.Landmark size={28} />
                                    <div className="btn-text-wrapper">
                                        <span className="btn-main-text">ANNEX BANCARI</span>
                                        <span className="btn-sub-text">MODEL OFICIAL F3921</span>
                                    </div>
                                </button>
                            </div>

                            <button className="btn-outline-minimal" onClick={() => navigate('/ofici')}>
                                <Lucide.ArrowLeft size={16} /> Tornar a l'Ofici
                            </button>
                        </div>
                    </section>
                )}
            </div>

            <p className="form-footer-hint">
                <Lucide.HelpCircle size={14} />
                Aquest formulari és un model d'ajuda. El registre oficial s'ha de fer a la seu de la Generalitat.
            </p>
        </div>
    );
};

export default XylellaFastidiosaForm;
