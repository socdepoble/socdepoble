> 📂 **Arxiu/Ruta:** `./public/skills/whatsapp_parity_specs.md`

---
description: Specs and pending features for WhatsApp Info Screen Parity
---

# Paritat amb la Pantalla d'Informació de WhatsApp (Chat Manager)

Aquest document recull totes les funcionalitats que han d'existir a la pàgina de configuració/informació de xat (`/gestio/xats`), mimant el comportament de WhatsApp. Les funcionalitats més complexes s'han mockejat a nivell d'interfície per a ser implementades posteriorment.

## Seccions Implementades (UI)

1. **Capçalera ("Header")**:

   - Tornar enrere.
   - Imatge de perfil gegant.
   - Text "Privat, coses de Javi" (Títol del xat) i "Grup · 1 membre".

2. **Botonera d'Accions Ràpides**:

   - **Àudio**: Inicia trucada de veu (Mock).
   - **Vídeo**: Inicia videotrucada (Mock).
   - **Afegeix**: Afegir membres (Mock).
   - **Cerca**: Buscar dins del xat (Pot redirigir al xat amb el focus al cercador).

3. **Descripció del grup**:

   - Llegir i editar (Mock) la descripció del xat/grup. Mostra "Creat per tu, 10/2/16".

4. **Fitxers multimèdia, enllaços i documents**:

   - Mostra un grid horitzontal amb les últimes imatges enviades al xat.

5. **Gestió d'Emmagatzematge**:

   - "Administra l'emmagatzematge" (Mostra "67,0 MB" fals per ara).

6. **Opcions de Privacitat / General**:
   - Silenciar notificacions (Toggle).
   - Missatges temporals (Toggle).
   - Xifratge d'extrem a extrem (Informatiu).

## Funcionalitats a Desenvolupar en el Futur (Backlog)

- [ ] **Videotrucades i Audio**: Implementar WebRTC o integració amb Jitsi per a realitzar trucades en directe entre agents/usuaris.
- [ ] **Gestió real d'emmagatzematge**: Calcular la mida de tots els arxius pujats en la present conversa consultant al bucket de Supabase Storage.
- [ ] **Missatges temporals**: Cron job en Supabase que esborre els missatges més antics de X dies si la configuració està activa per a la conversa.
- [ ] **Cerca des de la configuració**: Enllaçar el botó de Cerca cap al `ChatDetail.jsx` passant-li per estat que òbriga el panell de cerca directament.
- [ ] **Afegir i gestionar membres reals**: Si és un grup, poder afegir usuaris o altres agents de la IAIA des del llistat de contactes de la xarxa.
