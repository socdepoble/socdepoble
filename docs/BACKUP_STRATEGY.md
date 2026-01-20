# Estratègia de Seguretat i Còpies de Reserva 🛡️

Per a garantir que **Sóc de Poble** puga créixer de forma segura i sense pèrdua de dades, hem establit els següents protocols de seguretat.

## 1. Codi Font (GitHub) 💻
Tot el codi de l'aplicació està ara sincronitzat en el repositori de GitHub.
- **Seguretat**: Si el teu ordinador personal falla, el codi està protegit en el núvol.
- **Històric**: Podem tornar enrere a qualsevol versió anterior (com hem fet amb la v1.1.3) si alguna cosa falla en el futur.
- **Recomanació**: Cada vegada que acabem una sessió de treball important, farem un `git push` oficial (com hem fet hui).

## 2. Base de Dades (Supabase) 🗄️
Les dades dels usuaris, publicacions i el mercat resideixen en Supabase.
- **Backups Automàtics**: Supabase realitza còpies de seguretat diàries de la base de dades SQL.
- **Point-in-Time Recovery**: Pots restaurar la base de dades a un punt exacte del temps si és necessari (disponible en el panell de Supabase).
- **Exportació Manual**: Recomanem fer una exportació de les taules (`.sql` o `.csv`) abans d'una migració estructural important.

## 3. Fitxers i Actius (Public Assets) 🎨
El logo oficial i les icones estan guardats en la carpeta `/public`.
- **Integritat**: Hem creat versions especials per a cada xarxa social (`og-image.png`, `apple-touch-icon.png`).
- **Resiliència**: Al estar en el repositori, s'emmagatzemen automàticament en GitHub. No es perdran mentre el repositori existisca.

## 4. Pròxims Passos per al Creixement 🚀
1. **Entorn de Staging**: Quan tinguem molts usuaris reals, haurem de crear un segon enllaç (`soc-de-poble-staging.vercel.app`) per a provar canvis abans de passar-los a producció.
2. **Monitoring**: Podem activar alerts de Vercel per a saber si la web cau o té errors de rendiment.
3. **Control de Versió Estricte**: Seguirem usant etiquetes de versió (`v1.1.x`) per a identificar ràpidament què està veient cada usuari.

---
*Aquesta documentació t'ajuda a presentar el projecte com un sistema madur i sota control davant de qualsevol inversor.*
