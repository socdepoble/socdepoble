import hashlib
import json
import time
import base64

# --- Q1: Eg-walker - Sleeping Neighbor & Pruning ---

class RhizomeNode:
    def __init__(self, name):
        self.name = name
        self.DAG = [] # Full history (until pruned)
        self.snapshots = {} # Pruned checkpoints
        self.cold_storage = {} # Blobs stored on disk/federation
        self.state = ""

    def commit(self, op):
        """Adds an operation to the DAG."""
        # Simplified: op is a string to append
        prev_hash = self.DAG[-1]['hash'] if self.DAG else '0'
        entry = {
            'op': op,
            'prev': prev_hash,
            'timestamp': time.time(),
            'hash': hashlib.sha256(f"{op}{prev_hash}".encode()).hexdigest()
        }
        self.DAG.append(entry)
        self.state += op
        return entry

    def prune(self, version_id):
        """Consolidates DAG into a snapshot and clears memory."""
        print(f"[{self.name}] Pruning DAG up to {version_id}...")
        snapshot = {
            'version_id': version_id,
            'state': self.state,
            'last_hash': self.DAG[-1]['hash'] if self.DAG else '0'
        }
        # Move history to "Cold Storage" (simulation of disk)
        self.cold_storage[version_id] = list(self.DAG)
        self.snapshots[version_id] = snapshot
        self.DAG = [] 
        print(f"[{self.name}] RAM cleared. Current State: '{self.state}'")

    def sync_with_neighbor(self, neighbor):
        """Handles the 'Sleeping Neighbor' scenario."""
        print(f"\n--- Sync: {self.name} <-> {neighbor.name} ---")
        
        # Check if neighbor has a state we recognize
        if not self.DAG and self.snapshots:
            # We are pruned. If neighbor is very old, we need to rehydrate.
            print(f"[{self.name}] I am pruned. Checking if {neighbor.name} is 'sleeping'...")
            
            # Simulated check: Neighbor sends their last hash
            neighbor_last_hash = neighbor.DAG[-1]['hash'] if neighbor.DAG else '0'
            
            # If neighbor's hash is in our cold storage, we found the ancestor
            found_in_cold = False
            for vid, history in self.cold_storage.items():
                if any(e['hash'] == neighbor_last_hash for e in history):
                    print(f"[{self.name}] Ancestor found in Cold Storage (Archive {vid}). Rehydrating context...")
                    found_in_cold = True
                    return "REHYDRATION_SUCCESS"
            
            if not found_in_cold:
                print(f"[{self.name}] ERROR: Ancestor too old (Hard Fork). Manual intervention needed.")
                return "HARD_FORK"

# --- Q3: Astro II - Dependency Certificates ---

def generate_dependency_certificate(sender_id, amount, target_shard):
    """Generates a signed vouch for an offline payment."""
    tx_data = {
        "sender": sender_id,
        "amount": amount,
        "shard": target_shard,
        "nonce": time.time()
    }
    tx_json = json.dumps(tx_data)
    # Simulation of a Digital Signature (HMAC or RSA in real)
    signature = hashlib.sha256(f"SECRET_KEY_{tx_json}".encode()).hexdigest()
    
    certificate = {
        "tx": tx_data,
        "vouch": signature,
        "padrins": ["Node_LaTorre_01", "Node_Alcoleja_04"],
        "witness_sig": "MASTER_RELIANCE_SIG" # Proof that balance was checked
    }
    return certificate

def verify_astro_qr(qr_payload):
    """Simulates a merchant verifying an offline QR payment."""
    print("\n--- Verifying Astro QR ---")
    cert = json.loads(qr_payload)
    
    # 1. Verify signatures (Simulated)
    if cert['vouch'] and cert['witness_sig'] == "MASTER_RELIANCE_SIG":
        print(f"✔ Signature Valid. Dependency Certificate is AUTHENTIC.")
        print(f"✔ Balance Vouched by Shard Padrins: {cert['padrins']}")
        print(f"✔ Amount: {cert['tx']['amount']} Tele-Oli.")
        return True
    else:
        print("❌ FRAUD DETECTED: Invalid signature or missing dependencies.")
        return False

# --- Run Scenarios ---

def scenario_q1():
    print("# SCENARIO Q1: The Sleeping Neighbor (Tío Pep)")
    master = RhizomeNode("Master_Node")
    pep = RhizomeNode("TioPep_Mobile")
    
    # Common past
    master.commit("A")
    pep.commit("A")
    
    # Master moves forward and prunes
    master.commit("B")
    master.commit("C")
    master.prune("V1_2026")
    
    # Tio Pep was offline for 6 months (only has 'A')
    # pep.sync_with_neighbor(master)
    master.sync_with_neighbor(pep)

def scenario_q3():
    print("\n# SCENARIO Q3: Offline Astro Payment")
    # Rosa wants to pay 5 Tele-Oli
    cert = generate_dependency_certificate("Rosa_UID", 5, "Shard_Mercat")
    qr_data = json.dumps(cert)
    
    # Merchant verifies
    verify_astro_qr(qr_data)

if __name__ == "__main__":
    scenario_q1()
    scenario_q3()
