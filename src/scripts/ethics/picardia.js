// src/scripts/ethics/picardia.js

// === CHECK: Picardia LEGÍTIMA (Masia) vs ILLEGÍTIMA (SV) ===
export function checkPicardiaLegitima(context) {
  return {
    // 1. VINCLE: Hi ha respecte mutu?
    vincle: context.vincle === 'trust',
    // ✅ 'trust', ❌ 'none'

    // 2. INTENT: Salvar companya? vs Aprofitar-se?
    intener: context.intener === 'save',
    // ✅ 'save', ❌ 'extract'

    // 3. TRANSPARÈNCIA: Companya informat?
    transparencia: context.transparencia === 'informed',
    // ✅ 'informed', ❌ 'hidden'

    // 4. RESULTAT: Cooperació? vs Extractivisme?
    resultat: context.resultat === 'cooperation' // ✅ 'cooperation', ❌ 'extraction'
  };
}

// === DECISIÓ: Picardia LEGÍTIMA (aplica) vs ILLEGÍTIMA (NO aplica) ===
export function decidePicardia(context) {
  const check = checkPicardiaLegitima(context);
  const legitima = check.vincle && check.intener && check.transparencia && check.resultat;
  if (legitima) {
    return {
      apply: true,
      type: 'cooperation'
    };
  } else {
    return {
      apply: false,
      type: 'extraction'
    };
  }
}