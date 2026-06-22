import { useState, useCallback } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { rhizomeManager } from '../../core/services/rhizomeManager';
import { ipfsManager } from '../../core/services/ipfsManager';
import { logger } from '../../utils/logger';
import { motion } from 'framer-motion';
import { Sparkles, X, Calendar, MapPin, Check } from 'lucide-react';
import TactileButton from '../design/TactileButton';

const CreateEventModal = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    timeStart: '',
    type: 'festa', // festa | recollida | assemblea | mercat
    location: '',
    emoji: '🌾'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setIsSubmitting(true);
    const abortController = new AbortController();
    try {
      const newEvent = {
        id: `event-${crypto.randomUUID()}`,
        title: form.title,
        description: form.description,
        date: form.date,
        timeStart: form.timeStart || null,
        type: form.type,
        location: form.location || 'La Torre de les Maçanes',
        emoji: form.emoji,
        authorId: profile?.id,
        createdAt: Date.now()
      };

      rhizomeManager.yDoc.getArray('events').push([newEvent]);

      const update = rhizomeManager.yDoc.getArray('events').toJSON();
      await ipfsManager.publishCRDTUpdate(update, abortController.signal);
      
      logger.info(`[Event] Nou esdeveniment creat i eternitzat a IPFS: ${newEvent.id}`);
      onClose();
      
      window.dispatchEvent(new CustomEvent('event-created', {
        detail: newEvent
      }));
    } catch (err) {
      if (err.name !== 'AbortError') logger.error('[Event] Error creant esdeveniment:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, profile, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal flex items-end md:items-center justify-center p-0 md:p-4">
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-white w-full max-w-xl mx-0 md:mx-4 mb-0 md:mb-0 rounded-t-[32px] md:rounded-[32px] shadow-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-200 bg-white">
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-gray-900 m-0">
                    <Sparkles className="text-orange-500" /> Crear esdeveniment
                </h2>
                <TactileButton onClick={onClose} aria-label="Tancar" className="text-gray-500 hover:text-gray-900 transition-colors">
                    <X size={28} />
                </TactileButton>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-900 m-0">Què passa al poble?</label>
                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Festa major de taronges" className="w-full px-5 py-5 text-2xl rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none bg-gray-50 text-gray-900 placeholder-gray-400 font-bold transition-all" required aria-required="true" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-gray-900 m-0"><Calendar size={18} /> Dia</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-5 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 text-gray-900 font-bold outline-none transition-all" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-900 m-0">Hora (opcional)</label>
                            <input type="time" value={form.timeStart} onChange={e => setForm({ ...form, timeStart: e.target.value })} className="w-full px-5 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 text-gray-900 font-bold outline-none transition-all" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="flex-1 px-5 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 text-gray-900 font-bold outline-none transition-all appearance-none">
                            <option value="festa">🌾 Festa</option>
                            <option value="recollida">🍊 Recollida</option>
                            <option value="assemblea">🗣️ Assemblea</option>
                            <option value="mercat">🛒 Mercat</option>
                        </select>
                        <input type="text" maxLength={2} value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} className="w-20 text-center text-4xl rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-900 m-0">Més detalls</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Explica’ns una mica més..." className="w-full h-32 px-5 py-5 rounded-3xl resize-none bg-gray-50 border border-transparent focus:border-orange-500 text-gray-900 font-bold outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-gray-900 m-0"><MapPin size={18} /> On?</label>
                        <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Plaça del Poble" className="w-full px-5 py-5 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 text-gray-900 font-bold outline-none transition-all" />
                    </div>

                    <TactileButton type="submit" disabled={isSubmitting} className={`w-full py-7 text-2xl font-black rounded-3xl flex items-center justify-center gap-3 transition-all ${isSubmitting || !form.title || !form.date ? 'bg-gray-200 text-gray-400' : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-sm'}`}>
                        {isSubmitting ? 'Publicant a l’eternitat…' : 'Publicar a la plaça'}
                        <Check size={28} />
                    </TactileButton>
                </form>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default CreateEventModal;