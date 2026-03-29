import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCommit, ScrollText, CheckCircle2 } from 'lucide-react';
import { Stack } from '../design-system/components/Layout/Stack';
import { Text } from '../design-system/components/Typography/Text';

const Versions = () => {
    const navigate = useNavigate();

    const historicalVersions = [
        {
            version: 'v10.33.16-CANÒNIC',
            date: '29 Març 2026',
            title: 'Operació OMEGA-5 i OMEGA-6: Estabilitat Extrema',
            changes: [
                'Resolució d\'errors de referència (ReferenceError) al ProjectPresentation.',
                'Supressió del mode "Convidat Zombi" i prevenció de Race Conditions en càrrega.',
                'Refactorització del footer de privacitat i llicència Creative Commons (CC BY-SA 4.0).',
                'Integració de la interfície dinàmica amb restauració del Llibre fundacional.'
            ]
        },
        {
            version: 'v10.33.15',
            date: '28 Març 2026',
            title: 'Audit de UI i Integració de MediaViewer',
            changes: [
                'Instauració del disseny "GEM MODERN" amb Noto Sans i 28px de border-radius.',
                'Creació del MediaViewer universal per a carrusels fotogràfics i videos.',
                'Eliminació de variables CSS globals redundants.',
                'Connexió del "Walkie-Talkie" i pipeline d\'àudio amb Gemini.'
            ]
        },
        {
            version: 'v10.33.14',
            date: '27 Març 2026',
            title: 'Arquitectura Universal Grid',
            changes: [
                'Migració del disseny del panell principal al sistema Flex.',
                'Solució d\'errors d\'estat al canvi de pantalles de mòbil a escriptori.'
            ]
        }
    ];

    return (
        <div className="min-h-[100dvh] bg-[var(--bg-app)] text-[var(--text-main)] overflow-y-auto w-full flex flex-col items-center">
            
            <header className="sticky top-0 z-50 bg-[var(--bg-app)]/80 backdrop-blur-md border-b border-[var(--border-master)] px-4 py-4 w-full max-w-3xl flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors genesis-button"
                >
                    <ArrowLeft size={20} />
                    <span className="font-bold text-xs uppercase tracking-widest">Tornar al Poble</span>
                </button>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
                <Stack spacing="xl" alignment="stretch">
                    
                    <Stack spacing="md" alignment="center" className="text-center mb-12 w-full justify-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--theme-accent-primary)]/10 flex items-center justify-center text-[var(--theme-accent-primary)] border border-[var(--theme-accent-primary)]/20 mb-4">
                            <ScrollText size={32} />
                        </div>
                        <Text variant="h1" className="uppercase text-[var(--text-main)] font-black text-center w-full block">
                            REGISTRE HISTÒRIC
                        </Text>
                        <Text variant="h2" className="italic opacity-70 text-center w-full block text-[var(--text-muted)]">
                            Control de Versions · Sóc de Poble
                        </Text>
                    </Stack>

                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-master)] before:to-transparent">
                        
                        {historicalVersions.map((item) => (
                            <div key={item.version} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--theme-accent-primary)] bg-[var(--bg-master)] text-[var(--theme-accent-primary)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <GitCommit size={18} />
                                </div>
                                
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-[var(--border-master)] bg-[var(--bg-master)] shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <Text variant="overline" className="text-[var(--theme-accent-primary)] font-black mb-0">
                                            {item.version}
                                        </Text>
                                        <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{item.date}</span>
                                    </div>
                                    <Text variant="h3" className="mb-4 text-[var(--text-main)] leading-tight">{item.title}</Text>
                                    
                                    <ul className="space-y-3">
                                        {item.changes.map((change, i) => (
                                            <li key={i} className="flex items-start text-sm text-[var(--text-muted)] leading-relaxed">
                                                <CheckCircle2 size={16} className="text-[var(--theme-accent-primary)]/50 mt-0.5 mr-2 shrink-0" />
                                                <span>{change}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                    </div>

                </Stack>
            </main>
        </div>
    );
};

export default Versions;
