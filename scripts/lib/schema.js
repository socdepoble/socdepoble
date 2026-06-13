import { z } from 'zod';

// ═══════════════════════════════════════════════════════════
// ESQUEMA D'UN MICRORECORD (Unitat Semàntica)
// ═══════════════════════════════════════════════════════════
export const MicrorecordSchema = z.object({
  id: z.string().regex(/^MR-[A-Z0-9-]+$/),
  tipus: z.enum([
    'fet',              // Quelcom que ha passat
    'decisio',          // Decisió arquitectònica presa
    'llico',            // Lliçó apresa
    'cicatriu',         // Error dolorós que no volem repetir
    'tombstone',        // Decisió anterior soterrada
    'idea_descartada',  // Idea rebutjada (i per què)
    'patro'             // Patró detectat
  ]),
  titol: z.string().min(5).max(120),
  descripcio: z.string().min(10),
  impacte: z.number().int().min(1).max(5),        // 1=cosmetic, 5=estructural
  intensitat_emocional: z.number().min(0).max(1), // 0=neutre, 1=visceral
  emocions: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  timestamp: z.string().datetime()
});

// ═══════════════════════════════════════════════════════════
// ESQUEMA DE L'ACTA COMPLETA (YAML 4.0)
// ═══════════════════════════════════════════════════════════
export const ActaSchema = z.object({
  act_id: z.string().regex(/^\d{4}-\d{2}-\d{2}_\d{4}_[A-Z0-9_]+$/),
  timestamp: z.string().datetime(),
  durada_minuts: z.number().int().positive(),
  
  // ─── TERMODINÀMICA ───────────────────────────────────
  termodinamica: z.object({
    temperatura_cognitiva: z.number().min(0).max(1),
    entropia_context: z.number().min(0).max(1),
    flux_creatiu: z.enum(['lineal', 'emergent', 'fragmentat', 'bloquejat']),
    cohesio_equip: z.number().min(0).max(1)
  }),
  
  // ─── MICRORECORDS ────────────────────────────────────
  microrecords: z.array(MicrorecordSchema).min(1),
  
  // ─── NARRATIVA ───────────────────────────────────────
  narrativa: z.object({
    metafora_central: z.string(),
    llico_global: z.string()
  }),
  
  // ─── METADADES ───────────────────────────────────────
  metadades: z.object({
    tokens_consumits: z.number().int().optional(),
    tokens_estalviats: z.number().int().optional(),
    eficiencia_termodinamica: z.number().optional(),
    agents_participants: z.array(z.string()).default([]),
    skills_tocats: z.array(z.string()).default([])
  }),
  
  // ─── ENLLAÇOS ────────────────────────────────────────
  dependencies: z.array(z.string()).default([]),
  recomanacio_lectura: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});

// ═══════════════════════════════════════════════════════════
// OPCIONS DE L'ENTREVISTA
// ═══════════════════════════════════════════════════════════
export const TIPUS_MICRORECORD = {
  fet: { emoji: '📌', label: 'Fet (quelcom que ha passat)' },
  decisio: { emoji: '🗿', label: 'Decisió arquitectònica' },
  llico: { emoji: '📚', label: 'Lliçó apresa' },
  cicatriu: { emoji: '🩹', label: 'Cicatriu (error dolorós)' },
  tombstone: { emoji: '⚰️', label: 'Tombstone (decisió soterrada)' },
  idea_descartada: { emoji: '🗑️', label: 'Idea descartada' },
  patro: { emoji: '🔁', label: 'Patró detectat' }
};

export const EMOCIONS_DISPONIBLES = [
  'curiositat', 'frustracio', 'orgull', 'confusio',
  'col-laboracio', 'urgencia', 'reverencia', 'alegria',
  'ansietat', 'serenitat', 'determinacio', 'empatia'
];

export const FLUXOS_CREATIUS = [
  { name: '🌊 Lineal: pas a pas, sense sorpreses', value: 'lineal' },
  { name: '🌱 Emergent: idees que floreixen', value: 'emergent' },
  { name: '⚡ Fragmentat: salts entre temes', value: 'fragmentat' },
  { name: '🧱 Bloquejat: costant trobar solucions', value: 'bloquejat' }
];
