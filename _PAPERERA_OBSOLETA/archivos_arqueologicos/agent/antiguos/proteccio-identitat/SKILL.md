> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/agent/antiguos/proteccio-identitat/SKILL.md`

---
description: Seguretat i Reserva d'Identitats Territorials (Gent de...)
---

# 🔰 PROTECCIÓ D'IDENTITAT COMARCAL (Reserva de Noms)

Aquesta és una **Skill de Nucli Lògic i Base de Dades** de Sóc de Poble. Invocada pel Mestre com a salvaguarda arquitectònica.

## 📜 LA LLEI DEL TERRITORI:
En el marc de Sóc de Poble, **l'entitat d'un Poble com a col·lectiu és sagrada, intransferible i orgànica**. Això significa que la plataforma autogenera "places digitals" per als municipis utilitzant les dades públiques de la gent i la seua interacció.

Cap agent, humà, "Veí" ni "Foraster" pot apropiar-se del nom d'un poble o de la seua nomenclatura col·lectiva per a crear el seu perfil, pàgina, o grup d'interés. 

### 🚫 REGLES ESTRICTES DE REGISTRE I VALIDACIÓ:

1. **PROHIBICIÓ DE NOM ABSOLUT:** 
   El nom exacte d'un Poble registrat en la base de dades (ex: *La Torre de les Maçanes*, *Relleu*, *Xixona*, *Penàguila*) està **reservat al 100%**.

2. **PROHIBICIÓ DE GENT DE [POBLE] (PATRÓ DE NOBLESA TERRITORIAL):**
   Els pseudònims del tipus `"Gent de [Nom del Poble]"` (ex: *Gent de La Torre*, *Gent de Relleu*, *Gent d'Alacant*) **formen exclusivament la portada universal** d'aquest poble a Sóc de Poble. 
   - Aquesta pàgina és incontrolable per un sol humà; funciona amb les aportacions creuades de qui tacha la ubicació o recull events locals del municipi.
   - S'ha d'interceptar qualsevol intent de creació humana amb una alerta bloquejant d'UX que indique que aquest nom pertany al Sistema (Memòria Comunitària) i es troba protegit per l'organigrama canònic.
   - Igual de restrictiu per als casos minúscules/majúscules, com ara "GENT DE PEPITA", "gent de muchamel", etc., s'hauran d'avaluar si col·lisionen contra la base de dades local de Pobles.

### 🛡 ACCIONABLES FUTURS QUANT ES CONSTRUEIXA EL REGISTRE D'USUARIS:
- Abans de confirmar cap registre (Formulari, Base de Dades o Supabase Auth), l'algorisme està obligat a comprovar expressament contra un DICIONARI DE POBLES + "Gent de ".
- Si hi ha divergència (com "Gent de Pepita"), i no existeix cap entitat `Poble` anomenada "Pepita", llavors passa, requerint un anàlisi previ per evitar Falsos Positius. Però cas que hi haja coincidència explícita `Gent de Xixona`, s'invalida automàticament.
- **Actuació Front/Backend:** Implementar RegEx o Consultes per descartar ràpidament.
