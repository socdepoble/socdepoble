import React from 'react';
import { Globe, Edit2, Save, MapPin, Plus, X, ChevronRight } from 'lucide-react';
import MyEntitiesList from './MyEntitiesList';

const InfoTab = ({
    isEditingCard,
    setIsEditingCard,
    oficiValue,
    setOficiValue,
    userTown,
    setTownEditMode,
    setIsEditingTown,
    secondaryTowns,
    setSecondaryTowns,
    allTowns,
    setEditingSecondaryIdx,
    bioValue,
    setBioValue,
    handleCardSubmit,
    userId,
    navigate
}) => {
    return (
        <div className="tab-pane-fade-in info-pane">
            <section className="profile-edit-section">
                <div className="section-header-compact">
                    <h3>Dades de Veí</h3>
                    <button className="btn-icon-sm" onClick={() => setIsEditingCard(!isEditingCard)}>
                        {isEditingCard ? <Save size={18} /> : <Edit2 size={18} />}
                    </button>
                </div>

                <div className="edit-grid">
                    <div className="field-group">
                        <label htmlFor="ofici-input">Ofici</label>
                        <input
                            id="ofici-input"
                            name="ofici"
                            type="text"
                            value={oficiValue}
                            onChange={(e) => setOficiValue(e.target.value)}
                            disabled={!isEditingCard}
                            placeholder="Estudiant, Fuster, Farmacèutica..."
                        />
                    </div>
                    <div className="field-group">
                        <span className="form-label">Poble Principal</span>
                        <button
                            className={`town-picker-btn ${isEditingCard ? 'active' : ''}`}
                            onClick={() => {
                                if (isEditingCard) {
                                    setTownEditMode('primary');
                                    setIsEditingTown(true);
                                }
                            }}
                            disabled={!isEditingCard}
                        >
                            <MapPin size={16} />
                            <span>{userTown?.name || 'Selecciona el teu poble'}</span>
                        </button>
                    </div>
                    <div className="field-group full-width">
                        <span className="form-label">Pobles de Cor (Secundaris)</span>
                        <div className="secondary-towns-grid">
                            {secondaryTowns.map((tUuid, idx) => {
                                const t = allTowns.find(town => town.uuid === tUuid || town.id === tUuid);
                                return (
                                    <div key={tUuid} className="secondary-town-chip">
                                        <span>{t?.name || 'Carregant...'}</span>
                                        {isEditingCard && (
                                            <button className="remove-secondary" onClick={() => {
                                                const updated = secondaryTowns.filter((_, i) => i !== idx);
                                                setSecondaryTowns(updated);
                                            }}>
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                            {isEditingCard && secondaryTowns.length < 3 && (
                                <button className="add-secondary-btn" onClick={() => {
                                    setTownEditMode('secondary');
                                    setEditingSecondaryIdx(null);
                                    setIsEditingTown(true);
                                }}>
                                    <Plus size={16} /> Afegir Poble
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="field-group full-width">
                        <label htmlFor="bio-input">Frase / Bio</label>
                        <textarea
                            id="bio-input"
                            name="bio"
                            value={bioValue}
                            onChange={(e) => setBioValue(e.target.value)}
                            disabled={!isEditingCard}
                            placeholder="Una frase que et identifique al poble..."
                            rows={2}
                        />
                    </div>
                </div>
                {isEditingCard && (
                    <button className="btn-primary full-width mt-md" onClick={handleCardSubmit}>
                        Guardar Canvis
                    </button>
                )}
            </section>

            <section className="entities-preview-section" style={{ padding: '0 20px 20px' }}>
                <div className="section-header-compact">
                    <h3>Les meues Empreses i Grups</h3>
                </div>
                <MyEntitiesList userId={userId} />
            </section>

            <section className="action-cards-grid">
                <div className="action-card-mini" onClick={() => navigate(`/perfil/${userId}`)}>
                    <div className="card-icon blue"><Globe size={24} /></div>
                    <div className="card-text">
                        <h4>Veure Mur Públic</h4>
                        <p>Com et veuen els altres veïns</p>
                    </div>
                    <ChevronRight size={18} />
                </div>
            </section>
        </div>
    );
};

export default InfoTab;
