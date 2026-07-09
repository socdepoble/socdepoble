const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const inlineFormat = (value) =>
  escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

export function markdownToHtml(markdown) {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  const output = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let codeFence = null;
  let codeBuffer = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${inlineFormat(paragraph.join(' ').trim())}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || !listItems.length) return;
    const tag = listType === 'ol' ? 'ol' : 'ul';
    output.push(`<${tag}>${listItems.map((item) => `<li>${inlineFormat(item)}</li>`).join('')}</${tag}>`);
    listType = null;
    listItems = [];
  };

  const flushCode = () => {
    if (!codeFence) return;
    const langClass = codeFence === 'css' ? ' class="language-css"' : '';
    output.push(`<pre><code${langClass}>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
    codeFence = null;
    codeBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (codeFence) {
      if (trimmed === '```') {
        flushCode();
      } else {
        codeBuffer.push(rawLine);
      }
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const codeMatch = trimmed.match(/^```([a-z0-9-]*)$/i);
    if (codeMatch) {
      flushParagraph();
      flushList();
      codeFence = codeMatch[1].toLowerCase() || 'text';
      codeBuffer = [];
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      output.push(`<h${level}>${inlineFormat(headingMatch[2])}</h${level}>`);
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(unorderedMatch[1]);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(orderedMatch[1]);
      continue;
    }

    if (trimmed === '---') {
      flushParagraph();
      flushList();
      output.push('<hr />');
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      flushList();
      output.push(`<blockquote><p>${inlineFormat(trimmed.replace(/^>\s?/, ''))}</p></blockquote>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushCode();

  return output.join('\n');
}
