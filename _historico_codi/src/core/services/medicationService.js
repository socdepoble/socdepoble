import { openDB } from 'idb';

const DB_NAME = 'socdepoble_medication_v1';
const DB_VERSION = 1;
const STORE_NAME = 'medications';

export const medicationService = {
  async initDB() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('status', 'status');
        }
      },
    });
  },

  async scheduleMedication(payload) {
    const db = await this.initDB();
    const id = await db.add(STORE_NAME, {
      ...payload,
      status: 'pending',
      createdAt: Date.now(),
    });

    // Send payload to ServiceWorker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_MEDICATION',
        payload: { id, ...payload },
      });
    }

    return id;
  },

  async confirmMedication(id) {
    const db = await this.initDB();
    const med = await db.get(STORE_NAME, id);
    if (med) {
      med.status = 'taken';
      med.takenAt = Date.now();
      await db.put(STORE_NAME, med);
    }
    return med;
  },

  async snoozeMedication(id, snoozeMs = 10 * 60 * 1000) {
    const db = await this.initDB();
    const med = await db.get(STORE_NAME, id);
    if (med) {
      med.timestamp = Date.now() + snoozeMs;
      await db.put(STORE_NAME, med);

      // Reschedule in SW
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_MEDICATION',
          payload: { id, ...med },
        });
      }
    }
  },

  async getScheduledMedications() {
    const db = await this.initDB();
    return db.getAllFromIndex(STORE_NAME, 'timestamp');
  },

  async deleteMedication(id) {
    const db = await this.initDB();
    await db.delete(STORE_NAME, id);
  },

  async requestNotificationPermission() {
    if (!('Notification' in window)) return false;
    let permission = Notification.permission;
    if (permission !== 'granted' && permission !== 'denied') {
      permission = await Notification.requestPermission();
    }
    return permission === 'granted';
  }
};
