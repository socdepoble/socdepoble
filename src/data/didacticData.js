export const didacticData = {
    identity: {
        title: "🛡️ Context d'Identitat",
        explanation: "Aquest bloc identifica qui ets per al sistema. L'arquitectura és 'Stateful', el que significa que l'app recorda la teua sessió.",
        details: [
            "**User ID**: El teu codi únic a Supabase. Serveix per enllaçar els teus missatges i preferències.",
            "**Role**: Els teus permisos. 'neighbor' és l'usuari estàndard, 'admin' té accés a aquestes eines."
        ]
    },
    pulse: {
        title: "🫀 Pols del Sistema",
        explanation: "Monitoratge en temps real de la salut de l'app. Sense aquest pols, l'app no sabria si les dades que veus són les darreres.",
        details: [
            "**Route**: La ubicació lògica on t'hi trobes. Cada ruta carrega components diferents per optimitzar memòria.",
            "**SW Version**: La versió del Service Worker. És el nostre 'guardià' que guarda l'app per a que funcione sense internet."
        ]
    },
    logs: {
        title: "📜 Registres Operatius",
        explanation: "Cada moviment que fa el codi deixa una petjada ací. És el 'Diari de Guerra' de l'aplicació.",
        details: [
            "**INFO**: Notificacions nominals (tot va bé).",
            "**WARN**: Avisos de que alguna cosa podria millorar o ha fallat suaument.",
            "**ERROR**: Fallades crítiques que el sistema de resiliència intenta absorbir.",
            "**ACTION**: Una acció manual de l'operador (tu!)."
        ]
    },
    actions: {
        screenshot: "Mode Segur: Pixela o amaga dades per a que pugues compartir fotos sense comprometre la teua privacitat.",
        reload: "Fes un 'reset' ràpid si la interfície es queda 'congelada'.",
        nuclear: "L'últim recurs. Esborra tot el que el navegador sap de l'app i la reinstal·la des del servidor. Ideal si la caché s'ha tornat 'zombie'.",
        globalRepair: "Protocol de Cura Global: Una ordre de Nivell Déu llançada des de l'administració que obliga a tots els clients a purgar la seua memòria i actualitzar-se per a resoldre crisis generalitzades."
    }
};
