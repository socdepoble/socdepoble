import { extendTailwindMerge } from 'tailwind-merge';

// Patró per a les classes sp-*
const spPattern = /^sp-\d+$/;

// Configuració base de twMerge
const twMergeBase = extendTailwindMerge({
  extend: {
    classGroups: {
      'rounded': [{
        rounded: ['genesis', 'tactile', 'pill', 'card', spPattern]
      }],
      'margin': [{
        m: [spPattern],
        mx: [spPattern, 'auto'],
        my: [spPattern],
        mt: [spPattern],
        mb: [spPattern],
        ml: [spPattern, 'auto'],
        mr: [spPattern, 'auto']
      }]
    }
  }
});

// Classes CRÍTIQUES que MAI s'han d'eliminar sense avisar
const CRITICAL_CLASSES = new Set(['mx-auto', 'my-auto', 'm-auto', 'ml-auto', 'mr-auto', 'mt-auto', 'mb-auto', 'w-full', 'w-auto', 'w-screen', 'h-full', 'h-auto', 'h-screen', 'flex', 'grid', 'block', 'hidden', 'inline', 'inline-block', 'inline-flex', 'relative', 'absolute', 'fixed', 'sticky', 'overflow-hidden', 'overflow-auto', 'overflow-visible']);

// Prefixos crítics (si una classe comença per est prefix, és crítica)
const CRITICAL_PREFIXES = ['justify-', 'items-', 'self-', 'place-', 'order-', 'z-', 'top-', 'bottom-', 'left-', 'right-'];
function isCritical(className) {
  if (CRITICAL_CLASSES.has(className)) return true;
  return CRITICAL_PREFIXES.some(prefix => className.startsWith(prefix));
}

/**
 * twMerge amb auditor incorporat.
 * En DEV: detecta classes crítiques eliminades i les restaura amb un warning.
 * En PROD: comportament idèntic a twMerge normal (zero overhead).
 */
const warnedCombinations = new Set();
export function twMerge(...inputs) {
  const merged = twMergeBase(inputs);

  // Auditor només en DEV
  if (import.meta.env.DEV) {
    const inputString = inputs.join(' ');
    const inputClasses = inputString.split(/\s+/).filter(Boolean);
    const mergedClasses = merged.split(/\s+/).filter(Boolean);

    // Classes que estaven a l'input però no a l'output
    const removed = inputClasses.filter(c => !mergedClasses.includes(c));

    // Filtrar només les crítiques
    const criticalRemoved = removed.filter(isCritical);
    if (criticalRemoved.length > 0) {
      const warningKey = criticalRemoved.join('-');
      if (!warnedCombinations.has(warningKey)) {
        warnedCombinations.add(warningKey);

        // Fallback robust: queueMicrotask garantix l'execució després del render
        queueMicrotask(() => {
          console.warn('🧹 [twMerge Auditor] ALERTA: Classes crítiques eliminades!\n' + `  ❌ Eliminades: ${criticalRemoved.join(', ')}\n` + `  📥 Input: ${inputString}\n` + `  📤 Output: ${merged}\n` + `  💡 Revisa la configuració de twMerge si estes classes són necessàries.`);
        });
      }
    }
  }
  return merged;
}