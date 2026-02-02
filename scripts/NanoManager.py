import time
import sqlite3
import threading
import queue
import logging
import os
from datetime import datetime

# --- CONFIGURACIÓ DE L'OBRA ---
DB_FILE = 'soc_de_poble_local.db'
LOG_FILE = 'nano_banana.log'
LLINDAR_TEMP = 75.0  # A partir d'ací, afluixem (l'H3 crema a 85ºC)
ID_DISPOSITIU = "NANO_01_BENIMARFULL"

# Configurem el registre d'errors (el "chivato")
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s | %(levelname)s | %(message)s',
                    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler()])

class NanoBananaCore:
    def __init__(self):
        # La 'Cua' és el cabasset on deixem la faena pendent
        self.cua_dades = queue.Queue()
        self.en_marxa = True
        self._iniciar_base_de_dades()
        logging.info(f"Arrancant {ID_DISPOSITIU}. A punt per a la collita.")

    def _iniciar_base_de_dades(self):
        """
        Crea la llibreta local. Sagrat: ací és on es guarda la veritat del camp.
        """
        try:
            conn = sqlite3.connect(DB_FILE, check_same_thread=False)
            cursor = conn.cursor()
            # Taula simple i robusta per a l'Offline-First
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS registre_camp (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tipus_sensor TEXT,
                    valor TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    sincronitzat BOOLEAN DEFAULT 0
                )
            ''')
            conn.commit()
            conn.close()
        except Exception as e:
            logging.critical(f"Error gros iniciant la BD: {e}")

    def _llegir_temp_cpu(self):
        """Llig la temperatura directament del fitxer de sistema (Linux)."""
        try:
            with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
                return int(f.read()) / 1000.0
        except:
            return 0.0

    def fil_monitor_salut(self):
        """
        El metge de capçalera. Vigila que la Nano no s'escalfe massa.
        """
        while self.en_marxa:
            temp = self._llegir_temp_cpu()
            
            # Gestió de Càrrega (Load Average)
            carrega = os.getloadavg()[0]
            
            if temp > LLINDAR_TEMP:
                logging.warning(f"ALERTA: Foc al bancal! CPU a {temp}°C. Pausant 10s...")
                time.sleep(10) # Refredament passiu
            
            # Ací podries afegir lògica per reiniciar si la RAM està al 99%
            time.sleep(30) # Revisió cada mig minut

    def fil_recollector(self):
        """
        Simula la recollida de dades dels sensors (GPIO).
        """
        while self.en_marxa:
            try:
                # --- ACÍ LLEGIRIES ELS SENSORS REALS ---
                # Exemple: Adafruit_DHT.read_retry(...)
                lectura = {
                    "tipus": "HUMITAT_SOL",
                    "valor": "45.2" 
                }
                
                # Passem la faena al fil que escriu a disc
                self.guardar_en_local(lectura)
                
                time.sleep(5) # Llegim cada 5 segons
            except Exception as e:
                logging.error(f"Error llegint sensor: {e}")

    def guardar_en_local(self, dada):
        """
        Escriu a pedra (SQLite). Això no falla mai.
        """
        try:
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("INSERT INTO registre_camp (tipus_sensor, valor) VALUES (?, ?)", 
                           (dada['tipus'], dada['valor']))
            conn.commit()
            conn.close()
            # logging.info(f"Guardat: {dada}") # Descomentar per debug
        except Exception as e:
            logging.error(f"Error guardant a la BD: {e}")

    def fil_sincronitzador(self):
        """
        Quan hi ha internet, buida la llibreta i ho envia al servidor central.
        """
        while self.en_marxa:
            try:
                # 1. Busquem dades pendents (no sincronitzades)
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute("SELECT id, tipus_sensor, valor FROM registre_camp WHERE sincronitzat = 0 LIMIT 20")
                pendents = cursor.fetchall()
                
                if pendents:
                    # 2. INTENT D'ENVIAMENT (Simulat)
                    # ací faries: requests.post(API_URL, json=...)
                    logging.info(f"Pujant {len(pendents)} registres al núvol...")
                    enviat_ok = True # Simulem que hi ha internet
                    
                    if enviat_ok:
                        ids = [str(p[0]) for p in pendents]
                        cursor.execute(f"UPDATE registre_camp SET sincronitzat = 1 WHERE id IN ({','.join(ids)})")
                        conn.commit()
                        logging.info("Sincronitzat correctament.")
                
                conn.close()
            except Exception as e:
                # Si falla internet, no passa res, ja ho farem després
                pass
            
            time.sleep(60) # Provem cada minut

    def arrancar_motors(self):
        # Llancem els fils (treballadors independents)
        fils = [
            threading.Thread(target=self.fil_monitor_salut, daemon=True),
            threading.Thread(target=self.fil_recollector, daemon=True),
            threading.Thread(target=self.fil_sincronitzador, daemon=True)
        ]
        
        for f in fils: f.start()
        
        try:
            while True: time.sleep(1) # El programa principal es queda mirant
        except KeyboardInterrupt:
            logging.info("Aturant la màquina... Fins demà!")
            self.en_marxa = False

if __name__ == "__main__":
    sistema = NanoBananaCore()
    sistema.arrancar_motors()
