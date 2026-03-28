import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { Stack } from '../design-system/components/Layout/Stack';
import { Text } from '../design-system/components/Typography/Text';

const ProjectPresentation = ({ standAlone = true }) => {
    const navigate = useNavigate();

    const Content = (
        <main className={`max-w-3xl mx-auto px-4 ${standAlone ? 'py-12' : 'py-8'}`}>
                <Stack spacing="xl" alignment="stretch">
                    
                    {/* Títol Principal */}
                    <Stack spacing="md" alignment="center" className="text-center mb-12 w-full justify-center">
                        <Text variant="h1" className="uppercase text-[var(--theme-accent-primary)] font-black text-center w-full block">
                            SÓC DE POBLE
                        </Text>
                        <Text variant="h2" className="italic opacity-90 text-center w-full block">
                            Portal de Pobles Connectats
                        </Text>
                        <Text variant="paragraph" className="font-bold">
                            Una XARXA SOCIAL DESCENTRALITZADA de PROGRAMARI LLIURE, per CONNECTAR i GEOLOCALITZAR recursos d'utilitat social, compartint informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals, per posar en valor els recursos locals i mostrar l'atractiu dels pobles com a llocs on viure i treballar.
                        </Text>
                    </Stack>

                    {/* Infografies (Pur i Dur) */}
                    <Stack spacing="lg" className="border-t border-[var(--border-master)] pt-12">
                        <Stack spacing="sm">
                            <Text variant="h2" className="text-[var(--theme-accent-primary)]">SOBIRANIA DIGITAL</Text>
                            <img src="/assets/infographies/art_sobirania_v1036.png" alt="Sobirania Digital" className="w-full rounded-2xl border border-[var(--border-master)]" />
                            <Text variant="paragraph">La dada com a arrel, no com a mercaderia. En el Mas Digital, tu eres el propietari de la teua informació. Apostem per connexions horitzontals peer-to-peer, eliminant intermediaris extractius i garantint que el bategat del teu poble romanga privat i sobirà.</Text>
                        </Stack>

                        <Stack spacing="sm" className="mt-8">
                            <Text variant="h2" className="text-[var(--theme-accent-primary)]">DADES AMB TRELLAT</Text>
                            <img src="/assets/infographies/art_trellat_v1036.png" alt="Dades amb Trellat" className="w-full rounded-2xl border border-[var(--border-master)]" />
                            <Text variant="paragraph">Privacitat KM 0. Sols recollim allò que és essencial per a la convivència i el comerç local. Les teues dades no viatgen a servidors desconeguts, sinó que s'arrelen en el territori per generar utilitat real i protegir el futur rural.</Text>
                        </Stack>

                        <Stack spacing="sm" className="mt-8">
                            <Text variant="h2" className="text-[var(--theme-accent-primary)]">MEMÒRIA VIVA</Text>
                            <img src="/assets/infographies/art_memoria_v1036.png" alt="Memòria Viva" className="w-full rounded-2xl border border-[var(--border-master)]" />
                            <Text variant="paragraph">Un bategat que uneix generacions a través del codi i la saviesa popular. Garanteix que la intel·ligència artificial no oblide d'on venim. Implementem protocols que dignifiquen el passat mentre construïm el futur digital.</Text>
                        </Stack>
                    </Stack>

                    {/* Llicència Oberta */}
                    <Stack spacing="sm" className="bg-[var(--theme-accent-primary)]/10 p-6 rounded-2xl border border-[var(--theme-accent-primary)]/30 mt-12">
                        <Text variant="h2" className="text-[var(--theme-accent-primary)]">LLICÈNCIA OBERTA</Text>
                        <Text variant="paragraph" className="font-bold">
                            Aquest sistema és de codi obert per a ús comunitari i educatiu. L'ús comercial està subjecte a llicència del Mestre.
                        </Text>
                    </Stack>

                    {/* Identitats del Mas */}
                    <Stack spacing="md" className="border-t border-[var(--border-master)] pt-12">
                        <Text variant="h2">IDENTITATS DEL MAS</Text>
                        <Stack spacing="md">
                            <div>
                                <Text variant="h3" className="mb-0">SÓC DE POBLE</Text>
                                <Text variant="overline" className="mb-1 text-[var(--text-muted)]">PROJECTE SOCIAL</Text>
                                <Text variant="paragraph">Plataforma bategant per a la memòria viva i la governança d'un territori sobirà.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="mb-0">EL RENTONAR</Text>
                                <Text variant="overline" className="mb-1 text-[var(--text-muted)]">AGRUPACIÓ ECOLOGISTA</Text>
                                <Text variant="paragraph">Entitat que promou i empara aquest projecte des de la resistència cultural.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="mb-0">JAVI LLINARES</Text>
                                <Text variant="overline" className="mb-1 text-[var(--text-muted)]">DIRECCIÓ I DISSENY</Text>
                                <Text variant="paragraph">Responsable de la realització, disseny i coordinació. Mestre darrere del Mas Digital.</Text>
                            </div>
                        </Stack>
                    </Stack>

                    {/* La IAIA Maria Manifesto */}
                    <Stack spacing="md" className="border-t border-[var(--border-master)] pt-12">
                        <Text variant="h1" className="text-[var(--theme-accent-primary)]">LA IAIA MARIA</Text>
                        <Text variant="subtitle" className="font-bold border-l-4 border-[var(--theme-accent-primary)] pl-4">
                            La intel·ligència central del Mas. No és una IA freda de Silicon Valley, sinó la "saviesa de l'àvia" arrelada a la terra. Un sistema multi-agent dissenyat per a protegir, educar i preservar la identitat rural.
                        </Text>
                        <Stack spacing="md" className="mt-4">
                            <div>
                                <Text variant="h3" className="m-0">LA TIA MARIA</Text>
                                <Text variant="paragraph">Agent de proximitat. Ofereix receptes locals, consells vitals i conversa arrelada.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">EL CRONISTA</Text>
                                <Text variant="paragraph">Documentalista del Mur. Genera resums de l'activitat del poble i preserva l'hemeroteca.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">L'ULL DEL MESTRE</Text>
                                <Text variant="paragraph">Visió multimodal. Identifica eines agrícoles, plantes, plagues i patrimoni cultural.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">NANO BANANA</Text>
                                <Text variant="paragraph">Generació multimèdia automàtica i protocols de simbiosi artística a la comunitat.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">RÚPER RATÓN</Text>
                                <Text variant="paragraph">Motor de super-cerca semàntica. Analitza PDF, bans municipals i actes històriques.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">FILTRE TRELLAT</Text>
                                <Text variant="paragraph">Triple nucli que regula la presència de la IA per garantir el sentit comú local.</Text>
                            </div>
                        </Stack>
                    </Stack>

                    {/* Arquitectura Tècnica */}
                    <Stack spacing="md" className="border-t border-[var(--border-master)] pt-12">
                        <Text variant="h2">ARQUITECTURA REVOLUCIONÀRIA</Text>
                        <Stack spacing="md">
                            <div>
                                <Text variant="h3" className="m-0 text-[var(--theme-accent-primary)]">Eg-walker CRDT</Text>
                                <Text variant="paragraph">Sincronització de graf d'esdeveniments. Convergència determinista en local que elimina la necessitat de base de dades central.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0 text-[var(--theme-accent-primary)]">Xarxa Rhizome</Text>
                                <Text variant="paragraph">Protocol gossip. Els telèfons dels veïns formen la malla de comunicació, reduint la dependència del núvol al mínim.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0 text-[var(--theme-accent-primary)]">Local-First</Text>
                                <Text variant="paragraph">L'usuari és el propietari de les seues dades. Càrrega instantània des de IndexedDB. Funciona sense cobertura.</Text>
                            </div>
                        </Stack>
                    </Stack>

                    {/* Model de Negoci Híbrid */}
                    <Stack spacing="md" className="border-t border-[var(--border-master)] pt-12">
                        <Text variant="h2">MODEL DE NEGOCI HÍBRID</Text>
                        <Stack spacing="md">
                            <div>
                                <Text variant="h3" className="m-0">"El Secretari" (Model B2G)</Text>
                                <Text variant="paragraph">Subscripció mestre per a Ajuntaments que automatitza la gestió pública rural.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">"Essències" (Model B2B)</Text>
                                <Text variant="paragraph">Monetització de l'economia local sense intermediaris (Km 0).</Text>
                            </div>
                        </Stack>
                    </Stack>

                    {/* Finançament */}
                    <Stack spacing="md" className="border-t border-[var(--border-master)] pt-12">
                        <Text variant="h2">FINANÇAMENT I PATROCINIS</Text>
                        <Text variant="subtitle" className="font-bold">"Sóc de Poble" no ven dades. Bateguem perquè el territori tinga la seua pròpia veu, finançada per la comunitat.</Text>
                        <Stack spacing="md">
                            <div>
                                <Text variant="h3" className="m-0">Clients PRO & Sobirania</Text>
                                <Text variant="paragraph">Subscripcions per a pobles, ajuntaments i entitats que volen governar.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">Patrocini Km 0</Text>
                                <Text variant="paragraph">Empreses del territori que bateguen amb nosaltres. Publicitat ètica.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">Anunciants Ètics</Text>
                                <Text variant="paragraph">Espais reservats per a marques que aporten valor real al món rural.</Text>
                            </div>
                        </Stack>
                    </Stack>

                    {/* Avís Legal */}
                    <Stack spacing="md" className="border-t border-[var(--border-master)] pt-12 pb-24">
                        <Text variant="h2">AVÍS LEGAL I DRETS DIGITALS</Text>
                        <Stack spacing="md">
                            <div>
                                <Text variant="h3" className="m-0">1. Identitat Bategant</Text>
                                <Text variant="paragraph">LSSI-CE: Responsable Sobirà F. Javier Llinares García (21476359V). El Mas Central es troba registrat a la Calle Sant Isidre Llaurador, 16. Connecta via socdepoble@socdepoble.org.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">2. Sobirania de l'Usuari</Text>
                                <Text variant="paragraph">Sols recollim el necessari per al bategat del node: perfil, localització voluntària i memòria social KM 0. Pots descarregar tota la teua memòria digital o fulminar el teu node de forma autònoma enviant un missatge al Mestre. Especialment per als Forasters (Guest Mode), l'experiència és completament efímera: les teues dades desapareixen en eixir del navegador, garantint l'exploració anònima sense rastre cap.</Text>
                            </div>
                            <div>
                                <Text variant="h3" className="m-0">3. Política de Cookies</Text>
                                <Text variant="paragraph">"Ací al poble no ens agrada que ningú ens diga què hem d'anar a comprar. Sóc de Poble no utilitza gats vells de Google ni píxels extractius." Utilitzem cookies lliures i anònraghost-hostalatge.</Text>
                            </div>
                        </Stack>
                    </Stack>

                </Stack>
        </main>
    );

    if (!standAlone) return Content;

    return (
        <div className="min-h-[100dvh] bg-[var(--bg-app)] text-[var(--text-main)] overflow-y-auto w-full">
            <SEO
                title="Sóc de Poble: El Projecte"
                description="Connectant l'Espanya Buidada amb tecnologia d'avantguarda. Visió, Tecnologia i Futur."
                url="/projecte"
            />
            
            {/* Header / Nav Bàsica (Només per a vista independent) */}
            <div className="sticky top-0 w-full bg-[var(--bg-panel)] border-b border-[var(--border-master)] p-4 flex items-center gap-4 z-50">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 border border-[var(--border-master)] rounded-xl hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <Text variant="h3" className="m-0">DOCUMENTACIÓ OFICIAL</Text>
            </div>
            
            {Content}
        </div>
    );
};

export default ProjectPresentation;
