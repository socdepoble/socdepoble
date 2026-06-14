import { supabaseService } from '../core/services/supabaseService';
export class SupabaseConnector {
  async fetchCredentials() {
    const {
      data: {
        session
      }
    } = await supabaseService.supabase.auth.getSession();

    // Si no hi ha sessió local (anònim), tallem d'arrel perquè el backend no intente res ofegant logs.
    if (!session?.access_token) return null;
    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL || 'https://foo.powersync.com',
      token: session.access_token
    };
  }

  // Aquesta funció s'executa automàticament per PowerSync en els cicles de Heartbeat interns
  async uploadData(database) {
    // 1. Embut protector (BATCHING). Max 25 transaccions de la cua CRUD de PowerSync
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;
    try {
      const recordsToSync = [];
      for (const op of transaction.crud) {
        // En Sóc de Poble Fase 11, només enviem els lots consolidats amb metadades
        // La clau és que la inserció a local ja portava els camps _old_record i estat actual.
        // PowerSync guarda això a op.opData per a UPSERTS/UPDATES

        const payload = {
          id: op.id,
          updated_at: new Date().toISOString(),
          // TIMESTAMP STRICT
          new_record: op.opData || {},
          old_record: op.opData?._old_record || {} // El camp virtual injectat per la UI.
        };
        recordsToSync.push(payload);

        // Protecció de seguretat (Batching max)
        if (recordsToSync.length >= 25) break;
      }
      if (recordsToSync.length > 0) {
        // 2. Transmissió i FUSIÓ MÀGICA (RPC)
        const {
          error
        } = await supabaseService.supabase.rpc('process_sync_batch_v11', {
          batch: recordsToSync
        });
        if (error) {
          console.error('[SupabaseConnector] Error pujant lot CRDT:', error);

          // Si l'error és un 401 o 403, podria ser un token expirat, PowerSync tornarà a cridar fetchCredentials automàticament
          if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
            throw new Error('AUTH_ERROR');
          }
          throw new Error(`Supabase RPC Error: ${error.message}`);
        }
        // 3. Purga Local. Si ha anat bé, esborrem la transacció de la cua local.
        await transaction.complete();
      } else {
        // Si no hi havia registres vàlids al lot però hi havia op, descartem
        await transaction.complete();
      }
    } catch (ex) {
      console.warn('[SupabaseConnector] Transacció retinguda per indisponibilitat o error transitori. En pausa.', ex.message);
      // Llançant l'error, la cua de PowerSync fa un backoff exponencial automàtic i ho reintentarà
      throw ex;
    }
  }
}