import React from "react";

const laws = [
  { icon: "🪨", title: "Respecte al Lloc", text: "Cada component viu al seu lloc. No el mogues amb transforms que trenquen la vista." },
  { icon: "🎨", title: "Una Font, Una Veritat", text: "Colors, mides i corbes venen d'un sol fitxer de tokens." },
  { icon: "🤫", title: "No Robis el Focus", text: "Les notificacions han d'anunciar-se amb cura; no interrompre sense motiu." },
  { icon: "🩸", title: "La Cicatriu d'Or", text: "No amaguem els errors baix l'estora. Les cicatrius sanen amb or (Kintsugi)." },
  { icon: "👁️", title: "Transparència i Control", text: "Si recordem alguna cosa sobre tu, t'ho diem i et donem control total." },
  { icon: "🌾", title: "Trellat per Defecte", text: "Simplicitat, semàntica i accessibilitat són l'únic camí vàlid." }
];

export default function LawsGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {laws.map((l, i) => (
        <article key={i} className="law-card bg-[var(--sdp-bg-surface)] p-8 rounded-2xl border border-[var(--color-brasa)]/30 hover:border-[var(--color-brasa)] transition-all duration-300 shadow-sm fade-in-up group" tabIndex={0}>
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{l.icon}</div>
          <h3 className="font-bold text-xl mb-3 text-white">{l.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{l.text}</p>
        </article>
      ))}
    </div>
  );
}
