> 📂 **Arxiu/Ruta:** `./_SKILLS/SKILL_ARCH_SSI_DID.md`

# SKILL: Arquitectura de Ferro - SSI/DID [v1.0]

Aquesta skill defineix els estàndards de sobirania d'identitat (SSI) i identificadors descentralitzats (DIDs) per al Mas de Sóc de Poble.

## 1. El Protocol DID (Decentralized Identifiers)

- **ID de Veí**: Tota identitat bategada al Mas utilitza el mètode `did:sdp:`.
- **Estructura**: `did:sdp:[uuid_o_hash]`.
- **Sobirania**: El DID és generat localment pel veí i persistit a RhizomeDB d'acord amb el protocol Eg-walker.

## 2. Web of Trust (Cercle de Confiança)

- **Vots de Confiança**: Un veí pot emetre un vot de confiança (`TRUST_VOTE`) cap a un altre DID.
- **Proximitat Semàntica**: La reputació no és un número global, sinó una distància en el graf de confiança:
  - **Grau 1**: Connexió directa (Veí de confiança).
  - **Grau 2**: Veí d'un veí (Xarxa veïnal).
  - **Grau 3+**: Desconegut (Foraster).

## 3. Verificació de Veïnat (Neighborhood Verification)

- **Repte**: Com sabem que un veí és "de poble" sense DNI centralitzat?
- **Solució**: Protocol de Consens Local:
  - Un veí adquireix l'estatus de **"Veí Verificat"** si rep el vot de confiança de 3 veïns que ja estan verificats oficialment per la Federació (Ajuntament/Mestre).

## 4. Implementació Técnica

- **Storage**: `rhizomeDb.saveOperation({ type: 'TRUST_VOTE', ... })`.
- **Service**: `trustService.js`.
- **UI**: Badge de "Confiança de Poble" bategat amb el bategat d'Eg-walker.

> [!IMPORTANT]
> Al Mas, la identitat no la dona l'estat, la dona el bategat de la terra i el reconeixement dels veïns.
