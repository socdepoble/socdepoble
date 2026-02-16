import React, { useState, useMemo } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, X } from 'lucide-react';
import { docExtractionService } from '../services/docExtractionService';
import { logger } from '../utils/logger';
import './PersonalVault.css';

/**
 * PersonalVault [PRIVATE DOCUMENT VAULT]
 * Gestiona el processament de documents personals contra requeriments de tràmits.
 */
const PersonalVault = ({ onDataExtracted, procedureId }) => {
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Requeriments derivats (sense estat per evitar renders en cascada)
    const requirements = useMemo(() => {
        return procedureId ? docExtractionService.getRequirements(procedureId) : [];
    }, [procedureId]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await docExtractionService.processDocument(file, requirements);
            const newDoc = {
                id: Date.now().toString(),
                name: file.name,
                type: file.type,
                size: file.size,
                extractedData: result,
                timestamp: new Date().toISOString()
            };
            
            setDocuments(prev => [...prev, newDoc]);
            if (onDataExtracted) onDataExtracted(result);
            logger.log('[PersonalVault] Document processed:', file.name);
        } catch (err) {
            logger.error('[PersonalVault] Error processing document:', err);
            alert('Error processant el document: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeDocument = (id) => {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    return (
        <div className="personal-vault-container p-6 bg-[#0a0a0c] rounded-3xl border border-white/5 shadow-2xl">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white leading-none mb-1">El Meu Rebost de Documents</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Processament Segur</p>
                    </div>
                </div>
                <div className="upload-zone">
                    <input 
                        type="file" 
                        id="vault-upload" 
                        className="hidden" 
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                    <label 
                        htmlFor="vault-upload"
                        className={`flex items-center gap-2 px-6 h-12 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all cursor-pointer ${
                            isUploading ? 'bg-gray-800 text-gray-500' : 'bg-[#FF6B00] text-white hover:bg-orange-600 shadow-lg active:scale-95'
                        }`}
                    >
                        <Upload size={18} />
                        <span>{isUploading ? 'Processant...' : 'Pujar Document'}</span>
                    </label>
                </div>
            </header>

            {requirements && requirements.length > 0 && (
                <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Requeriments del Tràmit</h4>
                    <div className="flex flex-wrap gap-2">
                        {requirements.map((req, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                                <span className="text-xs text-gray-300">{req}</span>
                                <CheckCircle size={14} className="text-emerald-500 opacity-40" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="documents-list space-y-4">
                {documents.length > 0 ? documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{doc.name}</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
                                    {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-500/10">
                                <CheckCircle size={12} />
                                <span>Verificat</span>
                            </div>
                            <button 
                                onClick={() => removeDocument(doc.id)}
                                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-12 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-3xl">
                        <AlertCircle size={48} className="mb-4 text-gray-600" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">No hi ha documents</p>
                    </div>
                )}
            </div>
            
            <footer className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    Seguretat de Ferro • DID-SP Encrypt
                </div>
                <button 
                    onClick={() => setDocuments([])}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                >
                    <X size={14} />
                    <span>Netejar Todo</span>
                </button>
            </footer>
        </div>
    );
};

export default PersonalVault;
