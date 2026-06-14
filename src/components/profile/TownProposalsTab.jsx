import React, { useState } from 'react';
import { Image as ImageIcon, Plus, X, Upload } from 'lucide-react';
import { useTownProposals } from '../../hooks/useTownProposals';
import { supabaseService } from '../../core/services/supabaseService';
import { useAuth } from '../../app/context/AuthContext';
import { UniversalGridWrapper, UniversalGridRow } from '../ui/UniversalGrid';
import UniversalCard from '../ui/universal-card';
import UniversalReactionVote from '../ui/universal-card/UniversalReactionVote';
import { useViewMode } from '../../hooks/useViewMode';
export default function TownProposalsTab({
  entity
}) {
  const {
    user
  } = useAuth();
  const {
    viewMode
  } = useViewMode();
  const townId = entity.raw_town_id || entity.id;
  const {
    proposals,
    loading
  } = useTownProposals(townId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formLema, setFormLema] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');
  const [activeCategory, setActiveCategory] = useState('town_proposal_cover');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return alert("Has d'iniciar sessió per proposar.");
    if (!formDesc && !formPhotoUrl && !formLema && !formAvatarUrl) return alert("Has d'emplenar almenys un camp.");
    setIsSubmitting(true);
    try {
      const createPayload = (category, contentObj, img) => ({
        content: JSON.stringify(contentObj),
        categories: [category],
        town_uuid: townId,
        author_id: user.id,
        author_name: user.user_metadata?.full_name || 'Ciutadà',
        images: img ? JSON.stringify([img]) : null,
        image_url: img || null,
        type: 'post'
      });
      const promises = [];
      if (formLema) promises.push(supabaseService.createPost(createPayload('town_proposal_lema', {
        text: formLema
      }, null)));
      if (formDesc) promises.push(supabaseService.createPost(createPayload('town_proposal_text', {
        text: formDesc
      }, null)));
      if (formPhotoUrl) promises.push(supabaseService.createPost(createPayload('town_proposal_cover', {
        text: "Proposta de Portada"
      }, formPhotoUrl)));
      if (formAvatarUrl) promises.push(supabaseService.createPost(createPayload('town_proposal_avatar', {
        text: "Proposta d'Avatar"
      }, formAvatarUrl)));
      await Promise.all(promises);
      setIsModalOpen(false);
      setFormLema('');
      setFormDesc('');
      setFormPhotoUrl('');
      setFormAvatarUrl('');
      alert("Propostes enviades! Apareixeran a la llista quan es sincronitzen.");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Hi ha hagut un error enviant les propostes.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const getFilteredProposals = () => {
    return proposals.filter(p => p.categories && p.categories.includes(activeCategory));
  };
  if (loading) return <div className='p-6 text-center text-sdp-text-muted font-bold'>Carregant propostes...</div>;
  return (
    <div className="glass-rural p-6 rounded-3xl mx-2 shadow-sm border border-black/5 dark:border-white/5 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border-master pb-4">
          <div>
              <h3 className="font-bold text-theme-text text-xl flex items-center gap-2 leading-none mb-1">
              <ImageIcon size={22} className="text-theme-accent-primary" />
              Identitat del Poble
              </h3>
              <p className='text-sm text-sdp-text-muted'>Tria quin avatar, imatge, lema i text representen millor el teu poble.</p>
          </div>
          <button onClick={() => setIsModalOpen(!isModalOpen)} className="btn-action-primary shrink-0">
            
              {isModalOpen ? <X size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
              {isModalOpen ? 'Cancel·lar' : 'Crear Proposta'}
          </button>
        </div>

        {isModalOpen ? <div className="bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 p-6 animate-in fade-in slide-in-from-top-2 duration-200 mt-4">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-[#FF6D23]/10 border border-[#FF6D23]/30 rounded-xl p-4 mb-4">
                    <p className="text-sm font-medium text-[#FF6D23]">
                        Ara pots proposar elements de forma independent. Omple només allò que vulgues millorar. Cada camp s'enviarà i es votarà per separat!
                    </p>
                </div>

                <div>
                  <label className="block text-sm font-black text-theme-text mb-2 tracking-wide">1. Lema del Poble (Opcional)</label>
                  <input type="text" value={formLema} onChange={e => setFormLema(e.target.value)} placeholder="Ex: El lloc més dolç del món..." className="w-full bg-theme-base border-2 border-border-master rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-theme-accent-primary transition-colors font-medium placeholder:opacity-40" />
              
                </div>
                
                <div>
                  <label className="block text-sm font-black text-theme-text mb-2 tracking-wide">2. Text de Presentació (Opcional)</label>
                  <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Escriu ací el text de benvinguda..." rows={4} className="w-full bg-theme-base border-2 border-border-master rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-theme-accent-primary transition-colors font-medium resize-none placeholder:opacity-40" />
              
                </div>

                <div>
                  <label className="block text-sm font-black text-theme-text mb-2 tracking-wide">3. Foto de Portada (Opcional)</label>
                  <div className="relative">
                      <div className='absolute left-3 top-1/2 -translate-y-1/2 text-sdp-text-muted'>
                          <Upload size={18} />
                      </div>
                      <input type="url" value={formPhotoUrl} onChange={e => setFormPhotoUrl(e.target.value)} placeholder="https://..." className="w-full bg-theme-base border-2 border-border-master rounded-xl pl-10 pr-4 py-3 text-theme-text focus:outline-none focus:border-theme-accent-primary transition-colors font-medium placeholder:opacity-40" />
                
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-theme-text mb-2 tracking-wide">4. Avatar / Escut (Opcional)</label>
                  <div className="relative">
                      <div className='absolute left-3 top-1/2 -translate-y-1/2 text-sdp-text-muted'>
                          <Upload size={18} />
                      </div>
                      <input type="url" value={formAvatarUrl} onChange={e => setFormAvatarUrl(e.target.value)} placeholder="https://..." className="w-full bg-theme-base border-2 border-border-master rounded-xl pl-10 pr-4 py-3 text-theme-text focus:outline-none focus:border-theme-accent-primary transition-colors font-medium placeholder:opacity-40" />
                
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold px-4 py-3 rounded-xl border-2 border-border-master text-theme-text hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all">
                
                    Cancel·lar
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 font-bold px-4 py-3 rounded-xl bg-theme-text text-theme-base active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                
                    {isSubmitting ? 'Enviant...' : 'Publicar Propostes'}
                  </button>
                </div>
              </form>
          </div> : <div className="space-y-6 mt-4">
            
            {/* CATEGORY SWITCHER */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                <button onClick={() => setActiveCategory('town_proposal_cover')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${activeCategory === 'town_proposal_cover' ? 'bg-theme-text text-theme-base' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'}`}>
              Portada</button>
                <button onClick={() => setActiveCategory('town_proposal_avatar')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${activeCategory === 'town_proposal_avatar' ? 'bg-theme-text text-theme-base' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'}`}>
              Avatar</button>
                <button onClick={() => setActiveCategory('town_proposal_lema')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${activeCategory === 'town_proposal_lema' ? 'bg-theme-text text-theme-base' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'}`}>
              Lema</button>
                <button onClick={() => setActiveCategory('town_proposal_text')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${activeCategory === 'town_proposal_text' ? 'bg-theme-text text-theme-base' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'}`}>
              Text</button>
            </div>

            {getFilteredProposals().length === 0 ? <div className='text-center py-10 text-sdp-text-muted font-medium bg-black/5 dark:bg-white/5 rounded-2xl'>
                    Encara no hi ha cap proposta per a aquesta categoria. Sigues el primer!
                </div> : <UniversalGridWrapper viewMode={viewMode}>
                    <UniversalGridRow viewMode={viewMode} columnCount={viewMode === 'grid' ? 2 : 1}>
                        {getFilteredProposals().map((prop, idx) => {
              const cardItem = {
                ...prop,
                title: prop.contentObj?.text || 'Proposta',
                content: '',
                image_url: prop.image_url,
                metadata: {
                  display_name: prop.author_name || 'Ciutadà'
                }
              };
              return <div key={prop.id} className="relative mt-4">
                                    {idx === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-theme-accent-primary text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                                            ⭐ Guanyadora
                                        </div>}
                                    <UniversalCard item={cardItem} avatarName={prop.author_name || 'Ciutadà Anònim'} title={prop.contentObj?.text || 'Proposta'} subtitle={entity.name} image={prop.image_url} mode="post" variant="post" viewMode={viewMode} className={idx === 0 ? "ring-2 ring-theme-accent-primary" : ""} renderCustomActions={() => <div className="flex justify-end pt-2">
                                                <UniversalReactionVote targetId={prop.id} targetType="post" initialVotes={prop.bategats_count || 0} initialHasVoted={prop.has_voted} authorId={prop.author_id} />
                        
                                            </div>} />
                    
                                </div>;
            })}
                    </UniversalGridRow>
                </UniversalGridWrapper>}
          </div>}
      </div>
  );
}