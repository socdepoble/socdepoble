import { BrainCircuit, CalendarDays, FileText, GalleryVerticalEnd, LandPlot, MapPinned, Newspaper, NotebookPen, Palette, Route, ShieldCheck, ShoppingCart, Waves, MessageSquare, Wifi } from 'lucide-react';

export const SECTION_ORDER = ['xat', 'mur', 'mercat', 'pobles', 'events', 'mapa', 'multimedia', 'notes', 'dispositius', 'projecte', 'constitucio', 'disseny', 'skills', 'ia', 'roadmap', 'legal'];

export const SECTIONS = [
  { id: 'xat', path: '/chats', label: 'Xat', shortLabel: 'Xat', icon: MessageSquare, kind: 'xat' },
  { id: 'mur', path: '/mur', label: 'Mur', shortLabel: 'Mur', icon: Newspaper, kind: 'mur' },
  { id: 'mercat', path: '/mercat', label: 'Mercat', shortLabel: 'Mercat', icon: ShoppingCart, kind: 'market' },
  { id: 'pobles', path: '/pobles', label: 'Pobles', shortLabel: 'Pobles', icon: LandPlot, kind: 'pobles' },
  { id: 'events', path: '/events', label: 'Events', shortLabel: 'Events', icon: CalendarDays, kind: 'events' },
  { id: 'mapa', path: '/mapa', label: 'Mapa', shortLabel: 'Mapa', icon: MapPinned, kind: 'mapa' },
  { id: 'multimedia', path: '/multimedia', label: 'Multimèdia', shortLabel: 'Media', icon: GalleryVerticalEnd, kind: 'multimedia' },
  { id: 'notes', path: '/notes', label: 'Notes', shortLabel: 'Notes', icon: NotebookPen, kind: 'notes' },
  { id: 'dispositius', path: '/dispositius', label: 'Dispositius', shortLabel: 'P2P', icon: Wifi, kind: 'infra' },
  { id: 'projecte', path: '/projecte', label: 'El projecte', shortLabel: 'Proj.', icon: FileText, kind: 'text', pageKey: 'projecte' },
  { id: 'constitucio', path: '/constitucio', label: 'Constitució', shortLabel: 'Lleis', icon: ShieldCheck, kind: 'text', pageKey: 'constitucio' },
  { id: 'disseny', path: '/disseny', label: 'Disseny', shortLabel: 'Disseny', icon: Palette, kind: 'text', pageKey: 'disseny' },
  { id: 'skills', path: '/skills', label: 'Skills', shortLabel: 'Skills', icon: Waves, kind: 'text', pageKey: 'skills' },
  { id: 'ia', path: '/ia', label: "L'ànima de la iaia", shortLabel: 'IAIA', icon: BrainCircuit, kind: 'ia' },
  { id: 'roadmap', path: '/roadmap', label: 'Full de ruta', shortLabel: 'Ruta', icon: Route, kind: 'text', pageKey: 'roadmap' },
  { id: 'legal', path: '/legal', label: 'Legal i privacitat', shortLabel: 'Legal', icon: FileText, kind: 'text', pageKey: 'legal' }
];

export const DEFAULT_SECTION_PATH = '/chats';
