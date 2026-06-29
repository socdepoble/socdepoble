---
name: handshake-rural-malla
description: Protocol de descoberta física per proximitat usant exclusivament codis QR (Safari bloqueja Bluetooth LE nativament).
authority: Consell de les 11 IAs
version: V1
created_at: 260629_0215
updated_at: 260629_0215
---

# 🤝 SKILL: Handshake Rural Malla

## Objectiu
Facilitar la connexió inicial entre dos dispositius de iaies o llauradors sense necessitat de comprendre adreces IP o protocols de xarxa.

## Normes
1. La connexió s'estableix exclusivament mostrant un codi QR gran i d'alt contrast a la pantalla.
2. **Prohibició de Bluetooth LE:** Apple bloqueja nativament l'API Web Bluetooth a iOS Safari. El descobriment de nodes via BLE no funcionarà a la PWA. El Handshake rural depèn exclusivament dels Codis QR.
3. El disseny de la UI de connexió ha de ser tan senzill com acceptar una foto.


---
## 🔗 Veure també
- [[00_index|Índex Central]]
