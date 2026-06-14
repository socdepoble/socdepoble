# CONTRIBUTING.md - Ghost Protocol Activation

Benvinguts a l'equip de desenvolupament de *Sóc de Poble*. Com que la nostra app ha d'executar-se ràpid i fluid fins i tot en dispositius lents, seguim un estricte model de qualitat basat en la prevenció de pèrdues de memòria i ineficiències de renderitzat. 

Abans de crear una *Pull Request* o afegir una feature, heu de llegir aquest document i acceptar el seu compliment.

## 📝 EL CHECKLIST DEL DESENVOLUPADOR (Pedra Seca V2)

Cada cop que dissenyeu o modifiqueu un component o "Illa", feu-vos aquestes preguntes:

### 1. Estat i Memòria (Zero God Objects)
- [ ] L'estat utilitzat en aquesta *feature* pertany només a aquesta *feature* i no està enclavat a l'arrel de l'aplicació innecessàriament?
- [ ] He utilitzat selectors atòmics en lloc d'extreure tot l'objecte de l'estat global?
- [ ] He evitat guardar dades efímeres a `Zustand` (ex: variables d'estat per a scroll, interaccions de drag i drop o modals exclusius)?
- [ ] El proveïdor (`Provider`) té un mecanisme per a destruir i netejar el seu estat quan l'usuari surt de la vista? (`store.destroy()`)

### 2. Cicle de Renderitzat (Zero Overhead)
- [ ] He utilitzat `useMemo` o `useCallback` quan pas objectes complexos a sub-components amb `React.memo`?
- [ ] Totes les dependències de `useMemo` o `useCallback` són estables? (No depenen d'objectes massius que es re-creïn)?
- [ ] El component on he afegit l'estat s'actualitza múltiples vegades per segon? (Si és afirmatiu, refactoritzeu-ho a fora de React, utilitzeu referències directes a DOM `useRef()`).

### 3. Rendiment Pur
- [ ] He encès `React DevTools Profiler` durant les meves interaccions i garantit que només repinten les branques que han canviat?
- [ ] Tinc la certesa que cap modificació visual a la UI es tradueix en recàlculs generals per al `LazyHtmlRenderer` o el `AppLayout`?
- [ ] He mesurat les mètriques d'overhead abans i després dels meus canvis?

---

## 🛠 PULL REQUEST TEMPLATE 
Copieu i empleneu això en el missatge de cada PR:

```markdown
## 🔍 Anàlisi de Rendiment (Obligatori)
- **Components afectats:** [Llista dels components principals]
- **Re-renders nous identificats al Profiler:** [Sí/No + Quantitat extra]
- **Memory Leaks o fuites detectats i solucionats:** [Breu descripció o N/A]
- **Proves:** [Afegeix traces del React DevTools si hi ha risc de rendiment]

## ✔️ Checklist
- [ ] Zero God Objects (He segmentat correctament l'estat)
- [ ] Zero Re-renders innecessaris (Ho he passat pel Profiler)
- [ ] Passa ESLint amb 0 warnings
```
