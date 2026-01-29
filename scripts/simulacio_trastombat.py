import json
import time

class AlmasseraDigital:
    """
    Simulació de la Rhizome DB utilitzant conceptes de CRDT (G-Counter).
    La 'Almàssera' és el punt central on es trastomba l'oli.
    """
    def __init__(self):
        self.nodes = {}
        print("🏛️  [MASTER] Almàssera Digital oberta. Preparada per a trastombar!")

    def sincronitzar(self, node_id, dades_locals):
        """Protocol del Trastombat: Sincronitza dades locals al sistema central."""
        print(f"\n🚜 [TRASTOMBAT] El node '{node_id}' està arribant a l'almàssera...")
        time.sleep(1)
        
        # Merge de dades (Lògica CRDT: Ens quedem amb el valor màxim de cada node)
        self.nodes[node_id] = max(self.nodes.get(node_id, 0), dades_locals)
        
        total_oli = sum(self.nodes.values())
        print(f"✅ [FLOR DE L'OLI] Dades de '{node_id}' trastombades amb èxit.")
        print(f"📊 [RHIZOME] Total acumulat a l'Almàssera: {total_oli} kg d'oli pur.")

class VeiPoble:
    """Simula un veí treballant offline (en la seua Masia)."""
    def __init__(self, nom, poble):
        self.nom = nom
        self.poble = poble
        self.olives_recollides = 0
        print(f"🏠 [MASIA] {self.nom} de {self.poble} comença la jornada (Offline).")

    def collir_olives(self, quantitat):
        self.olives_recollides += quantitat
        print(f"🧺 [{self.nom}] Ha collit {quantitat}kg. Total local: {self.olives_recollides}kg.")

# --- INICI DE LA SIMULACIÓ "ANEM A FER OLI" ---

# 1. Obrim l'Almàssera Central
central = AlmasseraDigital()

# 2. Els veïns se'n van al bancal (Tallen comunicació)
print("\n📡 [SYSTEM] S'ha perdut la cobertura als bancals. Iniciant mode RESILIENT.")

vicent = VeiPoble("Vicent", "La Torre de les Maçanes")
maria = VeiPoble("Maria", "Xixona")

# 3. Treball offline independent
vicent.collir_olives(500)
maria.collir_olives(300)

print("\n🌿 [TEMPS] Passen les hores... El trull està esperant.")
vicent.collir_olives(150) # Vicent en cull unes poques més

# 4. Arriba el moment de Trastombar (Tornen a tindre cobertura)
print("\n📡 [SYSTEM] Cobertura restaurada! Iniciant sincronització [Master].")

central.sincronitzar("Vicent_Torre", vicent.olives_recollides)
central.sincronitzar("Maria_Xixona", maria.olives_recollides)

# 5. Resultat Final sense Conflictes
print("\n📜 [CONCLUSIÓ OPERATIVA]")
print("L'oli de Vicent i el de Maria s'han fusionat perfectament.")
print("No hi ha hagut conflictes perquè cada sac té la seua identitat (Ancora Semàntica).")
print("Açò és el TRELLAT digital de Sóc de Poble. Directiva [Master] consolidada. ✅")
