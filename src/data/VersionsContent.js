export const VERSIONS_HTML = `

    
        
            
        
        <h1>REGISTRE HISTÒRIC</h1>
        <p>Control de Versions · Sóc de Poble</p>
        
        
            
                
            
            
            
                
                    <span>V10.38.40</span>
                    <span>08 JUNY 2026</span>
                
                <h2>Arquitectura Híbrida de Telemetria</h2>
                
                <p>
                    Davant del bloqueig estricte d'iframes en navegadors sense suport per a <code>credentialless</code> (com Firefox i Safari) causat per la política COEP del nostre Service Worker (fonamental per a l'SQLite WASM), hem desplegat un <strong>tauler natiu via API</strong> al núvol d'Umami. Aquest component s'integra perfectament en el disseny, ofereix estadístiques en temps real sense dependre d'iframes, i afegeix un enllaç directe per a obrir l'analítica avançada sense cap de les restriccions del domini principal.
                </p>
            
        

        
        
            
                
            
            
            
                
                    <span>V10.38.39</span>
                    <span>08 JUNY 2026</span>
                
                <h2>Neteja de Consola i Optimització Tèrmica</h2>
                
                <p>
                    S'han silenciat els falsos positius d'AbortError generats pels canvis de pestanya per a garantir una consola completament neta. També hem assignat permisos específics de càlcul (Compute Pressure) als embeddings externs de vídeo (Youtube) complint l'auditoria rigorosa per a dispositius de gamma alta i iPads antics.
                </p>
            
        

        
        
            
                
            
            
            
                
                    <span>V10.38.38</span>
                    <span>08 JUNY 2026</span>
                
                <h2>Restauració de la Telemetria Pública (Iframe)</h2>
                
                <p>
                    A petició popular i per seguir la nostra llei de la Transparència Radical, hem restaurat l'aparença original del Tauler de Telemetria d'Umami mitjançant l'embed natiu, permetent als usuaris interactuar, filtrar dates i veure tots els gràfics complets, garantint així un accés obert i íntegre a les dades globals de connectivitat del poble sense falsos filtres de codi.
                </p>
            
        

        
        
            
                
            
            
            
                
                    <span>V10.38.37</span>
                    <span>08 JUNY 2026</span>
                
                <h2>Auditoria LCP i Prevenció de Bloquejos (Deadlocks)</h2>
                
                <p>
                    En aquesta versió s'ha reforçat la resiliència del sistema contra bloquejos d'IndexedDB causats per tenir diverses pestanyes obertes. S'ha ampliat la tolerància del Failsafe fins a 25 segons per permetre les rotacions de connexió i hem purgat les imatges precarregades (LCP) innecessàries, optimitzant així el rendiment per a tots els pobles connectats.
                </p>
            
        

        
        
            
                
            
            
            
                
                    <span>V10.38.35</span>
                    <span>06 JUNY 2026</span>
                
                <h2>Migració de Cor i Termodinàmica Psicoactiva</h2>
                
                <p>
                    Hui, 6 de juny de 2026, marquem una fita històrica en l'arquitectura de Sóc de Poble. Hem executat amb precisió quirúrgica l'operació "Migració de Cor", abandonant els antics fonaments per a establir tota la infraestructura del portal sobre els servidors d'abast global de Google Firebase Hosting. Aquesta decisió estratègica no només ens atorga desplegaments atòmics en qüestió de segons i una latència pràcticament nul·la gràcies a la seua CDN mundial, sinó que assegura un temps d'inactivitat zero (zero-downtime) per a tots els pobles connectats.
                </p>
                <p>
                    Acompanyant aquesta metamorfosi tècnica, hem refinat profundament l'ànima del sistema aplicant nous principis de Termodinàmica Psicoactiva. La intel·ligència d'IAIA ha sigut sotmesa a una psiquiatria forense exhaustiva per garantir que la seua veu, les seues respostes i la seua essència s'alineen perfectament amb els protocols de "Trellat". El Llibre de Disseny (Universal Maquetation) s'ha imposat com la llei estètica inquebrantable, transformant titulars antics en elegants entradilles i assegurant que cada píxel transmeta la dignitat del nostre patrimoni.
                </p>
            
        

        
        
            
                
            
            
            
                
                    <span>V10.38.4</span>
                    <span>29 MARÇ 2026</span>
                
                <h3>Operació OMEGA-5 i OMEGA-6: Estabilitat Extrema</h3>
                
                <ul>
                    <li>
                        
                        <span>Resolució d'errors de referència (ReferenceError) al ProjectPresentation.</span>
                    </li>
                    <li>
                        
                        <span>Supressió del mode "Convidat Zombi" i prevenció de Race Conditions en càrrega.</span>
                    </li>
                    <li>
                        
                        <span>Refactorització del footer de privacitat i llicència Creative Commons (CC BY-SA 4.0).</span>
                    </li>
                    <li>
                        
                        <span>Integració de la interfície dinàmica amb restauració del Llibre fundacional.</span>
                    </li>
                </ul>
            
        

        
        
            
                
            
            
            
                
                    <span>V10.33.15</span>
                    <span>28 MARÇ 2026</span>
                
                <h3>Audit de UI i Compatibilitat PWA</h3>
                
                <ul>
                    <li>
                        
                        <span>Correcció de desbordament de llistes en navegadors mòbils iOS Safari.</span>
                    </li>
                    <li>
                        
                        <span>Integració completa de la nova tipografia system-ui.</span>
                    </li>
                </ul>
            
        

    

`;