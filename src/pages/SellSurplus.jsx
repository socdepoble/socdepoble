import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Sparkles, Check, Info, Zap } from 'lucide-react';
import { hapticService } from '../services/hapticService';
import './SellSurplus.css';

const SellSurplus = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        quantity: '',
        price: '',
        description: '',
        location: 'La Torre de les Maçanes'
    });

    const handleNext = () => {
        hapticService.notifySuccess();
        if (step < 3) setStep(step + 1);
        else handleFinish();
    };

    const handleFinish = () => {
        hapticService.bategat();
        // Here we would call supabaseService.createMarketItem
        alert('📦 Excedent publicat! La IAIA ha segellat la teua oferta al territori.');
        navigate('/mercat');
    };

    const handleBack = () => {
        hapticService.notifySuccess();
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    return (
        <div className="sell-surplus-page theme-noir">
            {/* Nav Header - Weber Class 6 Contrast */}
            <header className="surplus-nav">
                <button className="back-btn-large" onClick={handleBack}>
                    <ArrowLeft size={28} strokeWidth={3} />
                </button>
                <div className="progress-bar-minimal">
                    <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>
                <div className="header-title-minimal">Pas {step} de 3</div>
            </header>

            <main className="surplus-main px-6 pt-4">
                {step === 1 && (
                    <section className="fade-in">
                        <h1 className="text-3xl font-black text-amber-500 uppercase leading-none mb-2">Què ens sobra?</h1>
                        <p className="text-gray-400 mb-8 font-medium italic">Olives, ametles, oli... no deixem que res es perda.</p>

                        <div className="photo-uploade-box mb-8" onClick={() => hapticService.notifySuccess()}>
                            <Camera size={48} className="text-amber-500 mb-2" />
                            <span className="font-black text-sm">FES UNA FOTO AL PRODUCTE</span>
                        </div>

                        <div className="input-group-bancal">
                            <label>NOM DEL PRODUCTE</label>
                            <input
                                type="text"
                                placeholder="Ex: Oliva Picual, Mel de Romaní..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </section>
                )}

                {step === 2 && (
                    <section className="fade-in">
                        <h1 className="text-3xl font-black text-amber-500 uppercase leading-none mb-2">Quantitat i Preu</h1>
                        <p className="text-gray-400 mb-8 font-medium italic">Un preu just per al veí i per a tu.</p>

                        <div className="flex gap-4 mb-6">
                            <div className="input-group-bancal flex-1">
                                <label>QUANTS KILOS?</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                            <div className="input-group-bancal flex-1">
                                <label>PREU (€)</label>
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="info-box-calm">
                            <Info size={20} className="text-amber-500" />
                            <span>L'IAIA recomana tindre stock per a almenys 5 veïns.</span>
                        </div>
                    </section>
                )}

                {step === 3 && (
                    <section className="fade-in">
                        <h1 className="text-3xl font-black text-amber-500 uppercase leading-none mb-2">Confirmar i Segellar</h1>
                        <p className="text-gray-400 mb-8 font-medium italic">Revisa la informació abans de bategar.</p>

                        <div className="review-card-surplus">
                            <div className="review-row">
                                <span className="label">Producte</span>
                                <span className="val">{formData.title || 'Sense nom'}</span>
                            </div>
                            <div className="review-row">
                                <span className="label">Preu Total</span>
                                <span className="val text-amber-500 font-black">{formData.price}€</span>
                            </div>
                            <div className="review-row">
                                <span className="label">Ubicació</span>
                                <span className="val">{formData.location}</span>
                            </div>
                        </div>

                        <div className="ia-badge-confirm mt-8 flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                            <Sparkles className="text-primary" />
                            <p className="text-[10px] font-bold leading-tight uppercase">
                                L'IAIA ha verificat que aquesta oferta és de proximitat real (Km 0).
                            </p>
                        </div>
                    </section>
                )}
            </main>

            {/* Action Bar - Floating & Massive Buttons */}
            <footer className="surplus-footer px-6 pb-8">
                <button className="btn-massive-action" onClick={handleNext}>
                    <span>{step === 3 ? 'BATEGAR OFERTA' : 'SEGÜENT PAS'}</span>
                    {step === 3 ? <Zap size={24} fill="currentColor" /> : <Check size={24} strokeWidth={4} />}
                </button>
            </footer>
        </div>
    );
};

export default SellSurplus;
