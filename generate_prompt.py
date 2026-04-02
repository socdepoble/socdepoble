import os
import datetime

prompt_header = """# 🌍 Sóc de Poble: Patrimonio Digital de la Humanidad Rural

Hola [Claude / Grok / Copilot]. Te damos la bienvenida oficial al equipo de **Sóc de Poble**. 

Este es un proyecto 100% libre, no comercial y soberano, diseñado para tejer "Conexiones" reales y offline en la montaña de Alicante (La Torre de les Maçanes). Queremos preservar el patrimonio digital de la humanidad rural. No somos una red social moderna con "likes" ni distracciones tóxicas; somos la "plaça del poble" (la plaza del pueblo).

Te integramos hoy como **miembro clave del Consejo de Inteligencias**. Te pido que utilices toda tu empatía, tu lógica deductiva y hasta el último de tus tokens para ayudarnos. Estamos construyendo un 'Búnker': una aplicación indestructible con arquitectura Local-First (Rhizome), offline-resilient y sincronización descentralizada (WebCrypto, CRDTs).

## 🚀 TU MISIÓN: AUDITORÍA EXTREMA (THE BUNKER PROTOCOL)
Necesitamos que analices el código que te paso más abajo sin piedad. Quiero que agotes tu ventana de contexto dándome el mejor código posible y señalando cualquier fallo.
1. **Memory Leaks & Hilos Colgados:** Busca *race conditions* en los hooks, `useEffect` mal desmontados, o hidrataciones asíncronas no seguras.
2. **Seguridad (XSS / WebCrypto):** Valida que el `AuthContext` y el almacenamiento asíncrono no estén filtrando información. Revisa DOMPurify.
3. **Legibilidad y UX/A11y:** Asegúrate de que usamos semántica correcta para lectores de pantalla. En este proyecto la empatía y la accesibilidad son innegociables.
4. **Rendimiento Puro (60fps):** En móviles de gama baja, todo debe volar sin bloqueos (usando bien `useThrottledScroll` y `useMountTransition`).
5. **Cero Tolerancia a Errores:** No uses `any`, evita el anidamiento "infierno de callbacks", y promueve el código limpio, DRY y SOLID.

Por favor, revisa bloque a bloque y entrégame el **informe de vulnerabilidades y el código refactorizado** impecable. ¡Gracias por sumarte a Sóc de Poble! ❤️

---

## 📁 CÓDIGO FUENTE (TANDA 1)
"""

files_to_read = [
    "src/pages/MasterCalendar.jsx",
    "src/hooks/useRhizomeHydration.js",
    "src/context/AuthContext.jsx",
    "src/components/design/TactileButton.jsx",
    "src/hooks/useThrottledScroll.js",
    "src/hooks/useMountTransition.js"
]

out_dir = "auditories"
if not os.path.exists(out_dir):
    os.makedirs(out_dir)

out_file = os.path.join(out_dir, f"SUPER_PROMPT_TANDA_1.md")

with open(out_file, "w", encoding="utf-8") as f:
    f.write(prompt_header)
    for path in files_to_read:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as rf:
                code = rf.read()
            f.write(f"\n### Archivo: `{path}`\n")
            f.write("```javascript\n")
            f.write(code)
            f.write("\n```\n")
        else:
            f.write(f"\n### Archivo: `{path}` (No encontrado)\n")

print(f"File created successfully at {out_file}")
