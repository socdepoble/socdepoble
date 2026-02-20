# 🗺️ MAPA DE TERRITORI: SÓC DE POBLE (ARQUITECTURA MESTRA v3.1)

**Estat:** IMMUTABLE / BLINDAT  
**Objectiu:** Definir l'anatomia, fisiologia i lleis visuals de cada òrgan del sistema.  
**Ús:** Aquest document alimenta el "Modo Explicación" de la plataforma.

## 1. 🏗️ L'ESTRUCTURA MESTRA (EL CONTENIDOR)

El sistema es basa en una arquitectura de 3 Columnes (Tríptic) en escriptori i una arquitectura de Calaix i Pantalla Completa en mòbil.

### A. La Barra Lateral (Sidebar) - "La Roca"

**Comportament:**

- **Escriptori:** Fixa a l'esquerra (280px). Sempre visible.
- **Mòbil:** Oculta (Drawer). S'activa amb el botó Menú (Hamburguesa).

**Estètica:**

- **Capçalera:** Bloc Sòlid NEGRE (h-16, 64px). Conté el Logotip "SÓC DE POBLE" (Blanc/Invertit) alineat amb el centre.
- **Cos:** Color de fons segons tema (Blanc/Negre), vora dreta fina.

**Contingut Sagrat (Ordre Inalterable):**

1. **Botó AFEGIR (+):** Blau (#4F46E5). Gran, rounded-xl. Obre el modal de creació universal.
2. **Botó Xat:** Taronja (#FF6B00). Gran, rounded-xl. Separat de la llista. Activa el mòdul de missatgeria.
3. **Navegació Principal:** Mur d'Històries (LayoutGrid), Mercat Rural (Store), Pobles (MapPin), Esdeveniments (Calendar), Mapa (Map).
4. **Organització:** Perfil, La IAIA (Hub), Arxiu d'Or, Calendari Master, Àlbum Global.
5. **Col·leccions:** Carpetes d'usuari (xat, gent).
6. **Peu:** Botó "Tancar Sessió" (LogOut).

### B. El Panell Central (Llista) - "El Mercat"

**Comportament:**

- **Escriptori:** Fix al mig (400px). Sempre visible.
- **Mòbil:** Ocupa el 100% de la pantalla. S'amaga si se selecciona un element.

**Estètica:**

- **Capçalera:** NEGRA SEMPRE (h-16). Conté el Menú (Mòbil), Títol (Mòbil) i Eines (Escriptori).
- **Eines (Dreta):** Cerca, Mode Arquitecte (📖), Lluna/Sol, Selector IAIA (✨), Campana, Avatar Usuari. Aquestes icones estan ancorades a la dreta (ml-auto).

**Contingut:**

- **Tabs Contextuals:** Canvien segons la secció (ex: al Xat mostra "XAT, GENT...", al Mur mostra el títol "ÚLTIMES NOTÍCIES").
- **Llista d'Elements:** Targetes amb Avatar/Imatge, Títol, Subtítol i Metadada (Hora/Preu) en taronja.

### C. El Panell Dret (Detall) - "L'Escenari"

**Comportament:**

- **Escriptori:** Ocupa la resta de l'espai (Flexible).
- **Mòbil:** Ocupa el 100% de la pantalla (overlay) quan hi ha un element seleccionat. Té botó "Enrere" (<).

**Estètica:** Fons segons tema.
**Modes:**

- **Mode Producció:** Mostra el contingut real (Xat, Notícia, Fitxa).
- **Mode Arquitecte (📖):** Mostra aquesta definició tècnica i funcional.

## 2. 📍 DEFINICIÓ DE PÀGINES (MÒDULS)

### 💬 2.1. PÀGINA DE XAT (Mòdul Base)

**Objectiu:** Punt d'aterratge central i comunicació directa entre Ciutadans, Forasters i els Agents IAIA.

- **Landing Page Sagrada:** Aquesta és la pàgina d'aterratge per defecte del sistema.
- **Accés Lliure:** Els Forasters (visitants no registrats) tenen accés total a la visió del xat de la IAIA.
- **Llista (Central):** Mostra la llista de converses actives i tots els agents disponibles per defecte.
- **Filtre IAIA (✨):**
  - **Mode Silenciós:** Només mostra xats amb humans reals.
  - **Mode IAIA (Core):** Mostra humans + La IAIA MarIA.
  - **Mode Immersiu (Full):** Mostra toda la colla (Nano, Ratolí, Vicent, etc.).
- **Detall (Dret):** Interfície de xat estàndard. Capçalera amb estat "En línia". Bafarades de missatge (Usuari dreta, Agent esquerra).
- **Arquitectura de Ferro:** L'Arquitectura General del Mas Digital inclou la Sidebar (Roca) a l'esquerra amb el logotip sempre present i botons d'acció grans (AFEGIR, Xat). El Header és sempre Negre per seguretat visual.

### 📰 2.2. PÀGINA DEL MUR (Notícies i Bans)

**Objectiu:** El tauler d’anuncis del poble. Informació oficial i veïnal.

- **Llista (Central):** Targetes de titulars (🏛️ Ajuntament, 🚜 Cooperativa, 🎉 Festa).
- **Detall (Dret):** Format "Notícia" amb imatge 16:9, Títol H1 i interaccions (Cor, Comentar).

### 🛒 2.3. PÀGINA DEL MERCAT (Comerç Local)

**Objectiu:** Compravenda de productes de proximitat (Km0).

- **Llista (Central):** Targetes amb imatge quadrada i preu destacat en Taronja.
- **Detall (Dret):** Fitxa de Producte amb foto gran, preu gegant i botó "Contactar Venedor".

### 🏘️ 2.4. PÀGINA DE POBLES (Territori)

**Objectiu:** Informació dels municipis de la Vall.

- **Llista (Central):** Llista alfabètica de pobles amb escut/avatar.
- **Detall (Dret):** Fitxa del poble amb foto panoràmica, dades bàsiques i enllaços ràpids.

### 👤 2.5. PÀGINA DE PERFIL (Centre de Control)

**Objectiu:** Gestió de l'usuari i configuració del sistema.

- **Llista (Central):** Menú de seccions (Compte, Aparença, Notificacions).
- **Detall (Dret):** Panell de control amb interruptors per a Tema, Nivell IAIA i Mode Arquitecte.

## 3. ⚙️ PROTOCOLS DE SISTEMA (LLEIS)

### 3.1. PROTOCOL DE LA IAIA (L'Ànima del Poble)

L'usuari té Sobirania Total sobre la presència de la IA via selector ✨, però el bategat és obert de gènesi.

- **Visibilitat per Defecte:** Tots els agents IAIA estan visibles per a tothom (Forasters i Mestres) per a garantir el servei de proximitat digital.
- **Mode Silenciós:** Purga total de rastro d'IA (Agents i publicacions) per a qui busca el "Silence Rural".

### 3.2. PROTOCOL VISUAL (El 1er Mandament)

- **Cabecera:** Negra (bg-black) i text blanc a les àrees de control.
- **Logotip:** Sempre present.
- **Geometria:** Botons rounded-xl.
- **Alineació:** Icones d'eines sempre a la dreta (ml-auto).

---

_Aquest document és la memòria externa del Mestre Javi. Qualsevol dubte futur s'ha de resoldre consultant aquest mapa._
