import { Link } from 'react-router-dom';
import { getSectionItemPath } from '../../config/navigation';

export default function MapTownCard({ town }) {
  return (
    <Link
      to={getSectionItemPath('pobles', town.id)}
      state={{ preloadedItem: town }}
      className="note-card"
    >
      <strong style={{ display: 'block' }}>{town.title}</strong>
      <p className="card__text" style={{ marginTop: 8 }}>{town.post_subtitle}</p>
      <span className="conversation-preview">{town.content}</span>
    </Link>
  );
}
