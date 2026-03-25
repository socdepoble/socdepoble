import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

export const authService = {
    /**
     * [MASTER REDIRECT] Get robust redirect URL
     * Ensures we don't end up in localhost:3000 or other local environments when in production/mobile
     */
    getRedirectUrl(path = '/chats') {
        const hostname = window.location.hostname;
        const origin = window.location.origin;

        // [MASTER PRODUCTION DOMAIN]
        const productionUrl = 'https://socdepoble.org';

        // 1. Si estem a producció (SiteGround), SEMPRE URL de producció oficial
        if (hostname.includes('socdepoble.org')) {
            return `${productionUrl}${path}`;
        }

        // 2. Si estem en localhost (qualsevol port), usem l'origin actual
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `${origin}${path}`;
        }

        // 3. Fallback total al domini mestre per a PWA, Capacitor, etc.
        return `${productionUrl}${path}`;
    },

    // Autenticación
    async signUp(email, password, metadata, redirectTo) {
        const options = { data: metadata };
        if (redirectTo) {
            options.emailRedirectTo = authService.getRedirectUrl(redirectTo);
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options
        });
        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    async resetPasswordForEmail(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: authService.getRedirectUrl('/reset-password'),
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async signInWithGoogle() {
        const redirectTo = authService.getRedirectUrl('/chats');
        logger.log('[Auth] Iniciant Google Login amb redirect a:', redirectTo);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo
            }
        });
        if (error) throw error;
        return data;
    },


    /**
     * Account Deletion System (5s Fast Track)
     * Calls the secure RPC 'delete_user' which invokes PostgreSQL ON DELETE CASCADE.
     */
    async deleteCurrentUser() {
        try {
            logger.info('[Account] Iniciant procediment d\'eliminació de compte...');
            const { error: rpcError } = await supabase.rpc('delete_user');
            if (rpcError) throw rpcError;
            
            // Si el borrat funciona, tanquem sessió al client per netejar el token local
            await supabase.auth.signOut();
            return { success: true };
        } catch (e) {
            logger.error('[Account] Error a l\'eliminar el compte:', e);
            throw e;
        }
    }
};
