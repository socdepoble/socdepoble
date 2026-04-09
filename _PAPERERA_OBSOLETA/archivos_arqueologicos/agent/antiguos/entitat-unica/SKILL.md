> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/agent/antiguos/entitat-unica/SKILL.md`

---
name: entitat-unica
description: Habilidad (Skill) arquitectónica para garantizar el Principio de Entidad Única (Single Source of Truth) en todas las publicaciones, evitando fragmentación de estados y URIs como ocurre en redes sociales clásicas.
---

# Llei de l'Entitat Única (Anti-Facebook Fragmentation)

Aquesta "Skill" és de compliment obligatori en totes les decisions de disseny de base de dades, rutes i renderitzat de components (com l'`UniversalCard` o els Murs). 

Va ser fortificada pel Mestre per purgar projectes de l'efecte nociu on una publicació té "diferents estats de m'agrada" depenent d'on es mostri.

## Directrius Clau:

1. **ID Ínic Universal**: Qualsevol node d'informació (Post, Element de Mercat, Esdeveniment, Perfil) ha de tindre el seu propi `uuid` i ser la font de la veritat absoluta.
2. **Pàgina Única de Destí**: Un element creat té la seua representació profunda en **una única URL** (ex. `/publicacio/123` o `/mercat/456`). 
3. **Murs Projectors, no Duplicadors**: Quan un node (com ara un Post) es mostra a diferents llocs simultàniament (un Mur de Perfil personal, el Mur Unificat del Mapa, la portada general...), només actuen com a "Vidres" o "Lents" que miren cap al mateix registre.
4. **Mutacions Globals**: Qualsevol interacció d'un usuari sobre una targeta (M'agrada, Comentari, Compartir) realitzada des del Mur del Mapa **s'ha de reflectir immediatament** i estar lligada a la mateixa clau primària. Mai es creen instàncies duplicades del post per a diferents sub-murs. 

> *«Lo que pasa en el muro y está en el mapa, es exactamente la misma publicación siempre. La gente conectada, siempre es la misma.»* — Directiva de La Torre.
