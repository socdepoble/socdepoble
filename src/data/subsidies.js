/**
 * Base de Coneixement d'Ajudes i Subvencions [V1.0]
 * Sintonitzat amb el Protocol Rhizome i el bategat del Comtat.
 */

export const MOCK_SUBSIDIES = [
    {
        id: 'kit-digital-2024',
        title: "Kit Digital: Segment III (Autònoms)",
        amount: "3.000 €",
        sector: "Digitalització",
        deadline: "31/12/2024",
        status: "oberta",
        requirements: [
            "Ser autònom o empresa d'entre 0 i 3 treballadors.",
            "Estar al corrent de les obligacions tributàries i amb la Seguretat Social.",
            "No tindre la consideració d'empresa en crisi."
        ],
        description: "Ajudes directes per a la implementació de solucions digitals: web, RRSS, ciberseguretat, factura electrònica.",
        iaia_advice: "Mestre, aquesta és la que ens interessa! Sollutia ja ens ha validat la memòria, així que el camí està net. Aprofita per a blindar el teu node digital.",
        official_link: "https://www.accelerapyme.gob.es/ca/kit-digital"
    },
    {
        id: 'pac-agricultura-2026',
        title: "Ajudes PAC: Pagament Bàsic per a la Sostenibilitat",
        amount: "Variable (segons hectàrees)",
        sector: "Agricultura",
        deadline: "15/05/2026",
        status: "proximament",
        requirements: [
            "Ser agricultor actiu.",
            "Disposar de drets de pagament bàsic.",
            "Complir les pràctiques de 'Greening' (ecotransició)."
        ],
        description: "Suport directe a la renda dels agricultors per a garantir la viabilitat de les explotacions agràries tradicionals.",
        iaia_advice: "L'Agrònom diu que enguany la burocràcia ve més forta que la plaga de la mosca. Si tens oliveres a La Torre, estigues atent al calendari!",
        official_link: "https://agricultura.gva.es"
    },
    {
        id: 'ivace-energia-2026',
        title: "Bons IVACE: Autoconsum i Emmagatzematge",
        amount: "Fins al 45% de la inversió",
        sector: "Energia",
        deadline: "30/09/2026",
        status: "oberta",
        requirements: [
            "Instal·lació de plaques solars en naus industrials o habitatges.",
            "Auditoria energètica prèvia."
        ],
        description: "Subvencions per a la transició energètica i la reducció de la dependència de la xarxa elèctrica convencional.",
        iaia_advice: "Posa el sol a treballar pel poble! Si vols que la teua botiga bategue amb energia neta, aquest és el teu moment.",
        official_link: "https://www.ivace.es"
    },
    {
        id: 'ajuda-resiliencia-rural',
        title: "Projecte Rhizome: Resiliència Tecnològica Rural",
        amount: "25.000 € (Estudi)",
        sector: "Tecnologia",
        deadline: "Desembre 2026",
        status: "investigacio",
        requirements: [
            "Projectes que fomenten l'economia circular al Comtat.",
            "Ús de tecnologies de sobirania de la dada (DID)."
        ],
        description: "Subvenció especial per a nodes tecnològics que connecten pobles de muntanya mitjançant xarxes P2P.",
        iaia_advice: "Aquesta té el nom de 'Sóc de Poble' gravat a foc! És l'oportunitat ideal per a que el nostre bategat arribe a tota la Vall.",
        official_link: "https://socdepoble.org/subvencions"
    }
];
