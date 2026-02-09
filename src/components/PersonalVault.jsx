import React, { useState, useEffect } from 'react';
import { Shield, FileText, Upload, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { docExtractionService } from '../services/docExtractionService';
import { logger } from '../utils/logger';
import './PersonalVault.css';

/**
 * PersonalVault: L'Armari de Papers del Veí. [MASTER]
 * Magatzem sobirà de documents per a l'Ofici de Documentació.
 */
const PersonalVault = ({ onDataExtracted, procedureId }) => {
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [requirements, setRequirements] = useState([]);

    useEffect(() => {
        // Carregar requeriments segons el tràmit
        if (procedureId) {
            setRequirements(docExtractionService.getRequirements(procedureId));
        }
    }, [procedureId]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        logger.log(`[Vault] Pujant document: ${file.name}`);

        // Simulem la pujada i l'extracció
        const extractedData = await docExtractionService.extractFromDocument(file.name);

        const newDoc = {
            id: Date.now(),
            name: file.name,
            type: file.type,
            size: (file.size / 1024).toFixed(2) + ' KB',
            status: Object.keys(extractedData).length > 0 ? 'validat' : 'pendent',
            extractedData
        };

        setDocuments(prev => [...prev, newDoc]);
        setIsUploading(false);

        if (onDataExtracted && Object.keys(extractedData).length > 0) {
            onDataExtracted(extractedData);
        }
    };

    const removeDocument = (id) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    return (
        <div className="personal-vault-container glass-card animate-in">
            <header className="vault-header">
                <div className="vault-title-wrapper">
                    <Shield className="vault-icon" size={24} />
                    <h3>El Teu Vault de Papers</h3>
                </div>
                <p className="vault-subtitle">Documents segurs i sobirans per al teu poble.</p>
            </header>

            <div className="vault-requirements">
                <h4>Requisits del Tràmit:</h4>
                <ul className="requirements-list">
                    {requirements.map(req => (
                        <li key={req.id} className="requirement-item">
                            <span className="req-name">{req.name} {req.required && <span className="req-star">*</span>}</span>
                            <p className="req-desc">{req.description}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="vault-actions">
                <label className="vault-upload-btn">
                    <input type="file" onChange={handleUpload} hidden disabled={isUploading} />
                    {isUploading ? <Sparkles className="animate-spin" size={20} /> : <Upload size={20} />}
                    {isUploading ? 'Analitzant...' : 'Afegir Document al Vault'}
                </label>
            </div>

            <div className="vault-documents-list">
                {documents.length === 0 ? (
                    <div className="vault-empty-state">
                        <FileText size={48} className="opacity-20" />
                        <p>No tens papers encara. Puja el teu DNI o rebut per començar.</p>
                    </div>
                ) : (
                    documents.map(doc => (
                        <div key={doc.id} className="vault-doc-item">
                            <div className="doc-info">
                                <FileText className="doc-type-icon" size={20} />
                                <div className="doc-details">
                                    <span className="doc-name">{doc.name}</span>
                                    <span className="doc-meta">{doc.size} • {doc.status}</span>
                                </div>
                            </div>
                            <div className="doc-status-badge">
                                {doc.status === 'validat' ? (
                                    <CheckCircle2 size={18} className="text-green" />
                                ) : (
                                    <AlertCircle size={18} className="text-yellow" />
                                )}
                            </div>
                            <button className="doc-remove" onClick={() => removeDocument(doc.id)}>
                                <X size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {documents.some(d => d.status === 'validat') && (
                <div className="vault-iaia-advice animate-bounce-in">
                    <Sparkles size={16} className="text-yellow" />
                    <span>L'IAIA ha extret dades de {documents.filter(d => d.status === 'validat').length} documents. El formulari s'està omplint sol!</span>
                </div>
            )}
        </div>
    );
};

export default PersonalVault;
