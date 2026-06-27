/**
 * narrativeContinuity.js
 * Vanilla JS module (zero-deps) that provides:
 *  - analyzeNarrativeVoice(entries): heuristic, offline narrative voice analyzer
 *  - generarEPUBLive(doc, profile): adaptive EPUB structure generator (returns in-memory files)
 *
 * Usage:
 *   const profile = analyzeNarrativeVoice(book.entries);
 *   const files = generarEPUBLive(book, profile);
 *
 * Notes:
 *  - Non-destructive: user text is never altered; generator only wraps/structures for export.
 *  - Deterministic heuristics: no ML, pure statistics + small lexica.
 */

/* =========================
   Helper utilities
   ========================= */

function normalizeText(s) {
  return String(s || '').replace(/\r\n/g, '\n').replace(/\u00A0/g, ' ').trim();
}

function tokenizeWords(s) {
  return normalizeText(s)
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[^a-zàèéíòóúüçñ0-9'\- ]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function splitSentences(s) {
  // simple sentence splitter tuned for short texts; keeps punctuation
  const text = normalizeText(s);
  const parts = text
    .replace(/\n+/g, ' ')
    // Replace spaces after punctuation with a rare null character as delimiter
    .replace(/([.!?…])\s+/g, '$1\u0000')
    .split('\u0000')
    .map(p => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [text];
}

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = arr.slice().sort((a,b)=>a-b);
  const idx = Math.floor((p/100) * (sorted.length-1));
  return sorted[idx];
}

function uniqueCount(arr) {
  return new Set(arr).size;
}

function escapeXml(s='') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

/* =========================
   Small emotion lexica (compact, offline)
   - Designed for rural/biographical registers
   - Words are lowercase, stemmed lightly by inclusion
   ========================= */

const EMO_LEXICA = {
  sadness: [
    'trist', 'trista', 'tristesa', 'plor', 'plorar', 'enyor', 'enyorar', 'solitud', 'solitari',
    'perduda', 'perdut', 'dol', 'melancol', 'nostàlg', 'nostalg', 'pena', 'penós'
  ],
  joy: [
    'alegr', 'feliç', 'goig', 'goig', 'content', 'riure', 'riure', 'somriure', 'celebr',
    'fest', 'bona', 'bonic', 'orgull'
  ],
  anger: [
    'ira', 'rabia', 'rabiós', 'enfadat', 'enfadada', 'bronca', 'disgust', 'colèr', 'colera'
  ],
  nostalgia: [
    'record', 'recorde', 'antig', 'abans', 'quan', 'temps', 'vells', 'velles', 'nostàlgic'
  ],
  tenderness: [
    'tendresa', 'carinyo', 'carinyós', 'abraçada', 'abraçar', 'mima', 'mimar'
  ]
};

/* =========================
   Temporal markers and action markers
   ========================= */

const TEMPORAL_MARKERS = ['abans','quan','sempre','antigament','fa','ara','després','aleshores','aquell','aquella','aquells','aquelles'];
const ACTION_MARKERS = ['va','vaig','vam','van','fer','fent','feré','faria','anar','anava','arribar','sortir','entrar','córrer','caminar','agafar','donar','veure','veia','veig'];

/* =========================
   Pronoun sets (for intimacy / voice)
   ========================= */

const FIRST_PERSON = ['jo','me','m\'','em','nostre','nostra','nostres','nostros','nosaltres'];
const SECOND_PERSON = ['tu','vostè','vostés','vosaltres','vosté'];
const THIRD_PERSON = ['ell','ella','ells','elles'];

/* =========================
   Core: analyzeNarrativeVoice(entries)
   - entries: array of strings OR array of {text: string, createdAt?: ISO}
   - returns a profile object with many heuristics
   ========================= */

export function analyzeNarrativeVoice(entries) {
  // Normalize entries to strings
  const texts = (entries || []).map(e => typeof e === 'string' ? e : (e && e.text) ? e.text : '');
  const full = texts.join('\n\n').trim();
  const words = tokenizeWords(full);
  const sentences = splitSentences(full);
  const totalWords = words.length || 0;
  const totalSentences = sentences.length || 1;
  const avgSentenceLen = totalWords / totalSentences;
  const sentenceLengths = sentences.map(s => tokenizeWords(s).length);
  const medianSentenceLen = percentile(sentenceLengths, 50);
  const longSentenceRatio = sentenceLengths.filter(l => l > 25).length / Math.max(1, sentenceLengths.length);
  const shortSentenceRatio = sentenceLengths.filter(l => l <= 8).length / Math.max(1, sentenceLengths.length);

  // Lexical richness
  const uniqueWords = uniqueCount(words);
  const lexicalRichness = totalWords ? uniqueWords / totalWords : 0;

  // Temporal vs action markers
  const temporalCount = words.filter(w => TEMPORAL_MARKERS.includes(w)).length;
  const actionCount = words.filter(w => ACTION_MARKERS.includes(w)).length;
  const temporalRatio = totalWords ? temporalCount / totalWords : 0;
  const actionRatio = totalWords ? actionCount / totalWords : 0;

  // Pronoun usage
  const firstCount = words.filter(w => FIRST_PERSON.includes(w)).length;
  const secondCount = words.filter(w => SECOND_PERSON.includes(w)).length;
  const thirdCount = words.filter(w => THIRD_PERSON.includes(w)).length;
  const pronounProfile = {
    first: totalWords ? firstCount / totalWords : 0,
    second: totalWords ? secondCount / totalWords : 0,
    third: totalWords ? thirdCount / totalWords : 0
  };

  // Emotional scoring: simple frequency normalized by lexicon size
  const emotionScores = {};
  for (const [k, lex] of Object.entries(EMO_LEXICA)) {
    const count = words.filter(w => lex.some(x => w.indexOf(x) !== -1)).length;
    emotionScores[k] = totalWords ? count / totalWords : 0;
  }

  // Dominant emotion (highest normalized score)
  const dominantEmotion = Object.keys(emotionScores).reduce((a,b) => emotionScores[a] >= emotionScores[b] ? a : b, Object.keys(emotionScores)[0]);

  // Cadence: measure punctuation density and ellipses usage
  const punctuationDensity = (full.match(/[.,;:!?…]/g) || []).length / Math.max(1, totalWords);
  const ellipsisCount = (full.match(/\.{2,}/g) || []).length;

  // Readability proxy: Flesch-like simplified (not language-specific)
  const avgWordsPerSentence = avg(sentenceLengths) || 1;
  const avgSyllablesPerWord = estimateSyllablesPerWord(words) || 1;
  const fleschProxy = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

  // Tone temporal vs action
  const toneTemporalVsAction = {
    temporalRatio,
    actionRatio,
    label: temporalRatio > actionRatio ? 'reflective' : 'active'
  };

  // Style label heuristics
  let styleLabel = 'balanced';
  if (dominantEmotion === 'nostalgia' || temporalRatio > 0.02 || longSentenceRatio > 0.25) styleLabel = 'melancholic';
  if (shortSentenceRatio > 0.35 && actionRatio > 0.03) styleLabel = 'direct';
  if (emotionScores.joy > 0.01 && emotionScores.sadness < 0.005) styleLabel = 'cheerful';

  // Construct profile
  const profile = {
    summary: {
      totalWords,
      totalSentences,
      avgSentenceLen: Number(avgSentenceLen.toFixed(2)),
      medianSentenceLen,
      lexicalRichness: Number(lexicalRichness.toFixed(3)),
      punctuationDensity: Number(punctuationDensity.toFixed(4)),
      fleschProxy: Number(fleschProxy.toFixed(2))
    },
    cadence: {
      longSentenceRatio: Number(longSentenceRatio.toFixed(3)),
      shortSentenceRatio: Number(shortSentenceRatio.toFixed(3)),
      ellipsisCount
    },
    pronouns: pronounProfile,
    tone: {
      temporalRatio: Number(temporalRatio.toFixed(4)),
      actionRatio: Number(actionRatio.toFixed(4)),
      label: toneTemporalVsAction.label
    },
    emotions: emotionScores,
    dominantEmotion,
    styleLabel,
    heuristics: {
      // small flags for generator
      isReflective: toneTemporalVsAction.label === 'reflective' || dominantEmotion === 'nostalgia' || emotionScores.sadness > 0.005,
      isDirect: styleLabel === 'direct',
      isCheerful: styleLabel === 'cheerful'
    }
  };

  return profile;
}

/* =========================
   Small syllable estimator (language-agnostic heuristic)
   - Used for a readability proxy only
   ========================= */

function estimateSyllablesPerWord(words) {
  if (!words || words.length === 0) return 1;
  let total = 0;
  for (const w of words) {
    total += estimateSyllables(w);
  }
  return total / words.length;
}

function estimateSyllables(word) {
  const s = String(word || '').toLowerCase();
  if (!s) return 1;
  // vowel groups heuristic
  const groups = s.match(/[aeiouàèéíòóúüy]+/g);
  let count = groups ? groups.length : 0;
  // adjust for silent endings common in romance languages
  if (s.length <= 3) count = Math.max(1, count);
  return Math.max(1, count);
}

/* =========================
   EPUB Live Generator
   - generarEPUBLive(doc, profile)
   - doc: { id, meta: {title, lang}, blocks: [{id, title, content}] }
   - returns: { files: { 'nav.xhtml': string, 'content.opf': string, 'text/<id>.xhtml': string, 'styles.css': string }, manifest: {...} }
   ========================= */

export function generarEPUBLive(doc, profile) {
  const id = doc.id || `doc-${Date.now()}`;
  const title = doc.meta?.title || 'Llibre';
  const lang = doc.meta?.lang || 'ca';
  const blocks = doc.blocks || [];

  // Choose visual profile based on heuristics
  const visualProfile = chooseVisualProfile(profile);

  // Generate CSS tuned to profile
  const styles = generateAdaptiveCSS(visualProfile);

  // Generate nav.xhtml
  const nav = generateNavXhtml(doc, lang);

  // Generate content.opf
  const opf = generateContentOpf(doc, lang);

  // Generate each block XHTML
  const texts = {};
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const html = generateBlockXhtml(b, i, visualProfile, lang, profile);
    texts[`text/${b.id}.xhtml`] = html;
  }

  // Package files map
  const files = {
    'nav.xhtml': nav,
    'content.opf': opf,
    'styles.css': styles,
    ...texts
  };

  const manifest = {
    id, title, lang, visualProfile, profileSummary: profile
  };

  return { files, manifest };
}

/* =========================
   Visual profile chooser
   ========================= */

function chooseVisualProfile(profile) {
  // returns an object with classes and typographic choices
  const p = profile || {};
  const heur = p.heuristics || {};
  const emotion = p.dominantEmotion || 'neutral';
  const style = p.styleLabel || 'balanced';

  // base
  const vp = {
    name: 'default',
    bodyClass: 'theme-gran-llibre',
    quoteStyle: 'large-quote',
    separator: '—',
    titlePrefix: '',
    fontScale: 1.0,
    marginScale: 1.0
  };

  if (heur.isReflective || emotion === 'nostalgia' || style === 'melancholic') {
    vp.name = 'melancholic';
    vp.bodyClass = 'theme-gran-llibre';
    vp.quoteStyle = 'block-quote-large';
    vp.separator = '✦';
    vp.titlePrefix = 'Llibre I: ';
    vp.fontScale = 1.05;
    vp.marginScale = 1.05;
  } else if (heur.isDirect || style === 'direct') {
    vp.name = 'direct';
    vp.bodyClass = 'theme-direct-rustic';
    vp.quoteStyle = 'inline-sep';
    vp.separator = '•';
    vp.titlePrefix = 'Capítol ';
    vp.fontScale = 0.98;
    vp.marginScale = 0.95;
  } else if (heur.isCheerful) {
    vp.name = 'cheerful';
    vp.bodyClass = 'theme-cheerful';
    vp.quoteStyle = 'sun-quote';
    vp.separator = '★';
    vp.fontScale = 1.02;
    vp.marginScale = 1.0;
  } else {
    vp.name = 'balanced';
    vp.bodyClass = 'theme-gran-llibre';
    vp.quoteStyle = 'gentle-quote';
    vp.separator = '—';
    vp.titlePrefix = '';
  }

  return vp;
}

/* =========================
   CSS generator (adaptive)
   ========================= */

function generateAdaptiveCSS(vp) {
  // Minimal CSS tuned to profile; EPUB readers will apply their own, but we include helpful hints
  // Advanced variables for emotional typography and trauma reconstruction
  const base = `
/* Adaptive CSS generated by generarEPUBLive - Affinity MCP Ready */
@charset "utf-8";

:root {
  --color-text-main: #1C1C1C;
  --color-bg-base: #FAFAFA;
  --color-accent: #8E8A83;
  --font-family-body: "Noto Serif", "Georgia", serif;
  --font-family-display: "Playfair Display", "Times New Roman", serif;
  --spacing-p: 1.6em;
  --weight-dynamic: 400;
  --letter-dynamic: 0em;
}

html { font-family: var(--font-family-body); -webkit-text-size-adjust: none; background: var(--color-bg-base); }
body { margin: 1.5em; font-size: ${Math.round(18 * vp.fontScale)}px; line-height: var(--spacing-p); color: var(--color-text-main); }

.${vp.bodyClass} h1 { 
  font-family: var(--font-family-display);
  font-size: ${Math.round(32 * vp.fontScale)}px; 
  margin-bottom: 0.5em; 
  font-weight: 600;
  color: #111;
}

.${vp.bodyClass} p { 
  margin: 0 0 1.2em 0; 
  text-align: justify; 
  font-weight: var(--weight-dynamic);
  letter-spacing: var(--letter-dynamic);
}

/* Affinity MCP Targeting Classes */
.paragraf-malenconia { --letter-dynamic: 0.02em; --weight-dynamic: 300; opacity: 0.9; }
.paragraf-tensio { --weight-dynamic: 600; --letter-dynamic: -0.01em; }
.paragraf-pau { --weight-dynamic: 400; --letter-dynamic: 0.01em; }

.palabra-clau { color: var(--color-accent); font-style: italic; }

.${vp.bodyClass} .${vp.quoteStyle} { 
  font-style: italic; 
  margin: 1.5em 0; 
  padding-left: 1em; 
  border-left: 4px solid var(--color-accent); 
  color: #333; 
  font-size: 1.1em;
}

hr.separator { border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 2em 0; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

  if (vp.name === 'melancholic') {
    return base + `
:root {
  --color-text-main: #2A2A2A;
  --color-bg-base: #FDFCF8;
  --color-accent: #6C5B4E;
  --font-family-display: "Cormorant Garamond", serif;
}
`;
  }

  if (vp.name === 'direct') {
    return base + `
:root {
  --color-text-main: #111111;
  --color-bg-base: #FFFFFF;
  --color-accent: #8E2018; /* Rural soil red */
  --font-family-body: "Inter", "Noto Sans", sans-serif;
  --font-family-display: "Clash Display", sans-serif;
}
.${vp.bodyClass} p { text-align: left; }
`;
  }

  if (vp.name === 'cheerful') {
    return base + `
:root {
  --color-text-main: #1F2833;
  --color-bg-base: #FFFFFC;
  --color-accent: #E27D60; /* Warm sun */
}
`;
  }

  return base;
}

/* =========================
   Nav and OPF generators
   ========================= */

function generateNavXhtml(doc, lang='ca') {
  const items = (doc.blocks || []).map(b => `<li><a href="text/${escapeXml(b.id)}.xhtml">${escapeXml(b.title || b.id)}</a></li>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${escapeXml(lang)}">
  <head><meta charset="utf-8"/><title>Contents</title></head>
  <body>
    <nav epub:type="toc" id="toc" role="navigation" aria-label="Table of Contents">
      <h1>Contingut</h1>
      <ol>
        ${items}
      </ol>
    </nav>
  </body>
</html>`;
}

function generateContentOpf(doc, lang='ca') {
  const id = doc.id || 'doc';
  const title = escapeXml(doc.meta?.title || 'Llibre');
  const manifestItems = [];
  const spineItems = [];
  (doc.blocks || []).forEach((b, i) => {
    const href = `text/${escapeXml(b.id)}.xhtml`;
    manifestItems.push(`<item id="item-${i}" href="${href}" media-type="application/xhtml+xml"/>`);
    spineItems.push(`<itemref idref="item-${i}"/>`);
  });
  manifestItems.push(`<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`);
  manifestItems.push(`<item id="css" href="styles.css" media-type="text/css"/>`);
  return `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0" xml:lang="${escapeXml(lang)}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">${escapeXml(id)}</dc:identifier>
    <dc:title>${title}</dc:title>
    <dc:language>${escapeXml(lang)}</dc:language>
  </metadata>
  <manifest>
    ${manifestItems.join('\n    ')}
  </manifest>
  <spine>
    ${spineItems.join('\n    ')}
  </spine>
</package>`;
}

/* =========================
   Block XHTML generator (Affinity MCP Optimized)
   - Wraps user content in semantic XHTML, applies classes based on visualProfile
   - Does NOT alter user punctuation or words. Injects deep structural DOM.
   ========================= */

function generateBlockXhtml(block, index, vp, lang='ca', profile={}) {
  const title = escapeXml(block.title || `Secció ${index+1}`);
  const bodyClass = vp.bodyClass || 'theme-gran-llibre';
  const quoteStyle = vp.quoteStyle || 'gentle-quote';
  const separator = vp.separator || '—';

  // Heuristic: if block content has many temporal markers or long sentences, add an opening epigraph
  const content = normalizeText(block.content || '');
  const words = tokenizeWords(content);
  const temporalCount = words.filter(w => TEMPORAL_MARKERS.includes(w)).length;
  const sentenceLens = splitSentences(content).map(s => tokenizeWords(s).length);
  const longSentenceRatio = sentenceLens.filter(l => l > 25).length / Math.max(1, sentenceLens.length);

  // Deep Semantic Paragraph Analysis (Simulated for Affinity mapping)
  const paras = content.split(/\n{2,}/g).map(p => p.trim()).filter(Boolean);
  const paraHtml = paras.map(p => {
    // Micro-heuristic per paragraph to assign structural classes for EPUB/Affinity
    let pClass = "paragraf-base";
    let pEmotion = "neutral";
    const pWords = tokenizeWords(p);
    const pSadCount = pWords.filter(w => EMO_LEXICA.sadness?.some(x => w.indexOf(x) !== -1)).length;
    const pJoyCount = pWords.filter(w => EMO_LEXICA.joy?.some(x => w.indexOf(x) !== -1)).length;
    
    if (pSadCount > 0 && pSadCount > pJoyCount) { pClass = "paragraf-malenconia"; pEmotion = "sadness"; }
    else if (pJoyCount > pSadCount) { pClass = "paragraf-pau"; pEmotion = "joy"; }
    else if (pWords.length > 30) { pClass = "paragraf-dens"; pEmotion = "reflective"; }

    // Optional: Highlighting exact dictionary words (for visual or mapping purposes without alerting the user directly)
    let pContent = escapeXml(p);
    // Note: We avoid modifying the text itself, only wrapping it in spans for MCP capture
    
    return `<p class="${pClass}" data-emotion="${pEmotion}">${pContent}</p>`;
  }).join('\n    ');

  // Optional epigraph or decorative quote for reflective texts
  let epigraph = '';
  if (profile.heuristics && profile.heuristics.isReflective && (temporalCount > 2 || longSentenceRatio > 0.2)) {
    const firstSentence = splitSentences(content)[0] || '';
    epigraph = `
    <div class="epigraph-container" data-affinity-style="Epigraph">
      <blockquote class="${quoteStyle}">${escapeXml(firstSentence)}</blockquote>
      <hr class="separator structural-break" />
    </div>`;
  }

  // Decorative header for direct style
  let rusticHeader = '';
  if (profile.heuristics && profile.heuristics.isDirect) {
    rusticHeader = `<div class="subcapitol-rustic" data-affinity-style="Subtítol" aria-hidden="true" style="margin:0.6em 0;color:#666">${escapeXml(vp.separator)} ${escapeXml(title)}</div>`;
  }

  // Compose Rich XHTML tailored for semantic layouting
  const xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${escapeXml(lang)}">
  <head>
    <meta charset="utf-8"/>
    <title>${escapeXml(title)}</title>
    <link rel="stylesheet" type="text/css" href="../styles.css"/>
  </head>
  <body class="${escapeXml(bodyClass)}" data-profile-name="${escapeXml(vp.name)}">
    <article class="capitol-node" data-chapter-id="${index}">
      <header role="banner" class="capitol-header" data-affinity-style="Capçalera">
        <h1 data-affinity-style="Títol 1">${escapeXml(vp.titlePrefix || '')}${escapeXml(title)}</h1>
        ${rusticHeader}
      </header>
      
      <main role="main" class="capitol-body" data-affinity-region="MainText">
        ${epigraph}
        <div class="text-flow" data-affinity-style="Cos de text">
          ${paraHtml}
        </div>
      </main>
      
      <footer role="contentinfo" class="capitol-footer" data-affinity-style="Peu de Pàgina" style="margin-top:2em;color:#888;font-size:0.85em;border-top:1px solid #eee;padding-top:1em;">
        <div>Arxiu Memòria Viva · Doc-ID: ${index+1}</div>
      </footer>
    </article>
  </body>
</html>`;
  return xhtml;
}

/* =========================
   Export: module default
   ========================= */

export default {
  analyzeNarrativeVoice,
  generarEPUBLive,
  // helpers exported for testing or tuning
  _helpers: {
    tokenizeWords,
    splitSentences,
    estimateSyllables,
    EMO_LEXICA,
    TEMPORAL_MARKERS,
    ACTION_MARKERS
  }
};
