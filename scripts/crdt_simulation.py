# 🍎 Simulació de Resiliència CRDT: Inventari Agrícola de Sóc de Poble
# Aquest script demostra com dos usuaris poden treballar sense internet
# i fusionar les seues dades de forma matemàtica sense conflictes.

class InventariCRDT:
    def __init__(self, nom_producte):
        self.nom_producte = nom_producte
        # Utilitzem un diccionari per a guardar les aportacions de cada usuari
        # Això garanteix que la suma siga idempotent i resilient.
        self.aportacions = {} 

    def afegir_quantitat(self, usuari_id, quantitat):
        """L'usuari afig quantitat a la seua llibreta local."""
        actual = self.aportacions.get(usuari_id, 0)
        self.aportacions[usuari_id] = actual + quantitat
        print(f"[LOCAL] {usuari_id} ha afegit {quantitat}kg de {self.nom_producte}.")

    def fusionar(self, altre_inventari):
        """Simula la reconnexió i fusió de dades (MERGE)."""
        for usuari_id, quantitat in altre_inventari.aportacions.items():
            # En un LWW (Last Write Wins) o un Counter real, la lògica és més complexa,
            # però per a l'inventari sumem les realitats de cada node.
            actual = self.aportacions.get(usuari_id, 0)
            # Ací és on ocorre la màgia: no sobreescrivim, integrem.
            self.aportacions[usuari_id] = max(actual, quantitat)
        print(f"\n[SINCRO] S'han fusionat les llibretes de la xarxa.")

    def total(self):
        return sum(self.aportacions.values())

# --- ESCENARI DE SIMULACIÓ ---

# 1. Creem l'inventari inicial a la Cooperativa (0 kg)
total_pomes = InventariCRDT("Pomes de la Torre")

# 2. Simulem un tall de xarxa (Offline)
print("--- TALL DE XARXA: Mode Offline Activat ---")

# 3. L'usuari 'Vicent' treballa des de la Masia del Pi (sense internet)
inventari_vicent = InventariCRDT("Pomes de la Torre")
inventari_vicent.afegir_quantitat("Vicent", 500)

# 4. L'usuari 'Maria' treballa des del camp (sense internet)
inventari_maria = InventariCRDT("Pomes de la Torre")
inventari_maria.afegir_quantitat("Maria", 300)

# 5. Simulem la reconnexió i fusió (MERGE)
# La Cooperativa rep les dades de Vicent i Maria
total_pomes.fusionar(inventari_vicent)
total_pomes.fusionar(inventari_maria)

# 6. Demostració del resultat final
print(f"\n--- RESULTAT FINAL (RECONNEXIÓ) ---")
print(f"Producte: {total_pomes.nom_producte}")
print(f"Total acumulat: {total_pomes.total()}kg")
print(f"Detall per node: {total_pomes.aportacions}")

# El resultat és 800kg, sense pèrdua de dades ni conflictes d'edició. ⚖️✨
