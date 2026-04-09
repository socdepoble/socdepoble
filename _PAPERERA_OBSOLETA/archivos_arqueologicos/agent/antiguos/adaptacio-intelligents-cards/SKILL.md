> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/agent/antiguos/adaptacio-intelligents-cards/SKILL.md`

---
name: adaptacio-intelligents-cards
description: Habilidad (Skill) para asegurar la "Adaptación Inteligente" de tarjetas y componentes visuales, forzando un diseño de 1 sola columna si el espacio físico (width < 700px) impide mostrar más de una tarjeta sin comprimirlas de forma antiestética, independientemente de que el usuario haya seleccionado la visualización "Grid".
---

# Adaptació Intel·ligent de Targetes (Respiració Horizontal)

El Mestre ha forjat aquesta regla per imperatiu visual en la geometria responsive del projecte. Les pantalles no es poden tractar com simples fraccions percentuals. **Si l'espai físic escurça una targeta a la meitat al punt on perd la seva harmonia, cal degradar l'escala cap a 1 única columna centralitzada.**

## Directrius Mínimes Vitals:

1. **Mai esclafar**: No forçar un "Grid" de 2 columnes en pantalles mòbils o divisors de menys de 700px d'amplària disponible (referint-nos a l'`offsetWidth` del contenidor o l'`innerWidth` de la finestra).
2. **Prioritzar Lecturabilitat**: Fins i tot si el mode d'interfície dicta "Grid", el sentit comú matemàtic dictamina una degradació a `columnCount: 1` si la viabilitat de lectura s'esvaeix.
3. **Escalat Escalzat**:  
   - `w < 700px` → 1 Targeta (Comportament de Mòbil Universal)
   - `w >= 700px` i `w < 1000px` → 2 Targetes (Tablet/Lap Prim)
   - `w >= 1000px` i `w < 1300px` → 3 Targetes (Monitor Estàndard)
   - `w >= 1300px` → 4 Targetes (Ultrawide)

> *"No quieras mostrar las dos si no caben en la pantalla [...] En móvil lo normal es que se vea una card sola."* — Directiva de La Torre sobre el comportament dels Murs de Contingut.
