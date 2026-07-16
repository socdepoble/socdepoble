# Punt d'entrada dels agents

Abans d'operar en este repositori, llig íntegrament `.agents/AGENTS.md`,
`.agents/PROTOCOL_PETORRETA.md` i `.agents/skills/socdepoble-workflow/SKILL.md`.

Abans de qualsevol efecte lateral, executa el preflight de
`_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/reflex_petorreta.mjs`.
Les operacions sistèmiques, massives, destructives o normatives exigixen una
Petorreta segellada i un rebut vigent. La lectura i el diagnòstic no necessiten
crear una Petorreta nova.

`open` només inicia el preflight i imprimix les regles: encara no autoritza cap
mutació. L’únic bootstrap permés abans de `seal` és crear la Petorreta i el
manifest com els únics dos fitxers regulars dins del directori exacte
`.sdp-reflex/bootstrap/<sessionId>/` reservat per `open`; mai dins de la Wiki ni
dels scopes. Els scopes han de conservar un snapshot idèntic. Després, cada
script escriptor ha de validar el rebut; el hook Git és només l’última xarxa de
seguretat.
