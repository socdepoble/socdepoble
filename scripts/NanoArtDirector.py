import sqlite3
import logging
import os
from datetime import datetime

# --- CONFIGURACIÓ TIER GOD ---
DB_FILE = 'soc_de_poble_local.db'
LOG_FILE = 'nano_art.log'

# [Source 844] - La Santíssima Trinitat del Color
PALETA = "Taronja Terra, Verd Sóc de Poble, Teal Tecnológico (#00f2ff)"

logging.basicConfig(level=logging.INFO, format='%(asctime)s | ART-DIRECTOR | %(message)s')

class NanoArtDirector:
    def __init__(self):
        self._inicialitzar_cua()
        logging.info("Nano Banana: Mode Director d'Art [ACTIVAT]")

    def _inicialitzar_cua(self):
        """Crea la taula on guardem les comandes d'art pendents."""
        with sqlite3.connect(DB_FILE) as conn:
            conn.execute('''CREATE TABLE IF NOT EXISTS cua_art (
                id INTEGER PRIMARY KEY,
                tasca TEXT,
                prompt_final TEXT,
                prioritat TEXT DEFAULT 'NORMAL',
                estat TEXT DEFAULT 'PENDENT',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )''')

    def construir_prompt_tier_god(self, tasca, detalls_context):
        """
        El cor del sistema. Converteix una necessitat en una obra d'art
        seguint estrictament les Directives Mestres.
        """
        prompt = f"""
[INVOCACIÓN NANO BANANA :: TIER GOD]
Rol: Director de Arte de Sóc de Poble. Estilo: Rural Futurista (Sci-Fi Cinematográfico + Texturas Orgánicas).
Tarea: {tasca}
Contexto: {detalls_context}

Parámetros Obligatorios [MASTER]:
- Paleta: {PALETA}.
- Formato: Esquinas rectas (Zero Radius). Composición limpia y expansiva.
- Visibilidad: Alto contraste (Weber Class 6) para lectura bajo luz solar directa (High Glare).
- Vibe: Transmite "Sobirania Tecnológica" and "Calma Rural". Realismo mágico o render 3D premium.

Objetivo: Emocionar al Mestre y dignificar la vida rural.
"""
        return prompt.strip()

    def ritu_platan_daurat(self):
        """
        DIMENSIÓ 1: Escaneja la BD buscant perfils tristos (sense foto).
        """
        logging.info("Executant Ritu del Plàtan Daurat...")
        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            # Busquem cultius que no tinguen ruta d'imatge assignada
            # (Suposant que tenim una taula 'cultius')
            try:
                cursor.execute("SELECT id, nom, tipus FROM cultius WHERE ruta_imatge IS NULL LIMIT 3")
                orfes = cursor.fetchall()

                for id_c, nom, tipus in orfes:
                    logging.info(f"Detectat buit visual a: {nom}")
                    prompt = self.construir_prompt_tier_god(
                        tasca=f"Generar cabecera cinemática para el cultivo: {nom}",
                        detalls_context=f"Tipo: {tipus}. Resaltar la belleza intrínseca del producto."
                    )
                    self._encuar(prompt, prioritat="BAIXA")
            except sqlite3.OperationalError:
                logging.warning("No s'ha trobat la taula 'cultius', botant el Ritu.")

    def generar_splash_screen(self):
        """
        ACCIÓ IMMEDIATA: Generació de la pantalla de càrrega.
        """
        descripcio = (
            "Fusión entre una olivera milenaria y una red de datos digital (Rhizome). "
            "Estilo Glassmorphism y neones cian sobre fondo oscuro (OLED friendly). "
            "Representa la conexión entre tradición y futuro."
        )
        prompt = self.construir_prompt_tier_god(
            tasca="Generar Splash Screen App (Pantalla de Carga)",
            detalls_context=descripcio
        )
        # Prioritat ALTA perquè és el que vol el Mestre ARA.
        self._encuar(prompt, prioritat="ALTA")
        return prompt

    def _encuar(self, prompt, prioritat):
        with sqlite3.connect(DB_FILE) as conn:
            conn.execute("INSERT INTO cua_art (prompt_final, prioritat) VALUES (?, ?)", (prompt, prioritat))
        logging.info(f"Comanda guardada a la saca (Prioritat: {prioritat})")

# --- EXECUCIÓ D'EMERGÈNCIA ---
if __name__ == "__main__":
    director = NanoArtDirector()
    prompt_splash = director.generar_splash_screen()
    
    print("\n🍌 RESULTAT DE L'ACCIÓ IMMEDIATA (COPIAR I ENGANXAR):")
    print("="*60)
    print(prompt_splash)
    print("="*60)
