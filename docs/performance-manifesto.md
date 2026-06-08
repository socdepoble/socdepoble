# ⚖️ `performance-manifesto.md` — MANIFEST DE RENDIMENT I AUDITORIA
*Document oficial · Versió 1.0 · Sóc de Poble*

> **Objectiu**: Garantir 60 FPS en iPad A10 i funcionament sense connexió. Qualsevol canvi que incomplisca aquestes lleis serà rebutjat automàticament.

---

## 1. LLEIS TERMODINÀMIQUES DE L'IPAD A10

### ❌ PROHIBICIONS ABSOLUTES
1. **Cap `backdrop-blur`**: Consumeix fins al 40% de la GPU.
2. **Sense ombres complexes**: `box-shadow` només amb valors petits i suaus.
3. **Estructures imbricades**: Màxim 3 nivells de `div`.
4. **`position: fixed` dins scroll**: Provoca salts i càlculs continus.
5. **`calc()` complexos**: Màxim dues operacions.
6. **Re-renders globals**: Cap estat al Context que afecte tota l'aplicació (ex: Mode Lupa fora de React).
7. **Lectura directa del viewport**: Prohibit usar `window.innerWidth`, `window.innerHeight` o propietats geomètriques síncrones (`clientWidth`) als components de React. Tota adaptació a la pantalla s'ha de resoldre exclusivament per CSS (`100dvh`, `vw`, `max()`, `min()`) per evitar forçar càlculs de layout.

### ✅ OBLIGACIONS DE RENDIMENT
1. **Acceleració GPU**: Elements interactius han de portar `transform: translateZ(0);` o `will-change: transform;`.
2. **Debounce**: Tota acció d'usuari (escriptura, canvi de mida) té retard de 150-200ms.
3. **Llistes virtualitzades**:
   - Ús de `Windowing` amb `IntersectionObserver`.
   - Renderitzar només el que es veu + 5 elements amunt/avall.
   - **Separació**: `gap` sempre en lloc de `margin` per a evitar col·lapses d'alçada.
4. **Imatges**: `loading="lazy"`, format WebP, mida adequada per a iPad.

---

## 2. GESTIÓ D'ESTAT I MEMÒRIA

### 🧠 Estat Global
- **Aïllament**: L'estat es divideix per mòduls. Canvis a una pestanya no afecten altres.
- **Memoització**: Tots els components visuals dins `React.memo`. Tots els objectes passats per `props` dins `useMemo`.
- **Limitacions `localStorage`**: Màxim 5MB. **Només preferències d'usuari**, mai dades de contingut.

### 📦 Pressupost de Memòria
- Màxim 200 elements DOM actius en pantalla.
- Neteja de referències (`ref = null`) en desmuntar components.
- Cancel·lació de peticions i `setTimeout` al desmuntar.

---

## 3. MODE LUPA: SINCRONITZACIÓ I ESDEVENIMENTS
Com que el Mode Lupa està fora de React, usem esdeveniments per a avisar a components que cal recalcular mides:

```javascript
// Quan canvia l'escala
window.dispatchEvent(new CustomEvent('sp-lupa-changed', { 
  detail: { scale: newValue } 
}));
```

**Ús**: Les llistes virtualitzades escolten aquest esdeveniment per a recalcular alçades de fila sense re-renderitzar tot.

---

## 4. PROTOCOL D'AUDITORIA I CONTROL DE QUALITAT

### 🔍 Abans de desplegar
1. **Prova en maquinari real**: iPad A10 (2016) és l'únic referent vàlid. Emuladors no validen rendiment.
2. **Mesura FPS**: Ha de ser estable a 58-60 FPS en tot moment.
3. **Prova sense connexió**: Tot ha de funcionar igual.
4. **Revisió de codi**: Comprovació automàtica de classes prohibides.

### 📋 Llista de Comprovació Final
- [ ] S'usen només tokens `--sp-*`?
- [ ] Hi ha `backdrop-blur` o `filter` en algun lloc?
- [ ] Els inputs tenen `font-size: 16px`?
- [ ] Les llistes llargues estan virtualitzades?
- [ ] El Mode Lupa no provoca salts visuals?
- [ ] Tots els components compleixen el contracte de `propTypes` o TypeScript?
