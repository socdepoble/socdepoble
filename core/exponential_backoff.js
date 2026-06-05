// core/exponential_backoff.js
class ExponentialBackoff {
    constructor(maxReintents = 8, baseDelay = 1000) {
        this.maxReintents = maxReintents;
        this.baseDelay = baseDelay;
        this.reintents = 0;
    }

    async executaAmbBackoff(funcio) {
        while (this.reintents < this.maxReintents) {
            try {
                await funcio();
                this.reintents = 0;           // Èxit → reinici
                return true;
            } catch (error) {
                this.reintents++;
                const delay = this.baseDelay * Math.pow(2, this.reintents) + Math.random() * 500; // Jitter
                
                console.log(`❌ Error. Reintent ${this.reintents} en ${delay}ms`);
                await this.espera(delay);
            }
        }
        console.warn("Màxim de reintents assolit. Parant.");
        return false;
    }

    espera(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

if (typeof window !== 'undefined') {
    window.ExponentialBackoff = ExponentialBackoff;
}
