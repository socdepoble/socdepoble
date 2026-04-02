export const parseSimpleMarkdown = (text) => {
    if (!text || typeof text !== 'string') return '';
    let html = text
        .replace(/^###### (.*$)/gim, '<h6 class="font-bold text-[12px] md:text-[13px] uppercase tracking-wide text-theme-text/60 mt-2 mb-1">$1</h6>')
        .replace(/^##### (.*$)/gim, '<h5 class="font-bold text-[14px] md:text-[15px] text-theme-text/70 mt-2 mb-1">$1</h5>')
        .replace(/^#### (.*$)/gim, '<h4 class="font-bold text-[16px] md:text-[17px] text-theme-text/80 mt-3 mb-2">$1</h4>')
        .replace(/^### (.*$)/gim, '<h3 class="font-bold text-lg md:text-xl mt-4 mb-2 text-theme-text">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="font-black text-xl md:text-2xl mt-6 mb-3 text-[var(--theme-accent-primary)] tracking-tight">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="font-black text-2xl md:text-3xl mt-8 mb-4 text-theme-text tracking-tighter border-b border-white/10 pb-2">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-black text-theme-text">$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em class="italic text-theme-text/80">$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' class='rounded-[20px] shadow-lg my-6 w-full object-cover border border-white/5' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' class='text-[var(--theme-accent-primary)] hover:underline font-bold transition-colors' target='_blank'>$1</a>")
        .trim();

    // Wrap paragraphs properly
    html = html.split('\n\n').map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (!trimmed.startsWith('<h') && !trimmed.startsWith('<ul') && !trimmed.startsWith('<li') && !trimmed.startsWith('<img')) {
            return `<p class="mb-5 leading-relaxed text-[1.05rem] md:text-[1.1rem] opacity-90">${trimmed.replace(/\n/g, '<br/>')}</p>`;
        }
        return p;
    }).join('\n');

    return html;
};
