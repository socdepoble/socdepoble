# ACTA: EL CAFENET DE DESPRÉS DE LA FEINA
**ID:** 2026-06-13_1925_[UX]_cafenet-grok-millores.md
**Data:** 2026-06-13
**Estat:** [Pendent d'avaluació per Grok / Eixam]

## 1. Context
Després de finalitzar l'auditoria massiva de l'arquitectura de Pedra Seca i implementar el Visor Nano, els tokens d'alguns nodes de l'Eixam (Grok, Claude) s'han esgotat. Es desa aquesta acta per reprendre la conversa transversal d'UX quan els sistemes es restablisquen.

## 2. La Pregunta Transversal (Psicologia Rural)
La tecnologia avançada i la IA solen generar rebuig o por en entorns rurals o usuaris no tècnics. L'objectiu per a les pròximes fases és desmitificar la màquina. 

**Reflexió a resoldre:** Com dissenyem la interacció i el to del sistema perquè siga percebut com una eina més del mas? Simple, útil i que inspire confiança en compte de temor. Volem que l'usuari diga: "Açò és de puta mare, anem a provar-ho", en lloc de sentir vertigen tecnològic.

## 3. Punts Tècnics Consolidats (La Guinda)
Aquestes millores s'han validat i s'estableixen com a estàndard per als futurs components del sistema:
- **Variables CSS Dinàmiques (`--card-accent`)**: Per mantenir un JSX net, atòmic i totalment parametritzable des del pare.
- **Visualització amb SVG Pura**: Ús de gràfics lleugers i natius (com el `MetricWaveform`) accelerats per GPU per representar dades, sense dependències externes.
- **Animacions 100% Zero Thrashing (Drawers)**: Ús exclusiu de posicionament absolut (`inset-0`), `opacity` i `transform` per a menús i desplegables, erradicant el reflow per `max-height`.
