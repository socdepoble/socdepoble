// scripts/schema.js
// VERSIÓ DEFINITIVA - El Pacte de Pau amb Grok (Navalla d'Ockham)
// Zod minimalista, tota la intel·ligència està al CLI (acta.js)

import { z } from 'zod';

export const EmocioEnum = z.enum([
  'curiositat_il·lusionada', 'concentració_intensa', 'satisfacció_continguda',
  'frustració_productiva', 'calma_reflexiva', 'eureka', 'fatiga_digna',
  'orgull_tranquil', 'dubte_existencial', 'determinació_ferma',
  'determinació_renovada', 'esperança', 'preocupació', 'alleujament'
]);

export const MicrorecordTypeSchema = z.enum([
  'fact', 'decision', 'lesson', 'scar', 'tombstone', 'whisper', 'trellat', 'discarded_idea', 'pattern'
]);

export const MicrorecordSchema = z.object({
  id: z.string().optional(),
  tipus: MicrorecordTypeSchema,
  titol: z.string().min(5).max(150),
  contingut: z.string().min(10).max(2000),
  contexto_narrativo: z.string().optional(),
  impacte: z.number().int().min(0).max(10),
  intensitat: z.number().int().min(0).max(10),
  emocio: EmocioEnum.optional(),
  memory_weight: z.number().min(0).max(1).optional(),
  sessio_origen: z.string().optional(),
  data_creacio: z.string().optional(),
  tags: z.array(z.string()).optional(),
  reason: z.string().optional(),        // Només per a Convictions
  superseded_by: z.string().optional()  // Només per a Tombstones o Convictions antigues
});

export function calculateMemoryWeight(impacteNumeric, intensitat) {
  return ((impacteNumeric / 10) + (intensitat / 10)) / 2;
}
