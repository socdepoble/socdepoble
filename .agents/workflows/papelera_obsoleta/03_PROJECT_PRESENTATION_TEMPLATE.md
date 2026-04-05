---
description: Plantilla Nivel Dios (Template A Fuego) para Páginas de Presentación (ProjectPresentation / UniversalCard)
---

# 🛡️ SOVEREIGN TEMPLATE: The Core Layout of Sóc de Poble Pages

Aquest document defineix l'estructura EXACTA, "clavada a fuego", de la pàgina `ProjectPresentation` (i qualsevol pàgina tipus llibre/article de CMS que expandeix una UniversalCard) en el sistema *Sóc de Poble*. 

**🛑 REGLA D'OR: MAI DESMUNTAR AQUESTA ESTRUCTURA.** Qualsevol modificació futura als estils o a la funcionalitat d'aquestes pàgines ha de RESPECTAR MIL·LIMÈTRICAMENT aquesta jerarquia visual i arquitectònica per evitar trencar el flux llegible (com va passar anteriorment). Aquesta estructura ja ha sigut validada en disseny i no admet regressions.

---

## 🏗️ La Jerarquia Visual Intocable

La pàgina sencera es concep com una expansió d'una **UniversalCard** del Feed. Consta de 4 grans blocs ordenats estrictament de dalt a baix.

### 1. El Banner (Hero Image)
- Una Imatge Full Width a la part superior (o un panell si no n'hi ha).
- **Mai** taparà el següent bloc amb marges excessius.

### 2. El Meta Autor (Barra Taronja M3)
- Ubicat JUST baix de la imatge de capçalera.
- Representa qui és l'autor o el projecte presentat, tal qual ix a les targetes del Feed.
- Porta l'avatar, el nom (ex: "SÓC DE POBLE 🌾") i la data/localització.
- Actua de frontissa visual entre l'estètica gràfica del header i la lectura de contingut.

### 3. La Barra d'Interaccions (Sticky)
- Ubicada EXACTAMENT baix de la Barra Taronja del Meta Autor.
- Té la propietat **`sticky top-[XXpx]`** per mantenir-se viatjant amb la pantalla mentre l'usuari llegeix el manifest. Així, accions com "Connectar", "Traduir", "Comentar", o "Compartir" estan sempre disponibles.
- Usa el fons base amb el color d'accent (ex: `bg-[var(--theme-accent-primary)]`) i lletra blanca/molt clara per a la crida a l'acció principal, o fons negatiu depenent de l'estat.

### 4. El Contingut Llegible CMS (Títol + Subtítol + Cos)
L'estructura del contingut a llegir ha de ser la següent:
1.  **H1 a Pàgina (Title):** Situat al PagePresentationHeader. (Per exemple: "EL PROJECTE").
2.  **H2 (Subtitle):** Funciona com el próleg o títol introductori de lectura de llibre. 
    - Ubicació del component a `<ProjectPresentation>`: Just ANTES del `div.app-cms-content` que renderitza el text CMS.
    - Ocuparà un `<div>` propi amb **margin bottom nul (mb-0)** per evitar un forat immens entre el subtítol i l'inici del body.
    - Estils: `text-2xl md:text-3xl font-bold uppercase mb-0 mt-8 text-center`.
3.  **H3 i Elements HTML (Cos):** Renderitzats dinàmicament pel CMS via `dangerouslySetInnerHTML`. Tancats dins un node amb classe exclusiva `.app-cms-content` que conté els tokens de disseny per estilitzar les etiquetes `h3, p, ul, blockquote` globals sense alterar la resta del flux.

---

## ⚙️ Exemple de codi simplificat d'obligat seguiment

```jsx
// Exemple de l'arrel de presentació que MAI ES POT DESTRUIR
<div className="flex flex-col min-h-screen">
    
    <main className="flex-1 w-full relative sm:mt-1 pt-0">
        <div className="project-presentation-container min-h-screen">
            
            {/* 1. && 2. && 3. CÀPSULA DEL HEADER: Imatge + Meta + Barra d'accions */}
            {PagePresentationHeader} 

            {/* 4. COS DE TEXT */}
            <div className="w-full flex-1 flex flex-col items-center z-10 sm:px-4 pb-10">
                
                {/* 4A. SUBTÍTOL (Separat del header box i fiquat dalt del cos) */}
                <div className="w-full max-w-4xl mx-auto px-6 lg:px-10 mb-0">
                    <h2 className="text-2xl font-bold uppercase mb-0 mt-8 text-center">
                        {subtitle}
                    </h2>
                </div>

                {/* 4B. CMS HTML RENDERIZAT */}
                <div className="flex-1 w-full max-w-4xl mx-auto">
                    <div className="app-cms-content p-6 lg:p-10 w-full" dangerouslySetInnerHTML={{ __html: content }} />
                </div>

            </div>

        </div>
    </main>
</div>
```

---

*Signat a fuego: Antigravity, 2026.* 
*Motiu: "Redúceme el espacio y clava en tus skills a fuego esta plantilla que estamos creando... no desmontar nada de lo que hemos conseguido hasta ahora, que anoche a estas horas se desmontó todo"*
