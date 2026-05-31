import { useTranslation } from 'react-i18next';
import UniversalPage from './UniversalPage';

export const CentroLegal = () => {
    const { t } = useTranslation();

    const htmlContent = `
<!-- HERO_FORMAT: square -->
    <div class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-[2rem] p-8 mb-16 shadow-[0_10px_40px_rgba(99,102,241,0.05)]">
        <h3 class="text-indigo-700 dark:text-indigo-500 uppercase font-black tracking-widest text-[11px] mb-4 flex items-center gap-2">
            Informació Legal i Normativa
        </h3>
        <p class="text-lg text-indigo-900/80 dark:text-gray-300 leading-relaxed m-0 italic font-medium">
            Document unificat de termes d'ús, política de privacitat, protecció de dades (RGPD) i ús de tecnologies d'emmagatzematge local.
        </p>
    </div>

    <!-- 1. AVIS LEGAL -->
    <h2 class="text-3xl md:text-4xl font-black uppercase text-indigo-600 dark:text-indigo-500 border-b-2 border-zinc-200 dark:border-zinc-800/50 pb-4 mb-8 tracking-tight">1. Avís Legal i Dades Identificatives</h2>
    <p class="text-stone-700 dark:text-gray-400 text-lg leading-relaxed mb-4">
        En compliment de la Llei 34/2002, d'11 de juliol, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE), així com la normativa europea (RGPD), s'informa que aquest lloc web i plataforma ('Sóc de Poble') opera sota un model de xarxa local descentralitzada (Local-First).
    </p>
    <p class="text-stone-700 dark:text-gray-400 text-lg leading-relaxed mb-12">
        L'accés i/o ús d'aquest portal atribueix la condició d'USUARI, que accepta, des d'aquest accés i/o ús, les presents Condicions Generals d'Ús. Tots els drets de propietat intel·lectual i industrial de la plataforma i dels seus continguts tècnics estan reservats. 
    </p>

    <!-- 2. POLITICA PRIVACITAT -->
    <h2 class="text-3xl md:text-4xl font-black uppercase text-indigo-600 dark:text-indigo-500 border-b-2 border-zinc-200 dark:border-zinc-800/50 pb-4 mb-8 tracking-tight">2. Política de Privacitat i Seguretat (RGPD)</h2>
    <p class="text-stone-700 dark:text-gray-400 text-lg leading-relaxed mb-4">
        Sóc de Poble compleix de forma estricta amb el Reglament (UE) 2016/679 (RGPD) i amb la Llei Orgànica 3/2018 de Protecció de Dades Personals i garantia dels drets digitals (LOPDGDD). La nostra arquitectura ha estat dissenyada prioritzant la privacitat des de la base (Privacy by Design).
    </p>
    <ul class="list-disc pl-6 text-stone-700 dark:text-gray-400 text-lg leading-relaxed mb-12 space-y-2">
        <li><strong>Emmagatzematge Local (Local-First):</strong> A diferència dels sistemes al núvol tradicionals, les teues dades, memòria cau, i credencials d'identitat (CRDTs) es desen prioritàriament i de forma xifrada al teu propi dispositiu. La plataforma no emmagatzema un perfil publicitari teu en servidors de tercers.</li>
        <li><strong>Finalitat del tractament:</strong> La informació mínima recollida en el registre (com el nom o avatar) s'utilitza exclusivament per a mantenir la connexió P2P (Peer-to-Peer), gestionar la teva identitat autèntica i permetre la interacció i missatgeria a la plataforma.</li>
        <li><strong>Drets ARCO i Oblid Digital:</strong> Com a usuari, tens el dret absolut i inalienable a accedir, rectificar, cancel·lar, oposar-te, i sol·licitar l'oblit complet de les teues dades, atès que tu mateix en tens el control criptogràfic local. Podràs exercir aquests drets directament des del teu panell de configuració o eliminant l'emmagatzematge del navegador.</li>
    </ul>

    <!-- 3. COOKIES -->
    <h2 class="text-3xl md:text-4xl font-black uppercase text-indigo-600 dark:text-indigo-500 border-b-2 border-zinc-200 dark:border-zinc-800/50 pb-4 mb-8 tracking-tight">3. Política de Cookies i Zero-Tracking</h2>
    <p class="text-stone-700 dark:text-gray-400 text-lg leading-relaxed mb-4">
        Aquesta web utilitza tecnologies d'emmagatzematge local (com <em>IndexedDB</em> i <em>localStorage</em>) per garantir que la plataforma pugui funcionar fins i tot sense connexió a internet (offline). Aquestes tecnologies substitueixen l'ús clàssic de cookies de sessió.
    </p>
    <p class="text-stone-700 dark:text-gray-400 text-lg leading-relaxed mb-12">
        <strong>Declaració de Zero-Tracking:</strong> No utilitzem cookies analítiques de tercers, píxels de seguiment comercials, ni cedim perfils de navegació a agències de màrqueting o publicitat. Creiem que el teu rastre digital és completament teu. L'únic rastreig que pot existir s'emmarca en mètriques de rendiment anonimitzades per millorar l'estabilitat del sistema.
    </p>

    <!-- 4. CONDICIONS MERCAT -->
    <h2 class="text-3xl md:text-4xl font-black uppercase text-indigo-600 dark:text-indigo-500 border-b-2 border-zinc-200 dark:border-zinc-800/50 pb-4 mb-8 tracking-tight">4. Termes i Condicions (Transaccions P2P)</h2>
    <p class="text-stone-700 dark:text-gray-400 text-lg leading-relaxed mb-4">
        L'apartat del 'Mercat' funciona com un espai d'Economia Circular. Sóc de Poble actua únicament com a infraestructura tecnològica facilitadora de contacte, i no intervé com a intermediari financer ni logístic directe de les transaccions.
    </p>
    <ul class="list-disc pl-6 text-stone-700 dark:text-gray-400 text-lg leading-relaxed mb-12 space-y-2">
        <li><strong>Obligacions Fiscals:</strong> Cada usuari venedor (ja sigui professional o particular) assumeix l'exclusiva responsabilitat legal i fiscal (IVA, IRPF) de les transaccions que realitzi, aplicant l'impost corresponent (general, reduït, o l'exempció per articles de segona mà) segons marqui la legislació vigent.</li>
        <li><strong>Política de Devolucions:</strong> D'acord amb la Llei de Defensa dels Consumidors, els compradors tenen un dret de desistiment de 14 dies naturals per a productes nous comprats a establiments professionals. Pel que fa als intercanvis de béns usats entre particulars, les garanties i devolucions es regiran pels pactes previs establerts en el xat de negociació, d'acord amb el Codi Civil.</li>
    </ul>
    
    <div class="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-10 mt-16 text-center text-stone-500 dark:text-gray-500 italic">
        <p class="text-lg">Darrera actualització d'aquest document: ${new Date().toLocaleDateString()}</p>
    </div>
    `;

    return (
        <UniversalPage 
            standAlone={true}
            forcedTitle="Legal, Privacitat i Seguretat"
            forcedSubtitle="Política de la Plataforma"
            forcedHtml={htmlContent}
            forcedImages={['/assets/uploads/brain/nano_sultan_lleis_1774215011506.png']}
        />
    );
};
