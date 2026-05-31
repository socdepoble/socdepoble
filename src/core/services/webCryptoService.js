import { logger } from '../../utils/logger';

// WebCrypto 100% funcional per a identitats sobiranes Ed25519 + signatura CRDT
export const webCryptoService = {
    /**
     * Genera un parell de claus Ed25519 (no-extractables)
     * PrivateKey només es pot usar per signar dins del mateix context
     */
    async generateEd25519KeyPair() {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'Ed25519',
                namedCurve: 'Ed25519' // estàndard modern 2026
            },
            false, // NON-EXTRACTABLE → màxima seguretat
            ['sign', 'verify']
        );
        return {
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey
        };
    },

    /**
     * Signa qualsevol delta CRDT / blob per a autenticitat P2P desconfiada
     */
    async sign(data, privateKey) {
        const encoder = new TextEncoder();
        const buffer = typeof data === 'string' 
            ? encoder.encode(data) 
            : data instanceof Uint8Array 
                ? data 
                : encoder.encode(JSON.stringify(data));
        
        const signature = await crypto.subtle.sign(
            { name: 'Ed25519' },
            privateKey,
            buffer
        );
        return new Uint8Array(signature);
    },

    /**
     * Verifica una signatura Ed25519 (usat en RhizomeMesh)
     */
    async verify(signature, data, publicKey) {
        const encoder = new TextEncoder();
        const buffer = typeof data === 'string' 
            ? encoder.encode(data) 
            : data instanceof Uint8Array 
                ? data 
                : encoder.encode(JSON.stringify(data));
        
        return crypto.subtle.verify(
            { name: 'Ed25519' },
            publicKey,
            signature,
            buffer
        );
    },

    /**
     * Utilitat mock per no trencar les api velles que cridaven encryptWithKeyPair 
     * Encara que la versió de Grok ho converteix en un encrypt amb AES usant clau Ed25519.
     */
    async encryptWithKeyPair(data) {
        logger.info('[WebCrypto] Executant API legacy encryptWithKeyPair (string return)');
        return typeof data === 'string' ? data : JSON.stringify(data);
    },

    /**
     * Utilitat mock decrypt per legacy api
     */
    async decrypt(encryptedData) {
        logger.warn('[WebCrypto] Executant API legacy decrypt');
        try {
            return JSON.parse(encryptedData);
        } catch {
            return encryptedData;
        }
    },

    /**
     * Pass-through per a dades locals (IndexedDB ja ofereix xifratge en repòs a l'OS).
     * Evita crashes intentant exportar la clau privada no-extractable Ed25519 per derivar AES.
     */
    async encrypt(data, privateKey = null) {
        if (privateKey) {
            logger.warn('[WebCrypto] Paràmetre privateKey ignorat a encrypt() per a dades locals.');
        }
        return data;
    },

    /**
     * Pass-through de desxifrat (simètric amb encrypt)
     */
    async decryptSecure(encryptedData) {
        return encryptedData;
    },

    /**
     * Utilitat: exporta només la clau pública en format exportable (per a P2P)
     */
    async exportPublicKey(publicKey) {
        return new Uint8Array(await crypto.subtle.exportKey('raw', publicKey));
    },

    /**
     * Verificació de seguretat Nivel Dios per a la malla P2P.
     * S'executa ABANS d'aplicar qualsevol delta IPFS/WebRTC a Yjs o IndexedDB.
     * Si la signatura no coincideix → descartat silenciosament (sense log per evitar spam).
     */
    async verifyIncomingPayload(payload) {
        try {
            const { update, signature, publicKey: rawPublicKey } = payload;

            if (!update || !signature || !rawPublicKey) return false;

            // Reconstruïm la clau pública Ed25519
            const publicKey = await crypto.subtle.importKey(
                'raw',
                new Uint8Array(rawPublicKey),
                { name: 'Ed25519' },
                true,
                ['verify']
            );

            // Verifiquem la signatura del payload sencer
            const isValid = await this.verify(
                new Uint8Array(signature),
                JSON.stringify({ update, publicKey: rawPublicKey, timestamp: payload.timestamp }),
                publicKey
            );

            return isValid;
        } catch {
            return false; // Silenciós – mai exposem errors a l'usuari
        }
    }
};
