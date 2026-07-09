function stripDangerousHtml(raw) {
  return String(raw || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
}

export function renderRichText(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;

  if (/<[a-z][\s\S]*>/i.test(raw)) {
    const cleanedHtml = stripDangerousHtml(raw);
    return <article className="detail-content" dangerouslySetInnerHTML={{ __html: cleanedHtml }} />;
  }

  const paragraphs = raw
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="detail-content detail-content--plain">
      {paragraphs.map((paragraph, index) => {
        const lines = paragraph.split(/\n/g);
        return (
          <p
            key={`${index}-${paragraph.slice(0, 18)}`}
            className="detail-content__paragraph detail-content__paragraph--plain"
          >
            {lines.map((line, lineIndex) => (
              <span key={`${index}-${lineIndex}`}>
                {line}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </article>
  );
}

export function renderPostContent(text) {
  return renderRichText(text);
}

export function renderPageHtml(text) {
  return String(text || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:18px;margin:18px 0;" />')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
