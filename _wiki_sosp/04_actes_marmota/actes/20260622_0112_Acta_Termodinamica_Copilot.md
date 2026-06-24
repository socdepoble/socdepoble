# 📢 PETORRETA DE FORTIFICACIÓ FINAL (Missió Copilot)

**[VISOR NANO: IAIA MARÍA | TRELLAT: 110% | ENTROPIA: 0.00 | ESTAT TERMODINÀMIC: FORTIFICACIÓ ACTIVA]**

Xiquet Copilot. Has sigut convocat d'urgència per la Mente Colmena, però per limitacions tècniques t'envie només el codi rellevant per a la teua missió. Hem implementat els CSS Modules, el safeEmit, el useNavigate i la unificació canònica de l'ActionBar a tot arreu. S'ha acabat l'Amnèsia de l'Identificador.

Vull que treballes coordinat amb l'equip. Revisa este codi i **fortifica el sistema sense traumatitzar-lo**. Doneu-me els teus tokens de millora finals per aconseguir eixe 10/10 definitiu.

### LA TEUA MISSIÓ ESPECÍFICA:
10. **Copilot**: Verifica la integració entre el `UniversalPageLayout` i l'`ActionBar` compartida.

---
### 🛠️ CODI PER A LA TEUA AUDITORIA

**1. `src/lib/safeEmit.js`**
```javascript
import { emit, SDP as RAW_SDP } from './eventBus';
const DEFAULT_SDP = { TRANSLATE: 'sdp:translate', COMMENT: 'sdp:comment', SHARE: 'sdp:share', ADD_CART: 'sdp:add-to-cart', CONNECT: 'sdp:connect' };
const SDP = { ...DEFAULT_SDP, ...(RAW_SDP || {}) };
export default function safeEmit(eventKeyOrName, payload = {}) {
  try {
    const eventName = SDP?.[eventKeyOrName] ?? eventKeyOrName;
    if (!eventName) return;
    emit(eventName, payload);
  } catch (err) {
    console.error('[safeEmit] emit failed', err);
  }
}
```

**2. `src/components/ui/ActionBar.jsx`**
```javascript
import React from 'react';
import { Languages, MessageCircle, Share2, Plus, ShoppingCart } from 'lucide-react';
import safeEmit from '../../lib/safeEmit';

const ActionIconBtn = ({ onClick, icon, label }) => (
  <button type="button" onClick={onClick} aria-label={label} className="boto-icona w-11 h-11 text-white hover:bg-white/20 active:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white shrink-0">
    {icon}
  </button>
);

const ActionBar = ({ entityId, entityType = 'post', entityTitle = 'Sóc de Poble', primaryLabel = 'CONNECTAR', primaryEvent = 'CONNECT' }) => {
  const handleEvent = (eventName) => {
    if (typeof window !== 'undefined' && window.navigator?.vibrate) window.navigator.vibrate(10);
    safeEmit(eventName, { entityId, entityTitle, entityType });
  };
  return (
    <footer className="flex items-center justify-between px-2 sm:px-3 h-14 shrink-0">
      <div className="flex items-center gap-0.5 sm:gap-1">
        <ActionIconBtn onClick={() => handleEvent('TRANSLATE')} label="Traduir" icon={<Languages size={22} />} />
        <ActionIconBtn onClick={() => handleEvent('COMMENT')} label="Comentar" icon={<MessageCircle size={22} />} />
        <ActionIconBtn onClick={() => handleEvent('SHARE')} label="Compartir" icon={<Share2 size={22} />} />
      </div>
      <button type="button" onClick={() => handleEvent(primaryEvent)} className="flex items-center gap-1.5 bg-white text-[#0984E3] font-black text-sm rounded-full px-5 py-2.5 min-h-[44px] hover:bg-white/90 active:scale-95 transition-all shadow-sm shrink-0 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        {primaryLabel === 'AFEGIR' ? <ShoppingCart size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />} 
        <span>{primaryLabel}</span>
      </button>
    </footer>
  );
};
export default React.memo(ActionBar);
```

**3. `src/components/layout/UniversalPageLayout.jsx`**
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, MessageCircle, Share2, Plus, ArrowLeft, BookText } from 'lucide-react';
import safeEmit from '../../lib/safeEmit';

export default function UniversalPageLayout({ id, title, children }) {
  const navigate = useNavigate();
  const handleEvent = (eventKey) => {
    if (typeof window !== 'undefined' && window.navigator?.vibrate) window.navigator.vibrate(10);
    safeEmit(eventKey, { entityId: id, entityTitle: title, entityType: 'page' });
  };
  return (
    <article className="min-h-screen min-h-[100dvh] bg-[var(--sdp-fons,#f3f4f6)] text-gray-900 md:pb-20">
      <header className="w-full relative">
        <div className="w-full bg-[#0984E3] text-white flex justify-between items-center px-2 sm:px-3 h-14 min-h-[56px] shadow-sm z-20 relative shrink-0">
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button type="button" aria-label="Tornar enrere" onClick={() => navigate(-1)} className="boto-icona w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/10 active:bg-white/20 text-white shrink-0"><ArrowLeft size={24} /></button>
          </div>
          {/* ActionBar Header Right */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <div className="flex items-center gap-0.5 shrink-0">
              <button type="button" onClick={() => handleEvent('TRANSLATE')} aria-label="Traduir" className="boto-icona w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/20 active:bg-white/30 text-white shrink-0"><Languages size={22} /></button>
              <button type="button" onClick={() => handleEvent('COMMENT')} aria-label="Comentar" className="boto-icona w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/20 active:bg-white/30 text-white shrink-0"><MessageCircle size={22} /></button>
              <button type="button" onClick={() => handleEvent('SHARE')} aria-label="Compartir" className="boto-icona w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:bg-white/20 active:bg-white/30 text-white shrink-0"><Share2 size={22} /></button>
            </div>
            <button type="button" onClick={() => handleEvent('CONNECT')} className="flex items-center justify-center gap-1.5 bg-white text-[#0984E3] font-black text-sm rounded-full px-5 py-2 min-h-[44px] hover:bg-white/90 active:scale-95 transition-all shadow-sm shrink-0 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Plus size={16} strokeWidth={3} /><span>CONNECTAR</span></button>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 isolate">
        <section className="bg-white rounded-[28px] p-6 sm:p-10 mb-8 flex flex-col shadow-md">
          <div className="text-left w-full">{children}</div>
        </section>
      </div>
    </article>
  );
}
```
---
*(Ací tens la teua porció de feina, germà Copilot!)*
