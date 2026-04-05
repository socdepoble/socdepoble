import React from "react";
import { Heart, MessageCircle, Repeat2, Share2 } from "lucide-react";
import UiButton from "../design/UiButton";

const FeedPostCard = ({
  author,
  town,
  publishedAt,
  content,
  stats,
  media,
  onLike,
  onComment,
  onRepost,
  onShare,
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20]);
    }
  };

  const handleAction = (callback) => (e) => {
    triggerHaptic();
    if (callback) callback(e);
  };

  return (
    <article className="atom-card atom-root" data-component="feed-post-card">
      <header className="atom-row">
        <div className="h-11 w-11 shrink-0 rounded-full bg-accent/20" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black leading-5 text-text">{author}</p>
          <p className="truncate text-xs leading-4 text-muted">{town} · {publishedAt}</p>
        </div>
      </header>

      <section className="atom-stack min-w-0">
        <p className="break-words text-sm leading-6 text-text">{content}</p>
        {media ? (
          <div className="aspect-[4/3] w-full overflow-hidden rounded-panel border border-border/15 bg-panel">
            <img src={media.src} alt={media.alt} className="h-full w-full object-cover" loading="lazy" />
          </div>
        ) : null}
      </section>

      <footer className="atom-stack">
        <div className="atom-row text-xs text-muted">
          <span>{stats.likes} likes</span>
          <span>{stats.comments} comentaris</span>
          <span>{stats.reposts} republicacions</span>
        </div>
        <div className="atom-divider" />
        <div className="grid grid-cols-4 gap-2">
          <UiButton variant="secondary" size="sm" className="w-full" onClick={handleAction(onLike)}>
            <Heart size={16} />
          </UiButton>
          <UiButton variant="secondary" size="sm" className="w-full" onClick={handleAction(onComment)}>
            <MessageCircle size={16} />
          </UiButton>
          <UiButton variant="secondary" size="sm" className="w-full" onClick={handleAction(onRepost)}>
            <Repeat2 size={16} />
          </UiButton>
          <UiButton variant="secondary" size="sm" className="w-full" onClick={handleAction(onShare)}>
            <Share2 size={16} />
          </UiButton>
        </div>
      </footer>
    </article>
  );
};

export default FeedPostCard;
