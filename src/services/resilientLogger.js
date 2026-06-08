/**
 * RESILIENT LOGGER (El Silenci del Logger)
 * Cumpleix amb l'Acció Atòmica 3 de l'Auditoria dels 12 Savis.
 * 
 * En lloc de ser importat per 59 components (creant un God Node), 
 * aquest servei s'inicia una vegada a l'arrel de l'aplicació i escolta 
 * els esdeveniments 'app:log' emesos des de qualsevol lloc de l'aplicació.
 *
 * En mode offline, acumula un màxim de 100 registres en memòria per no 
 * esgotar la memòria de l'iPad A10.
 */

class ResilientLoggerService {
    constructor() {
        this.MAX_BUFFER_SIZE = 100;
        this.buffer = [];
        this.isOnline = navigator.onLine;

        this.initListeners();
    }

    initListeners() {
        // Escolta els logs emesos pels components
        window.addEventListener('app:log', this.handleLogEvent.bind(this));

        // Escolta els canvis de xarxa per a buidar el buffer
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', () => { this.isOnline = false; });
    }

    handleLogEvent(event) {
        const { level, message, args } = event.detail;

        if (!this.isOnline) {
            // Buffer FIFO (expulsa el més antic si supera el límit)
            if (this.buffer.length >= this.MAX_BUFFER_SIZE) {
                this.buffer.shift();
            }
            this.buffer.push({ level, message, args, timestamp: Date.now() });
        } else {
            // Si estem online, podríem enviar-ho directament al servidor (Supabase Edge Function)
            // Per ara només emulem l'eixida a consola si estem en desenvolupament
            if (process.env.NODE_ENV === 'development') {
                this.printToConsole(level, message, args);
            }
        }
    }

    handleOnline() {
        this.isOnline = true;
        if (this.buffer.length > 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`%c[ResilientLogger] Xarxa recuperada. Buidant ${this.buffer.length} logs acumulats...`, 'color: #10b981');
            }
            
            // Aci s'enviaria el lot sencer via PowerSync o fetch
            // this.flushBufferToBackend(this.buffer);
            
            this.buffer = []; // Buidem la memòria
        }
    }

    printToConsole(level, message, args) {
        const styles = {
            info: 'color: #3b82f6',
            warn: 'color: #f59e0b',
            error: 'color: #ef4444',
            debug: 'color: #8b5cf6'
        };
        const style = styles[level] || 'color: #94a3b8';
        
        switch(level) {
            case 'error': console.error(message, ...args); break;
            case 'warn': console.warn(message, ...args); break;
            case 'info': console.info(message, ...args); break;
            default: console.log(`%c[ASYNC] ${message}`, style, ...args); break;
        }
    }
}

// Singleton instantiation
export const resilientLogger = new ResilientLoggerService();
