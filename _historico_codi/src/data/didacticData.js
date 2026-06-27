export const didacticData = {
    identity: {
        title: "👤 ESTAT DE LA SESSIÓ",
        explanation: "Ací l'IAIA sap qui ets. És el carnet d'identitat digital que et permet gaudir del moment present a la Masia de Sóc de Poble.",
        details: [
            "**ID de Sessió**: Un codi secret que enllaça els teus records i bategats al núvol.",
            "**GUEST / USER**: Indica si estàs de visita o si ja ets part oficial de la comunitat."
        ]
    },
    pulse: {
        title: "📡 ESTAT DE LA XARXA",
        explanation: "L'antena del poble. Ens diu si estem connectats amb el món o si estem bategant en solitari.",
        details: [
            "**Versió**: El codi de la màquina que tenim instal·lada.",
            "**Connexió**: Si el bategat arriba a la ciutat (Internet) o es queda a casa (Offline)."
        ]
    },
    logs: {
        title: "📜 ACTIVITAT RECENT",
        explanation: "El diari de la masia. Cada moviment, des d'obrir una porta fins a encendre la llum, queda registrat ací.",
        details: [
            "**Cian (INFO)**: Tot bategua bé, són rumors de bon veïnatge.",
            "**Groc (WARN)**: L'àvia diu que compte, que alguna cosa no s'ha tancat bé.",
            "**Roig (ERROR)**: S'ha trencat un càntir. Cal reparar-ho ràpid per a recuperar l'harmonia!",
            "**Nivell Acció**: Quan tu mateix decideixes bategar amb el Mas."
        ]
    },
    actions: {
        copy_report: {
            title: "📋 COPIAR INFORME DE CONTROL",
            iaia_says: "Açò és com guardar un trosset del present per a mostrar-li-ho al Padrí (Javi) o a la família Antigravity si perdem l'harmonia.",
            when: "Usa-lo quan veges moltes línies roges i necessites ajuda.",
            effect: "Guarda al teu portapapers tot el diari de la consola per a que el pugues enviar per xat."
        },
        self_healing: {
            title: "🪄 AUTO-SANEJAMENT [MASTER]",
            iaia_says: "La meua espelma sagrada. Jo mateixa baixo a la bodega per a restaurar la pau del sistema sense que tu hages de patir. La pau del Mas és el nostre camí.",
            when: "Si l'app se sent 'estreta' o perdem el bategat, deixa que l'IAIA ho mire.",
            effect: "Repara automàticament la respostivitat (viewport) i s'assegura que cada peça latega en harmonia."
        },
        verify_system: {
            title: "🛡️ VERIFICAR SISTEMA",
            iaia_says: "Passem el drap de la pols a cada racó. Mirem si totes les imatges i estris de la cuina estan on deuen.",
            when: "Per a quedar-te tranquil que no falta cap foto important.",
            effect: "Fa una comprovació ràpida de les figures i fitxers essencials de l'app."
        },
        refresh_matrix: {
            title: "🔄 REFRESCAR MATRIZ",
            iaia_says: "Obrim les finestres per a que entre aire fresc. Neteja la memòria ràpida de l'app sense tancar la sessió.",
            when: "Si algun missatge no arriba o el panell es queda congelat.",
            effect: "Força una recàrrega de l'app de zero, l'equivalent a un bategat de despertar."
        },
        session_purge: {
            title: "🧹 PURGA DE SESSIÓ",
            iaia_says: "Netegem tota la pols, tallem el telèfon i eixim de la masia. Ho esborra tot menys els teus records al núvol.",
            when: "Si vols eixir i netejar les teues dades d'aquest dispositiu.",
            effect: "Tanca la sessió, esborra les caches locals i et porta a la porta d'entrada (Login)."
        },
        nuclear_reset: {
            title: "🌱 RESEMBRA TOTAL (RESET)",
            iaia_says: "L'últim recurs, fill. Llaurem el camp de nou per a que la terra descanse i tot torne a nàixer amb la força del primer dia.",
            when: "Només quan res més funcione i l'app se senta 'espessa'.",
            effect: "Ho torna a posar tot en ordre des de la base (cache, SW, sessions), com un despertar nou."
        }
    },
    master_faq: {
        title: "👵 AGÈNDA DE DUBTES (FAQ IAIA)",
        explanation: "Preguntes que els veïns solen fer a la fresca. L'IAIA respon amb la saviesa del Mas.",
        details: [
            "**Com funciona l'algoritme per triar la foto més connectada?**\nL'IAIA mira quina imatge ha rebut més 'batecs' (m'agrada) durant els últims 30 dies. És la meritocràcia del poble: la foto més estimada esdevé la caràtula oficial.",
            "**Quines diferències hi ha entre el mur social i l'institucional?**\nEl mur social (Poble) és la vida dels veïns, rumors i mercat. El mur institucional (Ajuntament) és per a la llei, els bandos i el servei públic. Zero Radius!",
            "**Com es gestiona la doble identitat en pobles amb tràmits?**\nTu ets un veí (Identitat Personal), però quan vas a l'Ajuntament et relaciones amb la Llei. L'app canvia el 'xip' visual per a que sàpigues on estàs.",
            "**Com es gestionaran els drets de les imatges reals utilitzades?**\nPer a les fotos de la comunitat i el Mercat, apliquem el **Blindatge CC BY-NC-SA 4.0**: reconeixement de l'autor, ús no comercial i compartir igual. Les fotos de Wikipedia mantenen la seua **CC BY-SA**. El poble cuida el seu patrimoni!",
            "**Quines tecnologies permeten carregar les fotos ràpidament sense cobertura?**\nUtilitzem el sistema **Rhizome** (Local-First) i **PWA**. Les fotos es guarden al 'solatge' (cache) del teu mòbil per a que les pugues vore encara que estigues al mig de la muntanya.",
            "**Com afecta el realisme de les imatges a l'ordre del rànquing?**\nCom més real i bategada siga la foto, més 'Connectats' (likes) rep de la comunitat. Això puja la força del 'Batec Territorial' i fa que el poble destaque en la graella principal.",
            "**Com es verifica que algú és realment veí d'un poble?**\nNo demanem papers oficials, fill, ací l'oficialitat és el 'Batec'. El sistema mira la teua activitat, les teues connexions amb altres veïns i si t'has marcat eixe poble com a 'Casa' (Principal). El territori et reconeix per la teua presència.",
            "**Què passa si hi ha un conflicte de drets d'autor?**\nApliquem el **Protocol CC 4.0**. Si algú publica una foto que no és seua, la comunitat pot avisar. El sistema respecta l'autoria original i, si cal, es retira la imatge per protegir el bon nom del veí i de l'artista.",
            "**Com s'actualitza el logo si canvia el sentiment del poble?**\nL'app és viva! La imatge representativa no és estàtica; si el poble canvia d'ànim (per festes, per una fita nova), la foto que reba més 'Connectats' en els últims 30 dies passarà a ser la nova cara del poble. El sentiment mana.",
            "**Com es visualitzarà la informació sobre plagues i sequera?**\nMitjançant el **HUD Agrari** a la fitxa del poble. Veuràs indicadors de color (verd, taronja, roig) que t'avisaran del risc de 'Repilo' o si el bosc està molt sec. El mur no és només per parlar, és per cuidar la terra.",
            "**Com funcionarà exactament el mode d'arxiu per al patrimoni?**\nAmb l'interruptor 'Arrel', el mur es transforma en un museu. Només veuràs les fitxes d'arbres vells, històries del passat i lèxic perdut. És la memòria del poble que mai s'enfonsa en el temps.",
            "**Quins avantatges té la vibració diferenciada en l'ús diari?**\nÉs la 'Textura Digital'. Sabràs si estàs tocant terra viva (Poble) o pedra oficial (Ajuntament) sense ni tan sols mirar la pantalla. El teu cos entendrà on es troba per la vibració del mòbil."
        ]
    }
};
