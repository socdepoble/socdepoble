import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';

export default function TextSection({ page, pageKey }) {
  const { t } = useAppData();
  return (
    <SectionChrome
      kicker={pageKey}
      title={page.title}
      subtitle={page.subtitle}
      meta={[t?.('section.text.page', 'Pàgina') || 'Pàgina', t?.('section.text.content', 'Contingut') || 'Contingut', t?.('section.text.text', 'Text') || 'Text']}
    >
      <div className="text-panel">
        <div className="text-panel__head">
          <h2 className="section-title">{page.title}</h2>
          <span className="pill">{pageKey}</span>
        </div>
        <div className="text-panel__body">
          <article dangerouslySetInnerHTML={{ __html: page.html }} />
        </div>
      </div>
    </SectionChrome>
  );
}
