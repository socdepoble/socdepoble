import { useSyncExternalStore } from 'react';
import { rhizomeMesh } from '../core/services/RhizomeMesh';
import { bluetoothManager } from '../core/services/BluetoothManager';

/**
 * useRhizomeMesh (Zero Patch Architecture)
 * Sincroniza la telemetría P2P (Mulas, Cola de Deltas, Tamaño Doc) con React
 * usando useSyncExternalStore para evitar Effect-Cascades y Re-renders innecesarios.
 * La fuente de verdad reside en el Singleton abstracto (Fuera del Árbol VDOM).
 */

const getSnapshot = () => {
    // Retornar un snapshot inmutable para React
    // Se invoca el DiagnosticState que creamos en src/services/RhizomeMesh.js
    return JSON.stringify(rhizomeMesh.getDiagnosticState());
};

const subscribe = (callback) => {
    // 1. Nos suscribimos a cambios físicos de la Radio BLE
    const unsubscribeBle = bluetoothManager.subscribe(() => {
        callback();
    });

    // 2. Nos suscribimos al Reloj Lógico (Y.Doc)
    const handleYjsUpdate = () => callback();
    rhizomeMesh.rootDoc.on('update', handleYjsUpdate);

    // Limpieza atómica
    return () => {
        unsubscribeBle();
        rhizomeMesh.rootDoc.off('update', handleYjsUpdate);
    };
};

export const useRhizomeMesh = () => {
    // Obtenemos el snapshot serializado para evitar ciclos de render por referencias de objetos
    const snapshotStr = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    return JSON.parse(snapshotStr);
};
