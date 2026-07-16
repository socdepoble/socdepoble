#!/usr/bin/env node
/**
 * Generador Canonic de Targeta Universal - Pedra Seca
 *
 * This module returns pure HTML/JSX strings using only canonical Pedra Seca
 * classes. It intentionally avoids Tailwind utilities and inline styles.
 */

import { pathToFileURL } from 'node:url';

const DEFAULT_AVATAR = '/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg';

function escapeText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttr(value) {
  return escapeText(value)
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function compactText(value, fallback = '') {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text || fallback;
}

function classAttr(format) {
  return format === 'jsx' ? 'className' : 'class';
}

function closeImg(format) {
  return format === 'jsx' ? ' />' : '>';
}

function svgAttrs(format) {
  if (format === 'jsx') {
    return 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"';
  }
  return 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
}

function iconSvg(name, format = 'html') {
  const attrs = svgAttrs(format);
  if (name === 'languages') {
    return `<svg ${attrs}><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`;
  }
  if (name === 'message') {
    return `<svg ${attrs}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`;
  }
  if (name === 'share') {
    return `<svg ${attrs}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`;
  }
  if (name === 'plus') {
    return `<svg ${attrs}><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
  }
  return '';
}

function attrsToString(attrs) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false && value !== '')
    .map(([key, value]) => value === true ? key : `${key}="${escapeAttr(value)}"`)
    .join(' ');
}

export function normalitzaDadesTargeta(dades = {}) {
  const createdAt = dades.created_at || dades.createdAt || dades.dataISO || '';
  let data = dades.data || dades.date || '';
  let hora = dades.hora || dades.time || '';

  if ((!data || !hora) && createdAt) {
    const parsed = new Date(createdAt);
    if (!Number.isNaN(parsed.getTime())) {
      data ||= parsed.toLocaleDateString('ca-ES');
      hora ||= parsed.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
    }
  }

  return {
    id: compactText(dades.id),
    href: compactText(dades.href || dades.url),
    autorNom: compactText(dades.autorNom || dades.author || dades.author_name, 'Entitat'),
    autorPoble: compactText(dades.autorPoble || dades.poble || dades.location, 'La Torre de les Maçanes'),
    autorAvatar: compactText(dades.autorAvatar || dades.avatar || dades.avatar_url, DEFAULT_AVATAR),
    avatarAlt: compactText(dades.avatarAlt, 'Avatar'),
    hora: compactText(hora, '14:32'),
    data: compactText(data, '30/06/2026'),
    titol: compactText(dades.titol || dades.title || dades.seo_title, 'Sense titol'),
    subtitol: compactText(dades.subtitol || dades.subtitle || dades.category),
    descripcio: compactText(dades.descripcio || dades.description || dades.content || dades.seo_description),
    botoAccioLabel: compactText(dades.botoAccioLabel || dades.actionLabel, 'CONNECTAR'),
    botoAccioHref: compactText(dades.botoAccioHref || dades.actionHref),
  };
}

export function generarCaputxaUniversal(dades = {}, opcions = {}) {
  const format = opcions.format === 'jsx' ? 'jsx' : 'html';
  const c = classAttr(format);
  const d = normalitzaDadesTargeta(dades);

  return [
    `<header ${c}="uc-caputxa">`,
    `  <div ${c}="uc-autor-zona">`,
    `    <div ${c}="uc-avatar">`,
    `      <img src="${escapeAttr(d.autorAvatar)}" alt="${escapeAttr(d.avatarAlt)}"${closeImg(format)}`,
    '    </div>',
    `    <div ${c}="uc-autor-text">`,
    `      <span ${c}="uc-autor-nom">${escapeText(d.autorNom)}</span>`,
    `      <span ${c}="uc-autor-lloc">${escapeText(d.autorPoble)}</span>`,
    '    </div>',
    '  </div>',
    `  <div ${c}="uc-data-zona">`,
    `    <div>${escapeText(d.hora)}</div>`,
    `    <div>${escapeText(d.data)}</div>`,
    '  </div>',
    '</header>',
  ].join('\n');
}

export function generarCosUniversal(dades = {}, opcions = {}) {
  const format = opcions.format === 'jsx' ? 'jsx' : 'html';
  const c = classAttr(format);
  const d = normalitzaDadesTargeta(dades);

  return [
    `<div ${c}="uc-cos">`,
    `  <h1>${escapeText(d.titol)}</h1>`,
    d.subtitol ? `  <h2>${escapeText(d.subtitol)}</h2>` : '',
    d.descripcio ? `  <p>${escapeText(d.descripcio)}</p>` : '',
    '</div>',
  ].filter(Boolean).join('\n');
}

export function generarPeuUniversal(dades = {}, opcions = {}) {
  const format = opcions.format === 'jsx' ? 'jsx' : 'html';
  const c = classAttr(format);
  const d = normalitzaDadesTargeta(dades);
  const actionTag = d.botoAccioHref ? 'a' : 'button';
  const actionAttrs = attrsToString({
    [c]: 'uc-boto-accio',
    href: actionTag === 'a' ? d.botoAccioHref : undefined,
    type: actionTag === 'button' ? 'button' : undefined,
  });

  return [
    `<footer ${c}="uc-peu">`,
    `  <div ${c}="uc-icones-centre">`,
    `    <span aria-label="Traduir">${iconSvg('languages', format)}</span>`,
    `    <span aria-label="Comentar">${iconSvg('message', format)}</span>`,
    `    <span aria-label="Compartir">${iconSvg('share', format)}</span>`,
    '  </div>',
    `  <${actionTag} ${actionAttrs}>`,
    `    <span ${c}="uc-boto-icon">${iconSvg('plus', format)}</span>`,
    `    <span ${c}="uc-boto-text"> ${escapeText(d.botoAccioLabel)}</span>`,
    `  </${actionTag}>`,
    '</footer>',
  ].join('\n');
}

export function generarTargetaUniversal(dades = {}, opcions = {}) {
  const format = opcions.format === 'jsx' ? 'jsx' : 'html';
  const c = classAttr(format);
  const d = normalitzaDadesTargeta(dades);
  const wrapperTag = d.href ? 'a' : 'article';
  const wrapperAttrs = attrsToString({
    [c]: 'universal-card',
    href: d.href || undefined,
    'data-id': d.id || undefined,
  });

  return [
    `<${wrapperTag} ${wrapperAttrs}>`,
    indent(generarCaputxaUniversal(d, { format })),
    '',
    indent(generarCosUniversal(d, { format })),
    '',
    indent(generarPeuUniversal(d, { format })),
    `</${wrapperTag}>`,
  ].join('\n');
}

export function generarGridUniversal(items = [], opcions = {}) {
  const format = opcions.format === 'jsx' ? 'jsx' : 'html';
  const c = classAttr(format);
  const cards = items.map((item) => indent(generarTargetaUniversal(item, { format }))).join('\n');
  return `<div ${c}="universal-grid">\n${cards}\n</div>`;
}

export function generarPaginaUniversal({ titol, categoria, etiqueta, subtitol, items = [] } = {}, opcions = {}) {
  const format = opcions.format === 'jsx' ? 'jsx' : 'html';
  const c = classAttr(format);
  const pageTitle = compactText(titol, 'Soc de Poble');
  const pageCategory = compactText(categoria, 'COMUNITAT');
  const pageTag = compactText(etiqueta, 'LA TORRE DE LES MAÇANES');
  const pageSubtitle = compactText(subtitol, 'Ultimes publicacions');

  return [
    `<div ${c}="universal-page">`,
    `  <div ${c}="up-titol-wrapper">`,
    `    <div ${c}="up-titol-caixa">`,
    `      <h1>${escapeText(pageTitle)}</h1>`,
    `      <div ${c}="up-etiquetes">`,
    `        <span ${c}="up-categoria">${escapeText(pageCategory)}</span>`,
    `        <span ${c}="up-etiqueta">${escapeText(pageTag)}</span>`,
    '      </div>',
    '    </div>',
    '  </div>',
    `  <article ${c}="up-document">`,
    `    <h2 ${c}="up-subtitol-fora">${escapeText(pageSubtitle)}</h2>`,
    indent(generarGridUniversal(items, { format }), 4),
    '  </article>',
    '</div>',
  ].join('\n');
}

function indent(text, spaces = 2) {
  const pad = ' '.repeat(spaces);
  return text.split('\n').map((line) => line ? pad + line : line).join('\n');
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  console.log(generarTargetaUniversal({
    id: 'demo',
    autorNom: 'Javi Llinares',
    autorPoble: 'La Torre de les Maçanes',
    titol: 'Targeta universal neta',
    subtitol: 'Pedra Seca',
    descripcio: 'Sense Tailwind, sense styles inline, sense wrappers inventats.',
    botoAccioLabel: 'CONNECTAR',
  }));
}
