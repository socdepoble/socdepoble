/_ 🏺 MÀSTER SNAPSHOT v10.6.0-ESTABLE-MÒBIL
AQUEST FITXER ÉS L'OR EN DRAP. REFERÈNCIA ABSOLUTA PER A LA INTERFÍCIE.
_/

import React, { useState, useMemo } from 'react';
import {
Map,
MessageSquare,
ShoppingBag,
Bell,
Search,
Menu,
X,
Plus,
Moon,
Sun,
Sparkles,
LayoutGrid,
Calendar,
LogOut,
User,
MapPin,
BookOpen,
Cpu,
ShieldCheck,
Database,
Info,
ChevronLeft,
ChevronRight,
Send,
MoreVertical,
Image,
Mic
} from 'lucide-react';

// --- [BACKUP] ARCHITECTURE DOCS (EL MIRALL DIDÀCTIC) ---
// Estat: ESTABLE - v10.6.0
const ARCHITECTURE_DOCS = {
'global': {
title: "🏛️ Arquitectura Estable v10.6",
desc: "Snapshot de seguretat. Sistema responsive blindat.",
points: [
"Mobile First: Lògica de navegació 'Stack' (Llista -> Detall).",
"Escriptori: Lògica 'Split View' (Sidebar | Llista | Panell).",
"Persistència: Capçaleres i Barres d'Eines fixes."
]
},
'sidebar': {
title: "🧭 Barra de Navegació",
desc: "Calaix lateral (Drawer) en mòbil, Fixa en escriptori.",
points: [
"Overlay: En mòbil, el menú enfosqueix el fons per centrar l'atenció.",
"Z-Index Suprem: Garanteix que el menú suri sobre tot el contingut.",
"Identitat: Manté el logo Boxed 'Sóc de Poble'."
]
},
'list': {
title: "💬 Llista de Bategats",
desc: "Nucli de navegació.",
points: [
"Visibilitat Intel·ligent: S'amaga en mòbil quan hi ha un xat obert.",
"Scroll Independent: La llista llisca sense moure la capçalera.",
"Indicadors: Badges i timestamps alineats."
]
},
'chat': {
title: "🗨️ Panell de Conversa",
desc: "Vista completa en mòbil.",
points: [
"Full Screen Mobile: Ocupa el 100% de la pantalla (z-50).",
"Botó Tornar: Essencial per a la navegació en pantalles tàctils.",
"Mode Arquitecte: Accessible sense trencar el flux."
]
}
};

// ... [La resta del codi proporcionat per l'usuari es pot veure a la historial]
