import { secureStorage } from './secureStorage';

/**
 * Token Manager for Google Calendar and other secure integrations.
 * Wraps secureStorage implementation with fallback migrations.
 */
class SecureTokenStorage {
    constructor() {
        this.GCAL_TOKEN_KEY = 'gcal_access_token_secure';
    }

    async getToken() {
        try {
            // Check for emergency migration from localStorage
            const legacyToken = localStorage.getItem('gcal_access_token');
            if (legacyToken) {
                await this.setToken(legacyToken);
                localStorage.removeItem('gcal_access_token');
                return legacyToken;
            }
            return await secureStorage.get(this.GCAL_TOKEN_KEY);
        } catch (err) {
            console.error('[SecureTokenStorage] Error getting token:', err);
            return null;
        }
    }

    async setToken(token) {
        try {
            await secureStorage.set(this.GCAL_TOKEN_KEY, token);
        } catch (err) {
            console.error('[SecureTokenStorage] Error setting token:', err);
        }
    }

    async removeToken() {
        try {
            await secureStorage.remove(this.GCAL_TOKEN_KEY);
            localStorage.removeItem('gcal_access_token');
        } catch (err) {
            console.error('[SecureTokenStorage] Error removing token:', err);
        }
    }
}

export const secureTokenStorage = new SecureTokenStorage();
