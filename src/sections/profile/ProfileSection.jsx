import { useParams } from 'react-router-dom';
import SectionChrome from '../../components/SectionChrome';
import SectionItemCard from '../../components/SectionItemCard';
import { useAppData } from '../../app/AppDataContext';

export default function ProfileSection({ agents = [] }) {
  const { t } = useAppData();
  const { agentId } = useParams();
  const selectedAgent = agents.find((agent) => String(agent.id) === String(agentId)) || null;

  return (
    <SectionChrome
      kicker={t('section.profile.kicker', 'Perfil')}
      title={t('section.profile.title', 'Agents i persones')}
      subtitle={t('section.profile.subtitle', 'Directori de persones, grups i agents del portal.')}
      meta={[t('section.profile.directory', 'Directori'), `${agents.length} agents`, t('nav.perfil', 'Perfil')]}
    >
      {selectedAgent ? (
        <div className="card card--soft" style={{ marginBottom: 18 }}>
          <div className="split-grid">
            <div className="media-frame" style={{ aspectRatio: '1 / 1' }}>
              <img src={selectedAgent.avatar_url} alt={selectedAgent.name} />
            </div>
            <div className="card__body" style={{ display: 'grid', alignContent: 'center' }}>
              <div className="badge-row">
                <span className="badge">{selectedAgent.tag}</span>
                <span className="badge">{selectedAgent.type}</span>
              </div>
              <h2 className="card__title" style={{ marginTop: 14 }}>{selectedAgent.name}</h2>
              <p className="card__text">{selectedAgent.role}</p>
              {selectedAgent.short_bio ? <p className="card__text">{selectedAgent.short_bio}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="feed-grid">
        {agents.map((agent, index) => (
          <SectionItemCard
            key={`${agent.id}-${index}`}
            to={`/perfil/${agent.id}`}
            state={{ preloadedItem: agent }}
            image={agent.avatar_url}
            title={agent.name}
            subtitle={agent.role}
            excerpt={agent.short_bio}
            eyebrow={agent.tag}
            meta={[agent.type]}
            buttonLabel={t('common.readMore', 'Llegir més')}
            className={String(agent.id) === String(selectedAgent?.id) ? 'card-link--active' : ''}
          />
        ))}
      </div>
    </SectionChrome>
  );
}
