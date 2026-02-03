# ==========================================
# GÈNESI DEL SISTEMA "SÓC DE POBLE"
# Integrant: Carbon, Bento, GOV.UK i Weber
# ==========================================

"""
Aquest script constitueix la base científica de la interfície de Sóc de Poble, 
garantint la resistència solar (Weber Class 6) i l'ordre industrial (Carbon/Bento).
"""

import json
from dataclasses import dataclass, field
from typing import Dict, List

def calcular_luminancia(hex_color: str) -> float:
    """
    Calcula la luminància relativa (0..1) segons l'estàndard sRGB.
    Necessari per a calcular el contrast científicament.
    """
    c = hex_color.lstrip('#')
    rgb = tuple(int(c[i:i+2], 16) / 255.0 for i in (0, 2, 4))
    
    rgb_l = []
    for val in rgb:
        if val <= 0.03928:
            rgb_l.append(val / 12.92)
        else:
            rgb_l.append(((val + 0.055) / 1.055) ** 2.4)
            
    return 0.2126 * rgb_l[0] + 0.7152 * rgb_l[1] + 0.0722 * rgb_l[2]

def calcular_weber_contrast(l_fons: float, l_objecte: float) -> float:
    """
    Fórmula de Contrast de Weber: (L_max - L_min) / L_min
    A diferència del WCAG (que és per a lectura web normal), Weber es fa servir
    per a senyals i pantalles en exteriors (Sunlight Readability).
    """
    l_base = min(l_fons, l_objecte)
    l_top = max(l_fons, l_objecte)
    
    # Evitem divisió per zero si el fons és negre absolut
    if l_base < 0.001: return 100.0 # Contrast màxim tècnic (Blanc sobre Negre pur)
    
    return (l_top - l_base) / l_base

@dataclass
class BentoModule:
    """Un mòdul de la graella. Tot quadrat. Zero corbes."""
    id: str
    cols: int
    rows: int
    radius: str = "0px" # LLEI DEL ZERO RADIUS: INNEGOCIABLE.

@dataclass
class SistemaVisual:
    version: str = "Genesis 1.0"
    
    # Paleta d'Alt Rendiment (High Contrast - Weber Class 6 Inspired)
    colors: Dict[str, str] = field(default_factory=lambda: {
        "canvas": "#000000",       # Negre absolut (Estalvi bateria i màxim contrast)
        "surface": "#161616",      # Carbon Gray 100 (IBM Style)
        "text_main": "#FFFFFF",    # Blanc absolut
        "brand_accent": "#CCFF00", # Groc/Verd 'Jupetí Reflectant' (Alta visibilitat)
        "alert": "#FF0033"         # Roig Seguretat
    })

    def auditar_sistema(self):
        """El Cap d'Obra passa revista."""
        print("🚜 [CAP D'OBRA] Iniciant auditoria de resistència solar...")
        
        lum_bg = calcular_luminancia(self.colors["surface"])
        lum_txt = calcular_luminancia(self.colors["text_main"])
        lum_acc = calcular_luminancia(self.colors["brand_accent"])
        
        # 1. Validació WEBER CLASS 6 (> 10.0 és l'objectiu per a exteriors reals)
        c_text = calcular_weber_contrast(lum_bg, lum_txt)
        status_text = "✅ APROVAT (Class 6)" if c_text > 10.0 else "❌ SUSPÉS (No es veu al sol)"
        
        print(f"   > Contrast Text Principal (Weber): {c_text:.2f} -> {status_text}")
        
        # 2. Validació Accent
        c_acc = calcular_weber_contrast(lum_bg, lum_acc)
        print(f"   > Contrast Accent Marca (Weber): {c_acc:.2f}")

        # 3. Generació de CSS Grid (Bento Style)
        print("\n🧱 [ARQUITECTE] Generant estructura Bento (Zero Radius)...")
        css_grid = """
        :root {
            --sp-radius: 0px; /* Llei del Zero Radius */
            --sp-font-base: 19px; /* GOV.UK Standard */
        }
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
        }
        .module {
            border: 2px solid #333; /* Vores definides, sense ombres toves */
        }
        """
        return css_grid

# ==========================================
# EXECUCIÓ
# ==========================================

sistema = SistemaVisual()
css = sistema.auditar_sistema()
print("\n>>> GENESIS COMPLETADA. El sistema està llest per a producció.")
