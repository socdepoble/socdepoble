import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Zap, ArrowRight, Info } from 'lucide-react';
import { hapticService } from '../services/hapticService';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import './SellSurplus.css';

const SellSurplus = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        quantity: '',
        price: '',
        description: '',
        town_uuid: profile?.town_uuid || null,
        location: profile?.town_name || 'La Torre de les Maçanes'
    });

    const handleNext = async () => {
        hapticService.notifySuccess();
        if (step < 3) {
            setStep(step + 1);
        } else {
            await handleFinish();
        }
    };

    const handleFinish = async () => {
        if (loading) return;
        setLoading(true);
        try {
            hapticService.bategat();

            const itemData = {
                title: formData.title,
                description: `Quantitat: ${formData.quantity}. ${formData.description || 'Excedent de proximitat.'}`,
                price: parseFloat(formData.price) || 0,
                author_id: user.id,
                author_name: profile.full_name,
                author_avatar_url: profile.avatar_url,
                town_uuid: formData.town_uuid,
                category_slug: 'alimentacio',
                is_active: true
            };

            await supabaseService.createMarketItem(itemData);

            alert('📦 Excedent publicat! La IAIA ha segellat la teua oferta al territori.');
            navigate('/mercat');
        } catch (error) {
            logger.error('[SellSurplus] Error publicant excedent:', error);
            alert('Error al publicar l\'excedent. Revisa les dades.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        hapticService.notifySuccess();
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    return (
        <div className="sell-surplus-container md3-surface">
            <header className="surplus-header-m3">
                <button className="m3-icon-button" onClick={handleBack}>
                    <ChevronLeft size={24} />
                </button>
                <div className="header-text">
                    <h2 className="m3-headline-small">Vendre Excedent</h2>
                    <p className="m3-label-medium">Pas {step} de 3</p>
                </div>
                <div className="step-dots">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`step-dot ${s <= step ? 'active' : ''}`} />
                    ))}
                </div>
            </header>

            <main className="surplus-main-m3 animate-in-up">
                {step === 1 && (
                    <div className="step-content">
                        <div className="m3-card-outlined p-lg">
                            <h3 className="m3-title-large mb-md">Què vols oferir?</h3>
                            <div className="m3-input-group">
                                <label className="m3-label-large">Nom del producte</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Tomates de penjar, Oli nou..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="m3-text-input"
                                />
                            </div>
                            <div className="m3-input-group mt-md">
                                <label className="m3-label-large">Descripció o història</label>
                                <textarea
                                    placeholder="Explica com s'ha cultivat..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="m3-textarea"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <div className="m3-card-outlined p-lg">
                            <h3 className="m3-title-large mb-md">Detalls i Preu</h3>
                            <div className="grid-2-cols gap-md">
                                <div className="m3-input-group">
                                    <label className="m3-label-large">Quantitat</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 5kg, 3 caixes..."
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="m3-text-input"
                                    />
                                </div>
                                <div className="m3-input-group">
                                    <label className="m3-label-large">Preu (€)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="m3-text-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content text-center">
                        <div className="m3-card-tonal p-xl">
                            <div className="m3-icon-container-large mb-md">
                                <Zap size={48} className="text-primary" strokeWidth={1.5} />
                            </div>
                            <h3 className="m3-headline-small mb-sm">Tot a punt!</h3>
                            <p className="m3-body-medium opacity-70">
                                En confirmar, la IAIA publicarà la teua oferta al Mercat de {formData.location}.
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <footer className="surplus-footer-m3">
                <button
                    className={`m3-button-filled ${loading ? 'loading' : ''}`}
                    onClick={handleNext}
                    disabled={loading || (step === 1 && !formData.title)}
                >
                    {loading ? (
                        <div className="md3-progress-indicator-small" />
                    ) : (
                        <>
                            <span>{step === 3 ? 'BATEGAR OFERTA' : 'SEGÜENT'}</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </footer>
        </div>
    );
};

export default SellSurplus;
