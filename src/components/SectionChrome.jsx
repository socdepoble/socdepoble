export default function SectionChrome({ kicker, title, subtitle, meta, children }) {
  return (
    <section className="section-shell">
      <header className="section-hero">
        <div className="section-hero__kicker">{kicker}</div>
        <h1 className="section-hero__title">{title}</h1>
        <p className="section-hero__subtitle">{subtitle}</p>
        {meta?.length ? (
          <div className="section-hero__meta">
            {meta.map((item) => (
              <span key={item} className="pill">{item}</span>
            ))}
          </div>
        ) : null}
      </header>
      {children}
    </section>
  );
}
