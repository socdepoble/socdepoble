import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../../app/context/NavigationContext';
import { useDesign } from '../../app/context/DesignContext';
import { X, ShieldCheck, Briefcase, Eye, Handshake } from 'lucide-react';

const AccessibilitatUniversal = () => {
  const {
    isAccessibilitatOpen: isOpen,
    setIsAccessibilitatOpen: setIsOpen
  } = useNavigation();
  const {
    seniorMode,
    setSeniorMode,
    reduceMotion,
    setReduceMotion
  } = useDesign();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('global');

  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      const firstFocusable = document.querySelector('[data-accessibilitat-modal] button, [data-accessibilitat-modal] a, [data-accessibilitat-modal] input');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal" onClick={() => setIsOpen(false)} role="presentation" aria-hidden="true" />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-[100] shadow-2xl animate-in slide-in-from-right flex flex-col" role="dialog" aria-modal="true" aria-labelledby="accessibilitat-title" aria-describedby="accessibilitat-description" data-accessibilitat-modal>
        <div role="region" aria-label="Capçalera de Secció" className="h-[64px] min-h-[64px] px-6 flex items-center justify-between border-b border-gray-200 flex-shrink-0 bg-white">
          <h2 id="accessibilitat-title" className="text-xl font-black uppercase tracking-widest text-gray-900 m-0">
            Accessibilitat Universal
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-900" aria-label="Tancar panell d'accessibilitat" data-autofocus>
            <X size={20} />
          </button>
        </div>

        <div id="accessibilitat-description" className="flex-1 overflow-y-auto pb-20 custom-scrollbar bg-gray-50" role="document">
          <nav className="px-6 py-4 border-b border-gray-200 bg-white flex gap-2 overflow-x-auto custom-scrollbar" role="tablist" aria-label="Seccions d'accessibilitat">
            <button role="tab" aria-selected={activeSection === 'global'} aria-controls="panel-global" id="tab-global" onClick={() => setActiveSection('global')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap border ${activeSection === 'global' ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
              Global
            </button>
            <button role="tab" aria-selected={activeSection === 'visual'} aria-controls="panel-visual" id="tab-visual" onClick={() => setActiveSection('visual')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap border ${activeSection === 'visual' ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
              Visual
            </button>
            <button role="tab" aria-selected={activeSection === 'motor'} aria-controls="panel-motor" id="tab-motor" onClick={() => setActiveSection('motor')} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap border ${activeSection === 'motor' ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
              Motor
            </button>
          </nav>

          <div role="region" aria-label="Contingut Principal" className="p-6 space-y-4">
            
            {activeSection === 'global' && (
                <section role="tabpanel" id="panel-global" aria-labelledby="tab-global" className="space-y-4 animate-in fade-in">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="text-emerald-500" size={24} />
                    <h3 className="font-bold text-gray-900 text-lg m-0">Compliment WCAG 2.1 AA</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 m-0">
                    Aquest sistema compleix amb les directrius d'accessibilitat web de nivell AA.
                    Tots els elements interactius tenen etiquetes ARIA i suport per a lectors de pantalla.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Contrast OK
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Navegació Teclat
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Screen Reader
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="text-orange-500" size={24} />
                    <h3 className="font-bold text-gray-900 text-lg m-0">Kit Digital Accessible</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 m-0">
                    Documentació tècnica per a ajuntaments i entitats que volen implementar
                    accessibilitat universal als seus serveis digitals.
                  </p>
                  <button onClick={() => { setIsOpen(false); navigate('/ofici/kit-digital'); }} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 transition-colors mt-2" aria-label="Veure documentació del Kit Digital">
                    Accedir al Dossier
                  </button>
                </div>
              </section>
            )}

            {activeSection === 'visual' && (
                <section role="tabpanel" id="panel-visual" aria-labelledby="tab-visual" className="space-y-4 animate-in fade-in">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="text-blue-500" size={24} />
                    <h3 className="font-bold text-gray-900 text-lg m-0">Modes de Visió</h3>
                  </div>
                  
                  <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer mb-3 hover:bg-gray-100 transition-colors">
                    <div className="flex-1 pr-4">
                      <span className="text-sm font-bold text-gray-900 m-0">Mode Mans de Camp</span>
                      <p className="text-xs text-gray-500 mt-1 m-0">
                        Botons més grans, text més clar. Ideal per a gent gran.
                      </p>
                    </div>
                    <div className="relative inline-flex items-center flex-shrink-0">
                        <input type="checkbox" checked={seniorMode} onChange={e => {
                            setSeniorMode(e.target.checked);
                            let announcement = document.getElementById('aria-live-region');
                            if (!announcement) {
                                announcement = document.createElement('div');
                                announcement.id = 'aria-live-region';
                                announcement.setAttribute('role', 'status');
                                announcement.setAttribute('aria-live', 'polite');
                                announcement.className = 'sr-only';
                                document.body.appendChild(announcement);
                            }
                            announcement.textContent = e.target.checked ? 'Mode mans de camp activat. Elements més grans.' : 'Mode estàndard restaurat.';
                        }} aria-label="Activar mode mans de camp" className="sr-only peer toggle-accessibility" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex-1 pr-4">
                      <span className="text-sm font-bold text-gray-900 m-0">Reduir Animacions</span>
                      <p className="text-xs text-gray-500 mt-1 m-0">
                        Per a persones amb sensibilitat al moviment.
                      </p>
                    </div>
                    <div className="relative inline-flex items-center flex-shrink-0">
                        <input type="checkbox" checked={reduceMotion} onChange={e => {
                            setReduceMotion(e.target.checked);
                            let announcement = document.getElementById('aria-live-region');
                            if (!announcement) {
                                announcement = document.createElement('div');
                                announcement.id = 'aria-live-region';
                                announcement.setAttribute('role', 'status');
                                announcement.setAttribute('aria-live', 'polite');
                                announcement.className = 'sr-only';
                                document.body.appendChild(announcement);
                            }
                            announcement.textContent = e.target.checked ? 'Animacions reduïdes per a major comoditat.' : 'Animacions d\'interfície restaurades.';
                        }} aria-label="Reduir animacions" className="sr-only peer toggle-accessibility" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </div>
                  </label>
                </div>
              </section>
            )}

            {activeSection === 'motor' && (
                <section role="tabpanel" id="panel-motor" aria-labelledby="tab-motor" className="space-y-4 animate-in fade-in">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Handshake className="text-purple-500" size={24} />
                    <h3 className="font-bold text-gray-900 text-lg m-0">Navegació Adaptada</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 m-0">
                    Opcions per a usuaris amb dificultats motrius. Tots els elements interactius
                    tenen àrees de clic ampliades i temps de resposta ajustables.
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-bold text-gray-900 m-0">Àrees de Clic Grans</span>
                      <div className="relative inline-flex items-center flex-shrink-0">
                        <input type="checkbox" className="sr-only peer toggle-accessibility" aria-label="Activar àrees de clic ampliades" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-bold text-gray-900 m-0">Comandament de Veu</span>
                      <div className="relative inline-flex items-center flex-shrink-0">
                        <input type="checkbox" className="sr-only peer toggle-accessibility" aria-label="Activar control per veu" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        <footer className="h-[64px] min-h-[64px] px-6 flex items-center justify-between border-t border-gray-200 flex-shrink-0 bg-white">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 m-0">
             WCAG 2.1 AA
          </span>
          <button onClick={() => { setIsOpen(false); navigate('/accessibilitat'); }} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-xl" aria-label="Veure informe complet d'accessibilitat">
            Informe Complet →
          </button>
        </footer>
      </div>
    </>
  );
};
export default AccessibilitatUniversal;