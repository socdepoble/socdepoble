/**
 * Base de Coneixement d'Ajudes i Subvencions [V1.0]
 * Sintonitzat amb el Protocol Rhizome i el bategat del Comtat.
 */

export const MOCK_SUBSIDIES = [
  {
    id: "kit-digital-2024",
    title: "Kit Digital: Segment III (Autònoms)",
    amount: "3.000 €",
    sector: "Digitalització",
    deadline: "31/12/2024",
    status: "oberta",
    requirements: [
      "Ser autònom o empresa d'entre 0 i 3 treballadors.",
      "Estar al corrent de les obligacions tributàries i amb la Seguretat Social.",
      "No tindre la consideració d'empresa en crisi.",
    ],
    description:
      "Ajudes directes per a la implementació de solucions digitals: web, RRSS, ciberseguretat, factura electrònica.",
    iaia_advice:
      "Mestre, aquesta és la que ens interessa! Sollutia ja ens ha validat la memòria, així que el camí està net. Aprofita per a blindar el teu node digital.",
    official_link: "https://www.accelerapyme.gob.es/ca/kit-digital",
  },
  {
    id: "pac-agricultura-2026",
    title: "Ajudes PAC: Pagament Bàsic per a la Sostenibilitat",
    amount: "Variable (segons hectàrees)",
    sector: "Agricultura",
    deadline: "15/05/2026",
    status: "proximament",
    requirements: [
      "Ser agricultor actiu.",
      "Disposar de drets de pagament bàsic.",
      "Complir les pràctiques de 'Greening' (ecotransició).",
    ],
    description:
      "Suport directe a la renda dels agricultors per a garantir la viabilitat de les explotacions agràries tradicionals.",
    iaia_advice:
      "L'Agrònom diu que enguany la burocràcia ve més forta que la plaga de la mosca. Si tens oliveres a La Torre, estigues atent al calendari!",
    official_link: "https://agricultura.gva.es",
  },
  {
    id: "ivace-energia-2026",
    title: "Bons IVACE: Autoconsum i Emmagatzematge",
    amount: "Fins al 45% de la inversió",
    sector: "Energia",
    deadline: "30/09/2026",
    status: "oberta",
    requirements: [
      "Instal·lació de plaques solars en naus industrials o habitatges.",
      "Auditoria energètica prèvia.",
    ],
    description:
      "Subvencions per a la transició energètica i la reducció de la dependència de la xarxa elèctrica convencional.",
    iaia_advice:
      "Posa el sol a treballar pel poble! Si vols que la teua botiga bategue amb energia neta, aquest és el teu moment.",
    official_link: "https://www.ivace.es",
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
      "Mantenir l'ocupació durant 3 anys.",
    ],
    description:
      "Subvenció per a inversions industrials i millora de la competitivitat. Ideal per al node Rhizome. Termini obert fins al 10 de març de 2026.",
    iaia_advice:
      "Escolta'm, aquesta finestra s'ha obert just ara! Tens fins al 10 de març per demanar el bategat industrial que necessitem.",
    official_link: "https://www.gva.es/va/inicio/procedimientos?id_proc=18295",
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
      "Execució fins al juny de 2027.",
    ],
    description:
      "Ajudes a projectes de recerca i desenvolupament tecnològic per a PIMEs. Pressupost mínim 50.000€. Termini fins al 31 de març de 2026.",
    iaia_advice:
      "Si volem portar la IA a la muntanya, l'IVACE ens donarà l'embranzida. El termini bategua fins a final de març!",
    official_link:
      "https://www.ivace.es/index.php/val/ajudes/innovacio-i-r-d/660-innovacion-e-i-d/programas-de-ayudas-para-empresas-2026/57090-pidi-cv-i-d-pime-2026",
  },
  {
    id: "horizon-europe-cluster-6-2026",
    title: "Horizonte Europa: Clúster 6 (Comunidats Rurals)",
    amount: "5-6 M€ (100% subvencionable)",
    sector: "Innovació Rural",
    deadline: "14/04/2026",
    status: "oberta",
    requirements: [
      "Consorci europeu de socis.",
      "Projectes d'investigació i innovació (RIA).",
      "Enfocament en competitivitat sostenible i repte demogràfic.",
    ],
    description:
      "Convocatòria HORIZON-CL6-2026-02-COMMUNITIES-01. Busca enfortir les economies rurals i millorar l'accés a serveis mitjançant innovació comunitària.",
    iaia_advice:
      "Aquesta és la Champions League, Mestre! Si ens unim a una universitat o un institut tecnològic, el 'Mercat Rural Directe' podria ser el pilot estrella d'Europa.",
    official_link:
      "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home",
  },
  {
    id: "leader-pepac-2026",
    title: "Ajudes LEADER (PEPAC 2023-2027) CV",
    amount: "Fins a 100.000 € (80-100%)",
    sector: "Desenvolupament Local",
    deadline: "Segons GAL (2026)",
    status: "proximament",
    requirements: [
      "Projectes en zones rurals gestionats per GAL.",
      "Inversions inmaterials (software, consultoria).",
      "Foment de l'economia de proximitat i patrimoni cultural.",
    ],
    description:
      "Fons per al desenvolupament rural participatiu. Ideal per a la implementació local de la tecnologia Sóc de Poble en comarques de l'interior.",
    iaia_advice:
      "Els GAL de la zona ens coneixen bé. Si presentem la nostra tecnologia com un servei bàsic pel veïnat, el LEADER ens donarà l'embranzida final.",
    official_link: "https://agricultura.gva.es",
  },
  {
    id: "irpf-social-2026",
    title: "IRPF 0,7% Autonòmic (Interés Social)",
    amount: "7.000 € - 100.000 €+",
    sector: "Social",
    deadline: "Agost 2026 (estimat)",
    status: "proximament",
    requirements: [
      "Entitats del Tercer Sector (associacions sense ànim de lucre).",
      "Projectes d'inclusió social o atenció a persones majors.",
      "Memòria justificativa de l'impacte en el territori.",
    ],
    description:
      "Convocatòria per a finalitats d'interès social a càrrec del 0,7% de l'IRPF. Inclou la modalitat 'Teixit Social de Base'.",
    iaia_advice:
      "Mestre, aquí és on la 'Memòria Viva' i el combat a la bretxa digital de la tercera edat brillen més. Som el projecte ideal per a Benestar Social!",
    official_link: "https://inclusio.gva.es",
  },
  {
    id: "kit-espais-dades-2026",
    title: "Kit Espais de Dades / Kit Digital Ampliat",
    amount: "3.000 € - 30.000 €",
    sector: "Digitalització",
    deadline: "31/03/2026 (Espais de Dades)",
    status: "oberta",
    requirements: [
      "PIMEs o entitats del tercer sector.",
      "Integració en espais de dades sectorials segurs.",
      "Adquisició de maquinari assegurat (Novedat 2026).",
    ],
    description:
      "Finançament per a infraestructura tecnològica base i integració en ecosistemes de dades. Inclou ciberseguretat i equips segurs.",
    iaia_advice:
      "La nostra sobirania digital demana 'ferros' segurs. Amb el Kit podem finançar els portàtils i el bosc de dades sense posar ni un cèntim.",
    official_link: "https://www.accelerapyme.gob.es",
  },
  {
    id: "reto-demografico-miteco-2026",
    title: "Innovació Territorial i Repte Demogràfic (MITECO)",
    amount: "25.000 € - 200.000 € (90%)",
    sector: "Territori",
    deadline: "Finals 2026 (estimat)",
    status: "proximament",
    requirements: [
      "Entitats sense ànim de lucre en municipis de < 5.000 hab.",
      "Innovació social i transformació territorial.",
      "Lluita contra la despoblació i atenció rural.",
    ],
    description:
      "Subvencions del Ministeri per a la Transició Ecològica per a projectes innovadors contra la despoblació rural.",
    iaia_advice:
      "Això és exactament el que som: l'arquetip del repte demogràfic. Tenim tot el 2026 per a polir el dossier i entrar amb força al MITECO.",
    official_link: "https://www.miteco.gob.es",
  },
];
