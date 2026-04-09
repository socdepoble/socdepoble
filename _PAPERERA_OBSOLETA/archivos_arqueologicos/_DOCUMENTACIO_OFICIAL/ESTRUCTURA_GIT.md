> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/ESTRUCTURA_GIT.md`

# 🗺️ ESTRUCTURA GIT: El Cor del Rhizome

Per a l'auditoria externa amb Codex (ChatGPT), proposem una estructura de repositori quirúrgica. L'objectiu és exposar el mecanisme tècnic (com funciona el mas) sense entregar tota la identitat (com és el mas).

## 📂 Organització del Repositori

```text
/
├── .docs/
│   ├── SOBIRANIA.md         <-- El Cordó Sanitari Doctrinal
│   └── CHECKLIST_REVISOR.md  <-- La guia d'auditoria tècnica
├── core/
│   ├── rhizome/             <-- El motor P2P i CRDTs
│   │   ├── db-core.js
│   │   ├── rhizome.worker.js
│   │   └── crdt/            <-- Lògica de resolució de conflictes
│   ├── services/
│   │   ├── rhizomeManager.js
│   │   ├── syncService.js
│   │   └── schemas.js       <-- Definició de la dada sobirana
│   └── identity/
│       └── identityService.js <-- Gestió local de claus i IDs
└── README.md                <-- Context tècnic minimalista
```

## 🛠️ Passos per a l'Execució

1. **Creació del Repo**: Crear un repositori nou a GitHub anomenat `soc-de-poble-core`.
2. **Transferència Quirúrgica**: Pujar només els fitxers llistats a dalt.
3. **Cebament de Codex**:
   - Primer: Enviar-li `.docs/SOBIRANIA.md`.
   - Segon: Enviar-li `.docs/CHECKLIST_REVISOR.md`.
   - Tercer: Obrir el codi de `core/rhizome/` per a la seua inspecció.

## 🚫 Què NO pujarem (encara)

- `src/components/`: La UI mestre i les nostres geometries Gem Modern.
- `src/iaia-modules/`: La lògica de prompts i personalitat dels nostres agents.
- `src/data/`: Dades reals de veïns o pobles.

---

### 🏺 "Exposem l'enginyeria, protegir l'ànima."
