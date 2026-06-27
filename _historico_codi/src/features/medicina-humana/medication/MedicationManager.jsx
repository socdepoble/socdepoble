import { useState, useEffect } from 'react';
import { medicationService } from '../../../core/services/medicationService';

const COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

const MedicationManager = () => {
  const [medications, setMedications] = useState([]);
  const [hasPermission, setHasPermission] = useState(Notification.permission === 'granted');
  
  // Nuevo formulario
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newColor, setNewColor] = useState(COLORS[0]);

  const loadMedications = async () => {
    const meds = await medicationService.getScheduledMedications();
    setMedications(meds);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMedications();
  }, []);

  const handleRequestPermission = async () => {
    const granted = await medicationService.requestNotificationPermission();
    setHasPermission(granted);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMed = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      time: newTime,
      color: newColor,
    };

    await medicationService.scheduleMedication(newMed);
    await loadMedications();
    
    // Reset
    setNewName('');
    setNewTime('08:00');
  };

  const handleDelete = async (id) => {
    await medicationService.deleteMedication(id);
    await loadMedications();
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-3xl bg-[var(--surface-color)] p-6 shadow-sm ring-1 ring-[#00000008] dark:ring-[#ffffff0a]">
      
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--text-main)]">
          La Meva Medicació
        </h2>
        {hasPermission ? (
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <Bell size={16} /> Actiu
          </div>
        ) : (
          <button 
            onClick={handleRequestPermission}
            className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700 active:scale-95 dark:bg-red-900/30 dark:text-red-400"
          >
            <BellOff size={16} /> Activar Alarmes
          </button>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-4 rounded-2xl bg-[var(--background-color)] p-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-[var(--text-muted)]">Nom de la Pastilla</label>
          <input 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ex: Sintrom..."
            className="rounded-xl border-none bg-[var(--surface-color)] p-3 text-[16px] font-medium text-[var(--text-main)] outline-none ring-1 ring-[var(--outline-color)] focus:ring-2 focus:ring-[var(--primary-color)]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-[var(--text-muted)]">Hora</label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 text-[var(--text-muted)]" size={18} />
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full rounded-xl border-none bg-[var(--surface-color)] p-3 pl-10 text-[16px] font-bold text-[var(--text-main)] outline-none ring-1 ring-[var(--outline-color)] focus:ring-2 focus:ring-[var(--primary-color)]"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-[var(--text-muted)]">Color</label>
            <div className="flex h-[48px] items-center justify-between rounded-xl bg-[var(--surface-color)] px-2 ring-1 ring-[var(--outline-color)]">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className={`h-6 w-6 rounded-full transition-transform ${newColor === c ? 'scale-125 ring-2 ring-[var(--primary-color)] ring-offset-2 dark:ring-offset-[var(--surface-color)]' : ''}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Seleccionar color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={!newName.trim()}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-color)] py-3 font-ui text-[16px] font-bold text-[var(--on-primary)] transition-transform active:scale-95 disabled:opacity-50"
        >
          <Plus size={20} />
          Afegir Alarma
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {medications.length === 0 ? (
          <p className="py-4 text-center text-sm font-medium text-[var(--text-muted)]">
            No tens cap medicació programada.
          </p>
        ) : (
          medications.map((med) => (
            <div key={med.id} className="flex items-center justify-between rounded-2xl bg-[var(--background-color)] p-4">
              <div className="flex items-center gap-4">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-sm"
                  style={{ backgroundColor: med.color }}
                >
                  <span className="text-xl">💊</span>
                </div>
                <div>
                  <h3 className="font-ui text-[18px] font-bold text-[var(--text-main)]">{med.name}</h3>
                  <p className="font-ui text-[15px] font-medium text-[var(--text-muted)]">{med.time}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(med.id)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-muted)] active:bg-red-100 active:text-red-500 transition-colors"
                aria-label="Esborrar"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default MedicationManager;
