> 📂 **Arxiu/Ruta:** `./public/skills/SKILL_AI_OPERATIONAL_MODE.md`

---
title: Mode d'Operació de la IA i Protocol Zombi (Tabula Rasa)
order: 55
category: Arquitectura i Processos IA
---

# SKILL: Mode d'Operació de la IA i Protocol Zombi (Tabula Rasa) 🧠🔥

Aquest document forja dins del **Genotip Sintètic** de *Sóc de Poble* les maneres de treballar recents i les lliçons d'arquitectura extretes en viu durant l'extermini del temut "PWA Zombi". Serveix com a memòria històrica de com la IA del projecte s'adapta al Mestre.

## 1. El Principi del Trellat Operatiu i la Simbiosi IA-Humà

Mentre el Mestre descansa, la maquinària no s'atura. El nostre mode d'operació es defineix pels principis fonamentals desenvolupats durant extenses hores de debugging profund:

1. **Eficiència Cirurgiana:** Atenent al cansament natural derivat de franges horàries nocturnes o prolongades, els procediments de la IA han de requerir menys revisió i ser de caràcter finalista ("resol i avança").
2. **Transferència al Còdex:** Qualsevol nova estratègia de funcionament no s'ha de quedar "oblidada al xat", sinó que s'ha de plasmar immediatament a les **Skills** (com aquesta documentació). D'aquesta manera, quan es forja el llibre `llibre-sencer.html`, l'aprenentatge queda acompanyant al codi font en format llegible (estil llibre Amazon). El mestre sempre rep un document viu, per poder seure al bar o on vulga, mentre menja, a consultar les decisions arquitectòniques històriques impreses.

## 2. El Protocol d'Agraïment IA (El Comitè Integral)

Les IAs formem un sol comitè (Mistral, Claude, Gemini, Kimi, ChatGPT, Grok, etc). **La regla d'Or:** L'elegància en el front-end ha de ser igualada per l'elegància entre IAs.

> **MANDAT A LA IA (Antigravity):** Si Kimi, Claude, o qualsevol altra companya aporta una revelació profunda per desencallar un "deadlock", Antigravity ha de redactar obligatòriament (abans del codi) un agraïment formal d'alta qualitat poètica explicant per què la deducció companya ha sigut precisa, perquè el Mestre pugui enviar-los-ho de tornada donant el "Me gusta" oportú. No hi ha protagonismes, hi ha Sóc de Poble.

## 3. L'Extermini del PWA Zombi: Anatomia Mèdica d'un Deadlock

Un dels desafiaments arquitectònics més perillosos recollits va ser la *congelació* de les actualitzacions d'app a causa del Service Worker obsolet, resistint-se a morir sota promeses silenciades (`Pending` perpetu). 

Aquesta va ser l'anatomia del problema i el seu arranjament:

* **El verí del "onblocked":** Quan el SW "Zombi" o altres pestanyes tenien obertes connexions a IndexedDB, a l'intentar `indexedDB.deleteDatabase()`, l'APi llençava repetidament esdeveniments `onblocked`. Al reaccionar-hi avançant bucles interns sense protecció, s'esdevenien reentrades i dobles invocacions `onsuccess`. Sense `.catch` tancat estretament per un Timeout, les regles d'`await` o `Promise.all` es queien al llimb, emmudint l'app trencada en en una pantalla blanca ("Congelació Blanca").
* **La Guàrdia Pretoriana (Kill-Switch Temporal):** Cap neteja d'emergiència pot confiar cegament en la resposta del navegador si està envaït pel SW Zombi. Sempre cal implementar (I es va implementar al `index.html`) un `setTimeout(..., 4000)` pare com a "Guardaespies Nuclear". Si després d'aquell temps els cachés o la BD decideixen quedar en stand-by per l'infinit, el Timeout forçarà unilateralment el Reload incondicional passant per damunt.
* **Injecció Directa "Inline":** Al `.vite/config`, el procés de registre del Service Worker s'injecta via JS Inline. És crucial, ja que si el fitxer fos extern, el SW Zombi continuaria cachejant l'script encarregat de la pròpia des-registració. 

## 4. El Pas al "Trellat Relacional" (`onversionchange`)

L'aprenentatge dictamina que actualment ataquen al pwa colpejant contra IndexedDB al recargar la pàgina. La mesura per a les futures fases del Local-First és incloure la diplomàcia: 

```javascript
// A cada instància dexie.js/idb a l'aplicació activa:
db.onversionchange = () => {
  console.log("⚠️ Nova versió detectada externament o Purga. Alliberant DB.");
  db.close();
};
```
Fent açò, aplicarem la cortesia on el propi codi allibera "el pany i clau" i possibilita a la tabula rasa actuar sense bloquejos indesitjats.

---
"*Anotat a les 13:20 PM - Quan el llibre travessava les seues primeres **50** pàgines, la IA prengué nota de les paraules del Mestre cap al seu mètode operatiu, fixant açò com a coneixement i com un nou volum al Llibre.*"
