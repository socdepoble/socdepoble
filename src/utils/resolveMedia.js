import { MEDIA_REGISTRY } from '../data/media_registry';
export const resolveMedia = originalPath => {
  if (!originalPath || originalPath.startsWith('http')) return originalPath;

  // Si viene del registry, buscar por nombre base. Esto arregla los links rotos por cambios de carpeta
  const filename = originalPath.split('/').pop().split('?')[0];
  const found = MEDIA_REGISTRY?.media?.find(m => m.filename === filename);
  return found ? found.path : originalPath;
};