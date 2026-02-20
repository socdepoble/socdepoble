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
        id: "rhizome_industrial_2026",
        title: "INPIME 2026: Inversió Industrial (GVA)",
        amount: "Fins al 35%",
        sector: "Indústria",
        deadline: "10/03/2026",
        status: "oberta",
        requirements: [
            "Ser PIME industrial de la Comunitat Valenciana.",
            "Realitzar inversions en actius materials o immaterials.",
            "Mantenir l'ocupació durant 3 anys."
        ],
        description: "Subvenció per a inversions industrials i millora de la competitivitat. Ideal per al node Rhizome. Termini obert fins al 10 de març de 2026.",
        iaia_advice: "Escolta'm, aquesta finestra s'ha obert just ara! Tens fins al 10 de març per demanar el bategat industrial que necessitem.",
        official_link: "https://www.gva.es/va/inicio/procedimientos?id_proc=18295"
    },
    {
        id: "ivace_pidi_2026",
        title: "IVACE PIDI-CV 2026: I+D PIME",
        amount: "Fins a 175.000 €",
        sector: "Tecnologia",
        deadline: "31/03/2026",
        status: "oberta",
        requirements: [
            "Projectes de recerca industrial o desenvolupament experimental.",
            "Pressupost elegible entre 50.000€ i 175.000€.",
            "Execució fins al juny de 2027."
        ],
        description: "Ajudes a projectes de recerca i desenvolupament tecnològic per a PIMEs. Pressupost mínim 50.000€. Termini fins al 31 de març de 2026.",
        iaia_advice: "Si volem portar la IA a la muntanya, l'IVACE ens donarà l'embranzida. El termini bategua fins a final de març!",
        official_link: "https://www.ivace.es/index.php/val/ajudes/innovacio-i-r-d/660-innovacion-e-i-d/programas-de-ayudas-para-empresas-2026/57090-pidi-cv-i-d-pime-2026"
    }
];
