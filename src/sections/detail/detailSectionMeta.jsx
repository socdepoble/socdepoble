import { buildEventsDetailSectionMeta } from '../events/detail/detailSectionMeta.jsx';
import { buildMercatDetailSectionMeta } from '../mercat/detail/detailSectionMeta.jsx';
import { buildMultimediaDetailSectionMeta } from '../multimedia/detail/detailSectionMeta.jsx';
import { buildMurDetailSectionMeta } from '../mur/detail/detailSectionMeta.jsx';
import { buildNotesDetailSectionMeta } from '../notes/detail/detailSectionMeta.jsx';
import { buildPoblesDetailSectionMeta } from '../pobles/detail/detailSectionMeta.jsx';

export function buildDetailSectionMeta({ events, feedPosts, marketItems, mediaItems, notes, towns, t }) {
  return {
    mur: buildMurDetailSectionMeta({ feedPosts, t }),
    mercat: buildMercatDetailSectionMeta({ marketItems, t }),
    events: buildEventsDetailSectionMeta({ events, t }),
    pobles: buildPoblesDetailSectionMeta({ towns, t }),
    multimedia: buildMultimediaDetailSectionMeta({ mediaItems, t }),
    notes: buildNotesDetailSectionMeta({ notes, t })
  };
}
