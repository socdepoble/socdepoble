/**
 * Kademlia DHT & Geo-Sharding Prototype (V15 Plaza Infinita)
 * 
 * OBJECTIVE:
 * Replace V14 full-mesh gossip with an O(log N) structured topology.
 * In a Kademlia-based "Plaza", peers are assigned a Node ID.
 * Distance between peers is the XOR of their Node IDs.
 * Bando (Event) propagation is limited to K nearest neighbors (K-buckets).
 */

// Simulating a 160-bit space (we'll use a simplified 32-bit hash for the mock)
export class KademliaNode {
    constructor(peerId, coords = { lat: 0, lng: 0 }) {
        this.peerId = peerId;
        this.numericId = this._hash(peerId);
        this.coords = coords;
        this.kBuckets = Array.from({ length: 32 }, () => []);
        this.K = 20; // Max peers per bucket
    }

    _hash(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 33) ^ str.charCodeAt(i);
        }
        return hash >>> 0;
    }

    // XOR distance metric
    distanceTo(otherNumericId) {
        return this.numericId ^ otherNumericId;
    }

    // Geographical Sharding: Voronoi Tessellation Penalty
    // If a node is geographically far, we artificially inflate its XOR distance
    // to keep local data local (Sobirania Tecnològica).
    geoDistancePenalty(otherCoords) {
        if (!otherCoords.lat || !otherCoords.lng) return 1;
        const R = 6371e3; // Earth radius
        const φ1 = (this.coords.lat * Math.PI) / 180;
        const φ2 = (otherCoords.lat * Math.PI) / 180;
        const Δφ = ((otherCoords.lat - this.coords.lat) * Math.PI) / 180;
        const Δλ = ((otherCoords.lng - this.coords.lng) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceMeters = R * c;

        // Cap at 50km radius for local Comarca
        // Anything above gets an exponentially higher penalty
        return distanceMeters > 50000 ? Math.pow(distanceMeters / 50000, 2) : 1;
    }

    addPeer(peerId, coords) {
        const contactId = this._hash(peerId);
        const dist = this.distanceTo(contactId);
        // Find bucket index based on most significant bit of distance
        const bucketIndex = dist === 0 ? 0 : Math.floor(Math.log2(dist));
        
        const bucket = this.kBuckets[bucketIndex];
        const existing = bucket.findIndex(p => p.id === peerId);
        
        if (existing !== -1) {
            // Move to tail (most recently seen)
            const peer = bucket.splice(existing, 1)[0];
            bucket.push(peer);
        } else if (bucket.length < this.K) {
            bucket.push({ id: peerId, numericId: contactId, coords });
        } else {
            // In a real Kad, we ping the head. If it responds, drop new peer (or keep in replacement cache).
            // For this proto, we drop.
        }
    }

    findClosestPeers(targetIdStr, count = this.K) {
        const targetId = this._hash(targetIdStr);
        let allPeers = [];
        for (const bucket of this.kBuckets) {
            allPeers.push(...bucket);
        }
        
        // Sort by XOR distance * Geo Penalty
        allPeers.sort((a, b) => {
            const distA = (this.numericId ^ a.numericId) * this.geoDistancePenalty(a.coords);
            const distB = (this.numericId ^ b.numericId) * this.geoDistancePenalty(b.coords);
            return distA - distB;
        });

        return allPeers.slice(0, count);
    }
}

export const createLocalNode = (myId, coords) => new KademliaNode(myId, coords);
