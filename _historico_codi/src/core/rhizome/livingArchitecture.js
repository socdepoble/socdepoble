/**
 * ============================================================================
 * Sóc de Poble – Arquitectura Viva (L'Alquímia Compartida)
 * Mòdul: Tipografia Emocional + Agrupació Traumatològica + Portades Vives
 * Zero dependències - Offline First - Compatible amb Affinity Publisher MCP
 * ============================================================================
 */

/**
 * 1. TIPOGRAFIA VARIABLE EMOCIONAL - ZERO-DEPS
 * Aplica estils CSS dinàmics a nivell de paràgraf basant-se en anàlisi heurístic local
 */
export function applyEmotionalTypography(container, options = {}) {
  const config = {
    intensity: options.intensity || 0.7,
    minWeight: 300,
    maxWeight: 700,
    minSpacing: -0.02,
    maxSpacing: 0.08,
    melancholyBlur: options.melancholyBlur || 0,
    ...options
  };

  const PARAGRAPH_LEXICON = {
    weight: new Set(['treball', 'fatiga', 'dur', 'dura', 'esforç', 'mans', 'terra', 'pes', 'cansament', 'llaurar', 'collir', 'suor', 'dolor', 'lluita', 'resistir']),
    lightness: new Set(['aire', 'vol', 'lleuger', 'lleugera', 'somni', 'record', 'enyor', 'silenci', 'suau', 'dolç', 'pau', 'calma', 'flotar', 'suspes']),
    melancholy: new Set(['trist', 'pena', 'plor', 'solitud', 'absent', 'perdut', 'manca', 'temps-perdut', 'làgrima', 'cor-trencat']),
    joy: new Set(['alegria', 'riu', 'festes', 'cant', 'ball', 'esperança', 'vida', 'amor', 'agraït', 'llum'])
  };

  const paragraphs = container.querySelectorAll('p[data-affinity-style], article p');
  
  paragraphs.forEach(p => {
    const text = p.textContent.toLowerCase();
    if (!text.trim()) return;

    const counts = { weight: 0, lightness: 0, melancholy: 0, joy: 0 };
    const words = text.split(/\s+/).filter(w => w.length > 2);
    
    words.forEach(word => {
      if (PARAGRAPH_LEXICON.weight.has(word)) counts.weight++;
      if (PARAGRAPH_LEXICON.lightness.has(word)) counts.lightness++;
      if (PARAGRAPH_LEXICON.melancholy.has(word)) counts.melancholy++;
      if (PARAGRAPH_LEXICON.joy.has(word)) counts.joy++;
    });

    const norm = (count) => count / Math.max(1, words.length);
    const weightScore = clamp(norm(counts.weight) - norm(counts.lightness), -1, 1);
    const emotionalScore = clamp(norm(counts.melancholy) - norm(counts.joy), -1, 1);
    
    const cssVars = {
      '--para-font-weight': interpolate(weightScore, -1, 1, config.minWeight, config.maxWeight),
      '--para-letter-spacing': interpolate(emotionalScore, -1, 1, config.minSpacing, config.maxSpacing),
      '--para-line-height': 1.8 + (emotionalScore > 0 ? emotionalScore * 0.4 : 0),
      '--para-opacity': emotionalScore > 0.5 ? clamp(1 - (emotionalScore - 0.5) * 0.3, 0.85, 1) : 1,
      '--para-filter': config.melancholyBlur > 0 && emotionalScore > 0.6 ? `blur(${(emotionalScore - 0.6) * config.melancholyBlur}px)` : 'none'
    };

    Object.entries(cssVars).forEach(([key, value]) => {
      p.setAttribute(`data-${key.replace('--', '')}`, value);
    });
    
    p.classList.add(
      weightScore > 0.3 ? 'para-weight-heavy' : weightScore < -0.3 ? 'para-weight-light' : 'para-weight-neutral',
      emotionalScore > 0.3 ? 'para-tone-melancholy' : emotionalScore < -0.3 ? 'para-tone-joyful' : 'para-tone-neutral'
    );
  });

  injectEmotionalCSS(config);
}

function injectEmotionalCSS(config) {
  if (document.getElementById('emotional-typography-css')) return;
  const style = document.createElement('style');
  style.id = 'emotional-typography-css';
  style.textContent = `
    [data-affinity-style="Cos de text"], article p {
      --para-font-weight: 400;
      --para-letter-spacing: 0;
      --para-line-height: 1.8;
      --para-opacity: 1;
      --para-filter: none;
      font-weight: var(--para-font-weight);
      letter-spacing: var(--para-letter-spacing);
      line-height: var(--para-line-height);
      opacity: var(--para-opacity);
      filter: var(--para-filter);
      transition: font-weight 0.3s ease, letter-spacing 0.3s ease;
    }
    [data-affinity-style="Cos de text"][data-para-font-weight] {
      font-weight: attr(data-para-font-weight number);
    }
    @media (prefers-reduced-motion: reduce) {
      [data-affinity-style="Cos de text"], article p { transition: none !important; }
    }
    @media print {
      [data-affinity-style="Cos de text"], article p { filter: none !important; opacity: 1 !important; }
    }
  `;
  document.head.appendChild(style);
}

/**
 * 2. REORGANITZACIÓ TRAUMATOLÒGICA - ZERO-DEPS
 */
export function traumaAwareChapterGrouping(entries) {
  if (!entries || entries.length === 0) return [];

  const SENSITIVE_LEXICON = new Set([
    'guerra', 'bomba', 'mort', 'funeral', 'enterrar', 'viudo', 'viuda',
    'fam', 'misèria', 'plorar', 'dolor', 'patiment', 'trauma', 'record-dur',
    'presó', 'exili', 'repressió', 'por', 'amenaça', 'perill', 'sang'
  ]);

  const labeledEntries = entries.map(entry => {
    const text = (entry.text || '').toLowerCase();
    const words = text.split(/\s+/).filter(w => w.length > 3);
    const sensitiveCount = words.filter(w => SENSITIVE_LEXICON.has(w)).length;
    const sensitivityScore = clamp(sensitiveCount / Math.max(1, words.length) * 10, 0, 1);
    
    return {
      ...entry,
      _sensitivity: sensitivityScore,
      _emotionalWeight: calculateEmotionalWeight(text)
    };
  });

  const chapters = [];
  let currentChapter = { title: '', entries: [], maxSensitivity: 0, emotionalArc: [] };

  labeledEntries.forEach((entry, index) => {
    const shouldNewChapter = 
      (currentChapter.maxSensitivity > 0.7 && entry._sensitivity < 0.3) ||
      (currentChapter.entries.length >= 6) ||
      (index > 0 && Math.abs(entry._emotionalWeight - labeledEntries[index-1]._emotionalWeight) > 0.5);

    if (shouldNewChapter && currentChapter.entries.length > 0) {
      chapters.push(finalizeChapter(currentChapter));
      currentChapter = { title: '', entries: [], maxSensitivity: 0, emotionalArc: [] };
    }

    currentChapter.entries.push(entry);
    currentChapter.maxSensitivity = Math.max(currentChapter.maxSensitivity, entry._sensitivity);
    currentChapter.emotionalArc.push(entry._emotionalWeight);
  });

  if (currentChapter.entries.length > 0) {
    chapters.push(finalizeChapter(currentChapter));
  }

  return insertBreathingPages(chapters);
}

function calculateEmotionalWeight(text) {
  const positive = ['alegria', 'esperança', 'amor', 'vida', 'llum', 'somriure'].filter(w => text.includes(w)).length;
  const negative = ['trist', 'pena', 'dolor', 'por', 'mort', 'fam'].filter(w => text.includes(w)).length;
  return clamp((negative - positive) / 5, -1, 1);
}

function finalizeChapter(chapter) {
  const avgSensitivity = chapter.entries.reduce((sum, e) => sum + e._sensitivity, 0) / chapter.entries.length;
  let titlePrefix = avgSensitivity > 0.6 ? 'Memòria forjada: ' : avgSensitivity < 0.3 ? 'Dies de llum: ' : 'Records: ';
  const firstEntry = chapter.entries[0];
  const dateHint = firstEntry.timestamp ? new Date(firstEntry.timestamp).getFullYear() : 'Any';
  
  return {
    ...chapter,
    title: `${titlePrefix}${dateHint}`,
    metadata: {
      sensitivityLevel: avgSensitivity > 0.6 ? 'high' : avgSensitivity < 0.3 ? 'low' : 'medium',
      entryCount: chapter.entries.length,
      recommendedBreak: avgSensitivity > 0.6
    }
  };
}

function insertBreathingPages(chapters) {
  const result = [];
  chapters.forEach((chapter, index) => {
    result.push(chapter);
    if (chapter.metadata.sensitivityLevel === 'high' && index < chapters.length - 1) {
      result.push({
        type: 'breathing-page',
        title: 'Pausa per a respirar',
        content: 'Aquest espai és teu. Quan vulgues, continua amb la teua història.',
        metadata: { isBreak: true, durationSuggestion: '2-5 minuts' }
      });
    }
  });
  return result;
}

/**
 * 3. PORTADA VIVA I DINÀMICA - ZERO-DEPS
 */
export function generateLivingCover(voiceProfile, metadata) {
  const { scores = {emotional:0, rural:0, complexity:0}, classification = 'balanced-reflective' } = voiceProfile || {};
  
  const COLOR_PALETTE = {
    melancholic: {
      bg: 'linear-gradient(135deg, #e8f4f8 0%, #d4e9f1 100%)',
      text: '#2c3e50',
      accent: '#5d7a99',
      pattern: `url("data:image/svg+xml,%3Csvg width=\x2720\x27 height=\x2720\x27 xmlns=\x27http://www.w3.org/2000/svg\x27%3E%3Ccircle cx=\x2710\x27 cy=\x2710\x27 r=\x271\x27 fill=\x27%235d7a99\x27 opacity=\x270.1\x27/%3E%3C/svg%3E")`
    },
    joyful: {
      bg: 'linear-gradient(135deg, #fff9e6 0%, #ffecb3 100%)',
      text: '#3e2723',
      accent: '#ff9800',
      pattern: `url("data:image/svg+xml,%3Csvg width=\x2720\x27 height=\x2720\x27 xmlns=\x27http://www.w3.org/2000/svg\x27%3E%3Cpath d=\x27M10 2l2 4 4 .5-3 3 .8 4-4-2-4 2 .8-4-3-3 4-.5z\x27 fill=\x27%23ff9800\x27 opacity=\x270.15\x27/%3E%3C/svg%3E")`
    },
    rural: {
      bg: 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)',
      text: '#3e2723',
      accent: '#795548',
      pattern: `url("data:image/svg+xml,%3Csvg width=\x2740\x27 height=\x2740\x27 xmlns=\x27http://www.w3.org/2000/svg\x27%3E%3Cpath d=\x27M0 20h40M20 0v40\x27 stroke=\x27%23795548\x27 stroke-width=\x270.5\x27 opacity=\x270.1\x27/%3E%3C/svg%3E")`
    },
    balanced: {
      bg: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
      text: '#1a1a1a',
      accent: '#607d8b',
      pattern: 'none'
    }
  };

  let paletteKey = 'balanced';
  if (classification === 'melancholic-memory' || scores.emotional > 0.4) paletteKey = 'melancholic';
  else if (classification === 'joyful-recollection' || scores.emotional < -0.4) paletteKey = 'joyful';
  else if (scores.rural > 0.5) paletteKey = 'rural';
  
  const palette = COLOR_PALETTE[paletteKey];
  const dynamicSubtitle = generateDynamicSubtitle(classification, scores, metadata?.author);
  const patternOpacity = clamp(0.05 + scores.complexity * 0.15, 0.05, 0.2);
  
  const escapeXML = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const titleStr = escapeXML(metadata?.title || 'Llibre de Memòria');
  const authorStr = escapeXML(metadata?.author || '');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="ca">
<head>
  <title>${titleStr} — Portada</title>
  <meta charset="UTF-8"/>
  <style type="text/css"><![CDATA[
    @namespace epub "http://www.idpf.org/2007/ops";
    body {
      margin: 0; padding: 0;
      background: ${palette.bg};
      color: ${palette.text};
      font-family: Georgia, 'Times New Roman', serif;
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      min-height: 100vh; text-align: center;
      background-image: ${palette.pattern};
      background-blend-mode: multiply;
    }
    .cover-pattern { position: absolute; top:0; left:0; right:0; bottom:0; background-image: ${palette.pattern}; opacity: ${patternOpacity}; pointer-events: none; z-index: 0; }
    .cover-content { position: relative; z-index: 1; padding: 2rem; max-width: 90%; }
    .cover-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.2; color: ${palette.text}; text-shadow: 0 1px 2px rgba(255,255,255,0.8); }
    .cover-subtitle { font-size: 1.25rem; font-style: italic; color: ${palette.accent}; margin-bottom: 2rem; line-height: 1.4; }
    .cover-author { font-size: 1.1rem; margin-bottom: 0.5rem; opacity: 0.9; }
    .cover-meta { font-size: 0.9rem; opacity: 0.7; margin-top: 2rem; font-style: italic; }
    .cover-accent-bar { width: 60px; height: 4px; background: ${palette.accent}; margin: 1.5rem auto; border-radius: 2px; }
    @media (prefers-contrast: high) { body { background: #000 !important; color: #fff !important; } .cover-title, .cover-author { color: #fff !important; } .cover-subtitle { color: #90caf9 !important; } }
    @media print { .cover-pattern { display: none; } body { background: #fff !important; color: #000 !important; } }
  ]]></style>
</head>
<body epub:type="cover">
  <div class="cover-pattern" aria-hidden="true"></div>
  <div class="cover-content">
    <h1 class="cover-title" epub:type="title">${titleStr}</h1>
    <div class="cover-accent-bar" aria-hidden="true"></div>
    <p class="cover-subtitle" epub:type="subtitle">${dynamicSubtitle}</p>
    <p class="cover-author" epub:type="author">${authorStr}</p>
    <p class="cover-meta">Generat amb <span style="color:${palette.accent}">♥</span> a Sóc de Poble<br/>${new Date().toLocaleDateString('ca-ES')}</p>
  </div>
</body>
</html>`;
}

function generateDynamicSubtitle(classification, scores, authorName) {
  const templates = {
    'melancholic-memory': ['Records que perduren, veus que no s\'apaguen', 'La memòria com a riu: lent, profund, etern', 'Paraules guardades, ànimes que parlen'],
    'joyful-recollection': ['Riures que queden, llums que no s\'apaguen', 'La vida com a festa: moments que brillen', 'Històries amb cor, records amb somriure'],
    'rural-direct-action': ['Terra, esforç i veritat: la vida al camp', 'Mans que treballen, veus que perduren', 'Senzillesa i força: records del nostre poble'],
    'literary-elaborate': ['Els fils del temps teixits en paraules', 'Memòria com a literatura: vida com a art', 'Reflexions que perduren, veus que ressonen'],
    'energetic-spontaneous': ['Vida en directe: paraules sense filtres', 'Espontaneïtat pura, records en moviment', 'La teua veu, la teua història, ara i ací'],
    'balanced-reflective': ['Records amb calma, històries amb sentit', 'La memòria com a pont: passat i present', 'Paraules que queden, vides que inspiren']
  };
  const list = templates[classification] || templates['balanced-reflective'];
  const index = Math.abs(Math.round(scores.emotional * (list.length - 1) / 2));
  const base = list[Math.min(index, list.length - 1)];
  return authorName && authorName.length < 20 ? `${base} — ${authorName}` : base;
}

/**
 * 4. INTEGRACIÓ AFFINITY PUBLISHER (API execute_script)
 */
export function prepareForAffinity(epubHTML, voiceProfile) {
  const affinityMeta = `
    data-affinity-project="socdepoble"
    data-affinity-emotional-profile='${JSON.stringify({
      classification: voiceProfile.classification,
      scores: voiceProfile.scores,
      timestamp: Date.now()
    })}'
    data-affinity-typography-vars='${JSON.stringify({
      weightRange: [300, 700],
      spacingRange: [-0.02, 0.08],
      lineHeightBase: 1.8
    })}'
  `;
  return epubHTML.replace('<html', `<html ${affinityMeta}`);
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function interpolate(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}
