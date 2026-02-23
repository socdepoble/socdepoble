import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { ArrowLeft, Landmark, Users, Store, Shield, Check, Camera, Plus } from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import './CreateEntity.css';
import { logger } from '../utils/logger';

const CreateEntity = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'empresa';
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const typeLabels = {
        'grup': { label: 'Grup Social', icon: <Users size={32} />, color: 'groups' },
        'empresa': { label: 'Empresa o Comerç', icon: <Store size={32} />, color: 'business' },
        'institucio': { label: 'Entitat Oficial', icon: <Shield size={32} />, color: 'official' }
    };

    const currentType = typeLabels[type] || typeLabels.empresa;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setIsLoading(true);
            const entity = await supabaseService.createEntity({
                name,
                type,
                description,
                creator_id: user.id
            });
            
            setIsSuccess(true);
            setTimeout(() => {
                navigate(`/entitat/${entity.id}`);
            }, 2000);
        } catch (error) {
            logger.error('Error creating entity:', error);
            alert('Error al crear l\'entitat. Revisa els camps.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <StatusLoader type="loading" message="Cuidant el bategat del nou node..." />;
    if (isSuccess) return <StatusLoader type="success" message={`${currentType.label} creat amb èxit!`} />;

    return (
        <div className="create-entity-page">
            <header className="create-entity-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className={`type-icon-wrap ${currentType.color}`}>
                    {currentType.icon}
                </div>
                <h1>{currentType.label}</h1>
                <p>Configura la teua nova identitat al poble</p>
            </header>

            <form className="create-entity-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <label>Nom de la pàgina</label>
                    <input 
                        type="text" 
                        placeholder="Ex: Sant Gregori, El Rentonar..." 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-section">
                    <label>Descripció (Opcional)</label>
                    <textarea 
                        placeholder="De què tracta aquesta pàgina? Explica el teu impacte al poble."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="avatar-selection-mini">
                    <div className="avatar-placeholder">
                        <Camera size={24} />
                        <span>Puja un logotip</span>
                    </div>
                </div>

                <button type="submit" className="submit-entity-btn" disabled={!name}>
                    <span>BATEGA LA NOVA PÀGINA</span>
                    <Plus size={20} />
                </button>
            </form>
        </div>
    );
};

export default CreateEntity;
